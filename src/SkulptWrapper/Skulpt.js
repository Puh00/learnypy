import { parse_globals, parse_locals } from './skulptParser';

/**
 * Wrapper class of the Skulpt module.
 */
class Skulpt {
  /**
   * Constructor.
   *
   * @param {Object} config Optional. An object containing the following properties/functions:
   * - read_builtin: Don't bother with this function, idk what it does.
   * - outf: Called whenever Skulpt runs a line that prints to the console.
   * - current_line: Called whenever the debugger suspenses at a line.
   * - success: Called when the program finished running in the debugger.
   * - error: Called when the program threw an error in the debugger.
   * - print: Logging function used by the debugger to print out the state of the suspensions/debugger.
   */
  constructor(config) {
    // initialise globals if it's undefined to prevent some obscure error
    window.Sk.globals = window.Sk.globals ? window.Sk.globals : {};

    // initialise default configs
    this.defaultConfig = {
      read_builtin: (x) => {
        if (window.Sk.builtinFiles || window.Sk.builtinFiles['files'][x])
          throw "File not found: '" + x + "'";
        return window.Sk.builtinFiles['files'][x];
      },
      outf: (text) => {
        const output = document.getElementById('output');
        output.setAttribute('aria-label', 'Output from code');
        output.innerHTML = output.innerHTML + text;
      },
      current_line: (lineno) => lineno,
      print: (text) => text,
      success: () => {},
      error: (e) => e
    };

    // fill the configs using the defaultConfig
    this.configure(this.defaultConfig);
    // configure using the given config files
    this.configure(config);

    this.breakpoints = [];
    this.debugger = this.create_debugger();
  }

  /**
   * @returns A singleton instance of this class.
   */
  static instance() {
    if (!this.skulpt) this.skulpt = new Skulpt();
    return this.skulpt;
  }

  /**
   * Configures the Skulpt wrapper object.
   *
   * @param {Object} config An object containing the following properties/functions:
   * - read_builtin: Don't bother with this function, idk what it does.
   * - outf: Called whenever Skulpt runs a line that prints to the console.
   * - current_line: Called whenever the debugger suspenses at a line.
   * - print: Logging function used by the debugger to print out the state of the suspensions/debugger.
   * - success: Called when the program finished running in the debugger.
   * - error: Called when the program threw an error in the debugger.
   */
  configure(config) {
    if (!config) return;

    this.read_builtin = config.read_builtin ? config.read_builtin : this.read_builtin;
    this.outf = config.outf ? config.outf : this.outf;
    this.current_line = config.current_line ? config.current_line : this.current_line;
    this.print = config.print ? config.print : this.print;
    this.success = config.success ? config.success : this.success;
    this.error = config.error ? config.error : this.error;
  }

  /**
   * Creates a new Sk.Debugger object with the newest configurations.
   *
   * @returns A new Sk.Debugger object
   */
  create_debugger() {
    return new window.Sk.Debugger('<stdin>', {
      print: () => {
        this.print();
      },
      // this function is not being used but needs to be initialised to not cause errors.
      get_source_line: (lineno) => `Line: ${lineno}`,
      current_line: (lineno) => {
        this.current_line(lineno);
      },
      success: () => {
        this.success();
      },
      error: () => {
        this.error();
      }
    });
  }

  /**
   * Reinitialises all breakpoint in the debugger.
   */
  init_breakpoints() {
    this.debugger.clear_all_breakpoints();
    this.breakpoints.forEach((bp) => {
      this.debugger.add_breakpoint('<stdin>.py', bp + 1, 0, false);
    });
  }

  /**
   * Replaces the breakpoints with a new array of breakpoints.
   *
   * @param {Array} bps An array of line numbers representing as breakpoints.
   */
  update_breakpoints(bps) {
    this.breakpoints = [...bps];
  }
  /**
   * Restarts the program given the code.
   *
   * @param {String} prog The code of the program, as a string.
   * @param {Function} callback A callback function called with no arguments after the program has been restarted.
   */
  restart(prog, callback) {
    // enable step_mode at the beginning to avoid executing this program
    this.debugger.enable_step_mode();

    // configure Sk with settings i'm not even sure what they do
    window.Sk.configure({
      output: this.outf,
      read: this.builtinRead,
      yieldLimit: null,
      execLimit: null,
      debugging: true,
      breakpoints: this.debugger.check_breakpoints.bind(this.debugger)
    });

    // the following code run the code in the debugger
    const promise = this.debugger.asyncToPromise(
      () => window.Sk.importMainWithBody('<stdin>', false, prog, true),
      null, // the debugger literally doesn't use this...
      this.debugger
    );

    promise.then(
      this.debugger.success.bind(this.debugger),
      this.debugger.error.bind(this.debugger)
    );

    // call the callback function if it is a function
    if (typeof callback === 'function') {
      callback();
    }

    // disable step_mode since we just restarted
    this.debugger.disable_step_mode();
  }

  /**
   * Steps the program to the next line.
   *
   * @param {String} prog The code of the program, as a string.
   * @param {Function} callback A callback function called with the current globals and locals as arguments.
   */
  step(prog, callback) {
    this.debugger.enable_step_mode();
    this.debugger.resume.call(this.debugger);

    // calls the callback function if it is a function
    if (typeof callback === 'function') {
      callback(parse_globals(), parse_locals());
    }
  }

  /**
   * Runs the program, until a breakpoint or the end.
   *
   * @param {String} prog The code of the program, as a string.
   * @param {Function} callback A callback function called with the current globals and locals as arguments.
   */
  run(prog, callback) {
    this.init_breakpoints();

    // if the is no active suspension, then we restart the program
    if (!this.debugger.get_active_suspension()) {
      this.restart(prog);
    }

    this.debugger.disable_step_mode();
    this.debugger.resume.call(this.debugger);

    // calls the callback function if it is a function
    if (typeof callback === 'function') {
      callback(parse_globals(), parse_locals());
    }
  }
}

export default Skulpt;
