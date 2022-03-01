/* eslint-disable no-unused-vars */
import GlobalsParser from './skulptGlobalsParser';

// instantiate the globals since undefined in JavaScript is a atrocious
window.Sk.globals = {};

//------------------------------Builtin functions-------------------------------
function builtinRead(x) {
  if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles['files'][x] === undefined)
    throw "File not found: '" + x + "'";
  return window.Sk.builtinFiles['files'][x];
}

function outf(text) {
  var mypre = document.getElementById('output');
  mypre.setAttribute('aria-label', 'Output from code');
  mypre.innerHTML = mypre.innerHTML + text;
}

// export this object to dynamically "override" the builtin functions
const func = {
  builtinRead: builtinRead,
  outf: outf
};
//------------------------------------------------------------------------------

// Initialize a new debugger object.
const init_debugger = () => {
  const get_line_status = (lineno) => {
    if (lineno !== 0) {
      return (
        'Line ' +
        lineno +
        ' status:\n' +
        'Variables:\n' +
        JSON.stringify(parser.variables) +
        '\nObjects:\n' +
        JSON.stringify(parser.objects)
      );
    } else {
      return '';
    }
  };

  return new window.Sk.Debugger('<stdin>', {
    print: (txt) => console.log(txt),
    get_source_line: get_line_status,
    error: (e) => func.outf(e)
  });
};

const start_debugger = (prog, callback) => {
  dbg.enable_step_mode();

  window.Sk.configure({
    output: func.outf,
    read: func.builtinRead,
    yieldLimit: null,
    execLimit: null,
    debugging: true,
    breakpoints: dbg.check_breakpoints.bind(dbg)
  });

  if (typeof callback === 'function') {
    callback();
  }

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
};

//Loop through break_points and add a breakpoint at every line
const init_break_points = () => {
  for (let break_point of break_points) {
    dbg.add_breakpoint('<stdin>.py', break_point, 0, false);
  }
};

// utility breakpoint functions that might be used later
const add_breakpoints = (bps) => {
  break_points.push(...bps);
};

const add_breakpoint = (bp) => {
  break_points.push(bp);
};

const clear_breakpoints = () => {
  break_points = [];
};

const start = (prog, step_mode = false, callback) => {
  console.log('Reset status');
  parser = new GlobalsParser();
  dbg = init_debugger();
  init_break_points();
  start_debugger(prog, callback);

  //Determine the mode for the debugging
  dbg.step_mode = step_mode;
};

const step = (prog, callback) => {
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

  parser.update_status(callback);
};

function runit(prog, callback) {
  //If there is a current suspension, disable step_mode
  //and continue where the program left off
  if (dbg.get_active_suspension() != null) {
    dbg.disable_step_mode();
    dbg.resume.call(dbg);
    parser.update_status(callback);
    return;
  }

  //If we are in step_mode, disable it
  if (dbg.step_mode == true) {
    dbg.disable_step_mode();
    //If the current suspension stack is empty, run the program normally.
    //Otherwise, resume the debugging with step_mode disabled
    if (dbg.get_active_suspension() == null) {
      start(prog, false, callback);
      dbg.resume.call(dbg);
    } else {
      dbg.resume.call(dbg);
    }

    //Just start the program normally
  } else {
    start(prog, false, callback);
    dbg.resume.call(dbg);
  }

  parser.update_status(callback);
}

// -----------------------------------------------------------------------------
let parser = new GlobalsParser();
let dbg = init_debugger();
let break_points = [];
// -----------------------------------------------------------------------------

export { func, start, step, runit, add_breakpoint, add_breakpoints, clear_breakpoints };
