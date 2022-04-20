import { parse_globals, parse_locals, retrieve_object_id } from './skulptParser';

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
  async step(prog, callback) {
    let old_globals = parse_globals();

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
   * The function will detect which references has been assigned a new object
   * and add as a dead reference a reference to the old object.
   * An old object that does not exist in new_data is created and added.
   *
   * @param {{Array, Array}} old_data: the data from before a step was taken
   * @param {{Array, Array}} new_data: the data after a step was taken,
   *   will be modified to contain all dead references
   */
  set_dead_refs(old_data, new_data) {
    // get reference from a given index in list, dictionary or class
    const get_val_or_ref = (obj, index) => {
      if (['dictionary', 'class'].includes(obj.info.type)) {
        return obj.value[index].val;
      } else if (['list'].includes(obj.info.type)) {
        return obj.value[index].ref;
      }
    };

    // add dead_ref for all affected variables
    for (const old_var of old_data.variables) {
      // find the old object that the variable reference points to
      const old_obj = old_data.objects.find((elem) => elem.id === old_var.ref);
      if (!old_obj) continue;

      // find the new variable
      const new_var = new_data.variables.find((elem) => elem.name === old_var.name);
      if (!new_var) continue;

      // get the new id of the object using js_object
      let new_obj_id = retrieve_object_id(new_data.objects, old_obj.js_object);

      if (new_var.ref !== new_obj_id) {
        // new assignment -> add the new id of the old object to dead_ref
        new_var.dead_ref = new_obj_id;
      }
    }

    // add dead_ref to all affected objects
    for (const old_obj of old_data.objects) {
      // only set dead_ref for types that are changeable and contain references
      if (!['list', 'dictionary', 'class'].includes(old_obj.info.type)) continue;

      // find the new object by comparing js_object
      const new_obj = new_data.objects.find((elem) => elem.js_object === old_obj.js_object);
      if (!new_obj) continue;

      // check each index in value
      for (let index = 0; index < old_obj.value.length && index < new_obj.value.length; index++) {
        // get the object that the index is referencing
        const ref_obj = old_data.objects.find((elem) => elem.id === get_val_or_ref(old_obj, index));
        if (!ref_obj) continue;

        // get the new id for the referenced object
        const new_ref_obj_id = retrieve_object_id(new_data.objects, ref_obj.js_object);

        if (get_val_or_ref(new_obj, index) !== new_ref_obj_id) {
          // new assignment -> add to dead_ref, the new id to the old referenced object
          new_obj.value[index].dead_ref = new_ref_obj_id;
        }
      }
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
