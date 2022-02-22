import React from 'react';
import './App.css';
import CodeBox from './Components/CodeBox';
import Header from './Components/Header';
import Control_panel from './Components/ControlPanel';
import Visual_box from './Components/VisualBox';

let variables = [];
let objects = [];
let dbg = init_debugger();

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

function alt_collect_variables() {
  //variables = [];
  //objects = [];
  let skip = 4;

  // must be from Sk.globals and not Sk.builtin.globals, since the latter creates an entirely
  // new dictionary which renders the '===' operator useless for reference checking (which is
  // used in retrieve_object_id(...))
  window.Sk.global.console.log(window.Sk.globals);
  for (const [key, value] of Object.entries(window.Sk.globals)) {
    if (skip > 0) {
      skip--;
      continue;
    }
    // retrieve id
    let _id = retrieve_object_id(value, objects);

    // check if variable is already in variables
    const variable = variables.find((v) => v.name === key);
    if (variable) {
      variable.ref = _id;
    } else {
      // Add new variable
      variables.push({
        name: key,
        ref: _id
      });
    }
    delete_unreferenced_objects();
  }
}

function retrieve_object_id(value, objects) {
  // fetch id if the object already exists

  for (let obj in objects) {
    // '===' returns true only if the objects have the same reference
    if (obj.value === value) {
      return obj.id;
    }
  }
  // if the object doesn't exist yet add it and return new id
  let _id = uuidv4();
  objects.push({
    id: _id,
    value: value,
    type: value.tp$name
  });
  return _id;
}

/*
    Delete all objects that has no variable referencing them.
    */
function delete_unreferenced_objects() {
  for (let i = 0; i < objects.length; i++) {
    if (!variables.some((v) => v.ref === objects[i].id)) {
      objects.splice(i, 1);
      i--;
    }
  }
}

// temporary id generator
function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

/*Take steps using debugger------------------------------------------------------------------*/

// initialize a new debugger object
function init_debugger() {
  return new window.Sk.Debugger('<stdin>', {
    print: (txt) => console.log(txt),
    get_source_line: (lineno) => get_line_status(lineno)
  });
}

function builtinRead(x) {
  if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles['files'][x] === undefined)
    throw "File not found: '" + x + "'";
  return window.Sk.builtinFiles['files'][x];
}

function test_debugger(prog) {
  //dbg.add_breakpoint("<stdin>.py", 0, 0, false);
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
  step();
}

const start = (prog) => {
  console.log('Reset status');
  dbg = init_debugger();
  variables = [];
  objects = [];
  test_debugger(prog);
};

const step = (prog) => {
  if (dbg.step_mode === false) {
    start(prog);
  } else {
    dbg.resume.call(dbg);
    alt_collect_variables();
  }
};

function outf(text) {
  var mypre = document.getElementById('output');
  mypre.innerHTML = mypre.innerHTML + text;
}

function runit(prog) {
  if (dbg.step_mode === true) {
    dbg.step_mode = false;
    dbg.resume.call(dbg);
  } else {
    window.Sk.global.console.log('hej');
    window.Sk.pre = 'output';
    window.Sk.configure({ output: outf, read: builtinRead });
    (window.Sk.TurtleGraphics || (window.Sk.TurtleGraphics = {})).target = 'mycanvas'; //Remove?
    var myPromise = window.Sk.misceval.asyncToPromise(function () {
      return window.Sk.importMainWithBody('<stdin>', false, prog, true);
    });
    myPromise.then(
      function () {
        console.log('success');
      },
      function (err) {
        console.log(err.toString());
      }
    );
  }
}

function App() {
  return (
    <div className="App">
      <Header />
      <div id="App-body">
        <div id="Left-body">
          <Control_panel />
          <CodeBox runit={runit} restart={start} step={step}></CodeBox>
          <pre id="output"></pre>
        </div>
        <div id="Right-body">
          <Visual_box />
        </div>
      </div>
    </div>
  );
}
export default App;
