import { parse_globals, parse_locals, retrieve_object_id } from 'src/skulpt-wrapper/skulptParser';

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
      print: (text) => {
        this.print(text);
      },
      // this function is not being used but needs to be initialised to not cause errors.
      get_source_line: (lineno) => `Line: ${lineno}`,
      current_line: (lineno) => {
        this.current_line(lineno);
      },
      success: () => {
        this.success();
      },
      error: (e) => {
        this.error(e);
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
   * @param {Boolean} run A boolean used to denote if the intention is to run the program or not after restart
   */
  restart(prog, callback, run) {
    // enable step_mode at the beginning to avoid executing this program
    this.debugger = this.create_debugger();
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

    //If the intention is to run the program, load the debugger with the code.
    //Otherwise, load the debugger with nothing. This is to make sure that
    //it's possible to restart the debugger even if the code doesn't compile.
    let promise = this.debugger.asyncToPromise(
      () => window.Sk.importMainWithBody('<stdin>', false, run ? prog : '', true),
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
    this.init_breakpoints();
    this.debugger.disable_step_mode();
  }

  /**
   * Steps the program to the next line.
   *
   * @param {String} prog The code of the program, as a string.
   * @param {Function} callback A callback function called with the current globals and locals as arguments.
   */
  async step(prog, callback) {
    let old_globals = parse_globals();

    //If there isn't any program running, restart the debugger
    //with the appropriate code
    if (!this.debugger.get_active_suspension()) {
      this.restart(prog, null, true);
    }
    this.debugger.enable_step_mode();
    await this.debugger.resume.call(this.debugger);

    let new_globals = parse_globals();

    this.set_dead_refs(old_globals, new_globals);

    // calls the callback function if it is a function
    if (typeof callback === 'function') {
      callback(new_globals, parse_locals());
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

    //If there isn't any program running, restart the debugger
    //with the appropriate code
    if (!this.debugger.get_active_suspension()) {
      this.restart(prog, null, true);
    }

    this.debugger.disable_step_mode();
    this.debugger.resume.call(this.debugger);

    // calls the callback function if it is a function
    if (typeof callback === 'function') {
      callback(parse_globals(), parse_locals());
    }
  }

  // Dead references ----------------------------------------------------------

  /**
   * The function will detect which references has been assigned a new object
   * and add as a dead reference a reference to the old object.
   * An old object that does not exist in new_data is created and added.
   *
   * @param {{Array, Array}} old_data: the data from before a step was taken
   * @param {{Array, Array}} new_data: the data after a step was taken,
   *   will be modified to contain all dead references
   */
  set_dead_refs(old_data, new_data) {
    // add dead_ref for all affected variables
    for (const old_var of old_data.variables) {
      const old_obj = old_data.objects.find((elem) => elem.id === old_var.ref);
      const new_var = new_data.variables.find((elem) => elem.name === old_var.name);
      if (!new_var || !old_obj) continue;
      let new_obj_id = retrieve_object_id(new_data.objects, old_obj.js_object);

      if (new_var.ref !== new_obj_id) {
        // new assignment -> add new id of old object to dead_ref
        new_var.dead_ref = new_obj_id;
      }
    }

    // add dead_ref for all affected objects
    for (const old_obj of old_data.objects) {
      if (!['list', 'dictionary', 'class'].includes(old_obj.info.type)) continue;

      const new_obj = new_data.objects.find((elem) => elem.js_object === old_obj.js_object);
      if (!new_obj) continue;

      for (let index = 0; index < old_obj.value.length && index < new_obj.value.length; index++) {
        // get the object that the index is referencing
        const ref_obj = old_data.objects.find(
          (elem) => elem.id === this.get_index_ref(old_obj, index)
        );
        if (!ref_obj) continue;
        const new_ref_obj_id = retrieve_object_id(new_data.objects, ref_obj.js_object);

        if (this.get_index_ref(new_obj, index) !== new_ref_obj_id) {
          // new assignment -> add new id of old referenced object to dead_ref
          new_obj.value[index].dead_ref = new_ref_obj_id;
        }
      }
    }
  }

  // helper method for set_dead_refs()
  // returns reference from a given index/val/attribute in list/dictionary/class
  get_index_ref(obj, index) {
    if (['dictionary', 'class'].includes(obj.info.type)) {
      return obj.value[index].val;
    } else if (['list'].includes(obj.info.type)) {
      return obj.value[index].ref;
    }
  }
}

export default Skulpt;
