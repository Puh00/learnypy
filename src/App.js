import React, { useState } from 'react';
import './App.css';
import CodeBox from './Components/CodeBox';
import Header from './Components/Header';
import Control_panel from './Components/ControlPanel';
import VisualBox from './Components/VisualBox';

let variables = [];
let objects = [];
let dbg = init_debugger();
let break_points = [];
var last_output;

// Reference handling------------------------------------------------------------------------------

// Return a string representing the current status.
function get_line_status(lineno) {
  if (lineno !== 0) {
    return (
      'Line ' +
      lineno +
      ' status:\n' +
      'Variables:\n' +
      JSON.stringify(variables) +
      '\nObjects:\n' +
      JSON.stringify(objects)
    );
  } else {
    return '';
  }
}

// Update variables and objects using the current status of the Skulpt execution.
function update_status() {
  let skip = 4;

  // Must be from Sk.globals and not Sk.builtin.globals, since the latter creates an entirely
  // new dictionary which renders the '===' operator useless for reference checking (which is
  // used in retrieve_object_id(...))
  for (const [key, value] of Object.entries(window.Sk.globals)) {
    if (skip > 0) {
      skip--;
      continue;
    }

    let _id = retrieve_object_id(value, objects);

    // Check if variable is already in variables, or if new variable should be added.
    const variable = variables.find((v) => v.name === key);
    if (variable) {
      variable.ref = _id;
    } else {
      variables.push({
        name: key,
        ref: _id
      });
    }

    delete_unreferenced_objects();
  }
}

// Retrieve the object id for the given value.
// If the value already exists the id to the already existing object is returned.
// Otherwise a new object is created and this id is returned.
function retrieve_object_id(value, objects) {
  for (const obj of objects) {
    // '===' returns true only if the objects have the same reference
    if (obj.value === value) {
      return obj.id;
    }
  }
  // If the object doesn't exist yet add it and return new id
  let _id = uuidv4();
  objects.push({
    id: _id,
    value: value,
    type: value.tp$name
  });
  return _id;
}

// Delete all objects that has no variable referencing them.
function delete_unreferenced_objects() {
  for (let i = 0; i < objects.length; i++) {
    if (!variables.some((v) => v.ref === objects[i].id)) {
      objects.splice(i, 1);
      i--;
    }
  }
}

// Temporary id generator
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

// Take steps using debugger-----------------------------------------------------------------------

// Initialize a new debugger object.
function init_debugger() {
  return new window.Sk.Debugger('<stdin>', {
    print: (txt) => console.log(txt),
    get_source_line: (lineno) => get_line_status(lineno),
    error: (e) => outf(e)
  });
}

function builtinRead(x) {
  if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles['files'][x] === undefined)
    throw "File not found: '" + x + "'";
  return window.Sk.builtinFiles['files'][x];
}

function outf(text) {
  var mypre = document.getElementById('output');
  mypre.setAttribute('aria-label', 'Output from code');
  //new line for every error message
  if (String(last_output).includes('SyntaxError')) {
    text = '\n' + text;
    mypre.innerHTML = mypre.innerHTML + text;
  } else mypre.innerHTML = mypre.innerHTML + text;
  last_output = text;
}

function start_debugger(prog) {
  dbg.enable_step_mode();

  window.Sk.configure({
    output: outf,
    read: builtinRead,
    yieldLimit: null,
    execLimit: null,
    debugging: true,
    breakpoints: dbg.check_breakpoints.bind(dbg)
  });

  let susp_handlers = {};
  susp_handlers['*'] = dbg.suspension_handler.bind(this);

  let myPromise = dbg.asyncToPromise(
    function () {
      return window.Sk.importMainWithBody('<stdin>', false, prog, true);
    },
    susp_handlers,
    dbg
  );
  myPromise.then(dbg.success.bind(dbg), dbg.error.bind(dbg));
  update_status();
}

//Loop through break_points and add a breakpoint at every line
const init_break_points = () => {
  for (let break_point of break_points) {
    dbg.add_breakpoint('<stdin>.py', break_point, 0, false);
  }
};

const start = (prog, step_mode) => {
  console.log('Reset status');
  dbg = init_debugger();
  init_break_points();
  variables = [];
  objects = [];
  start_debugger(prog);

  //Determine the mode for the debugging
  dbg.step_mode = step_mode;
};

const step = (prog) => {
  //If there is a current suspension, enable step_mode
  //and continue where the program stopped
  if (dbg.get_active_suspension() != null) {
    dbg.enable_step_mode();
    dbg.resume.call(dbg);

    //If step_mode is false, restart the program and
    //enable step_mode. The only scenario for this is if
    //the program starts from the beggining
  } else if (dbg.step_mode == false) {
    start(prog, true);
    dbg.enable_step_mode();
    dbg.resume.call(dbg);

    //Otherwise, just keep stepping
  } else {
    dbg.resume.call(dbg);
  }

  update_status();
  hack_set_refs({ objects: objects, variables: variables });
};

// ------------------------------------------------------------------------------------------------

function runit(prog) {
  //If there is a current suspension, disable step_mode
  //and continue where the program left off
  if (dbg.get_active_suspension() != null) {
    dbg.disable_step_mode();
    dbg.resume.call(dbg);
    update_status();
    hack_set_refs({ objects: objects, variables: variables });
    return;
  }

  //If we are in step_mode, disable it
  if (dbg.step_mode == true) {
    dbg.disable_step_mode();
    //If the current suspension stack is empty, run the program normally.
    //Otherwise, resume the debugging with step_mode disabled
    if (dbg.get_active_suspension() == null) {
      start(prog, false);
      dbg.resume.call(dbg);
    } else {
      dbg.resume.call(dbg);
    }

    //Just start the program normally
  } else {
    start(prog, false);
    dbg.resume.call(dbg);
  }
  update_status();
  hack_set_refs({ objects: objects, variables: variables });
}

let hack_set_refs;

function App() {
  // eslint-disable-next-line no-unused-vars
  const [refs, setRefs] = useState({ objects: objects, variables: variables });

  hack_set_refs = setRefs;

  return (
    <div className="App">
      <Header />
      <div id="App-body">
        <div id="Left-body">
          <Control_panel />
          <CodeBox runit={runit} restart={start} step={step}></CodeBox>
          <pre id="output" tabIndex={0}></pre>
        </div>
        <div id="Right-body">
          <VisualBox data={refs} />
        </div>
      </div>
    </div>
  );
}
export default App;
