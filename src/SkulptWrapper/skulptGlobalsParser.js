import { v4 as uuidv4 } from 'uuid';

class GlobalsParser {
  constructor() {
    this.variables = [];
    this.objects = [];
  }
  internal_objects = [];

  // Update variables and objects using the current status of the Skulpt execution.
  update_status(callback) {
    let skip = 4;

    // Must be from Sk.globals and not Sk.builtin.globals, since the latter creates an entirely
    // new dictionary which renders the '===' operator useless for reference checking (which is
    // used in retrieve_object_id(...))
    for (const [key, value] of Object.entries(window.Sk.globals)) {
      if (skip > 0) {
        skip--;
        continue;
      }

      let _id = this.retrieve_object_id(value, this.internal_objects);
      // Check if variable is already in variables, or if new variable should be added.
      const variable = this.variables.find((v) => v.name === key);
      if (variable) {
        variable.ref = _id;
      } else {
        this.variables.push({
          name: key,
          ref: _id
        });
      }
    }

    this.regenerate_objects();

    if (typeof callback === 'function') {
      this.callback(callback);
    }
  }

  // Replace objects with new array based on internal_object
  regenerate_objects() {
    let test = [];
    for (let i = 0; i < this.internal_objects.length; i++) {
      if (this.internal_objects[i].type === 'list') {
        let test2 = [];
        for (const v of this.internal_objects[i].value.v) {
          test2.push({ ref: this.retrieve_object_id(v) });
        }
        test.push({ ...this.internal_objects[i], value: test2 });
      } else {
        test.push(this.internal_objects[i]);
      }
    }
    this.objects = test;

    this.remove_unreferenced_objects();
  }

  // Retrieve the object id for the given value.
  // If the value already exists the id to the already existing object is returned.
  // Otherwise a new object is created and this id is returned.
  retrieve_object_id(value) {
    for (const obj of this.internal_objects) {
      // '===' returns true only if the objects have the same reference
      if (obj.value === value) {
        return obj.id;
      }
    }
    // If the object doesn't exist yet add it and return new id
    let _id = uuidv4();
    this.internal_objects.push({
      id: _id,
      value: value,
      type: value.tp$name
    });
    return _id;
  }

  // Remove all objects that has no reference to them.
  remove_unreferenced_objects() {
    for (let i = 0; i < this.objects.length; i++) {
      let id = this.objects[i].id;
      if (!(this.is_ref_by_var(id) || this.is_ref_by_obj(id))) {
        this.objects.splice(i, 1);
        i--;
      }
    }
  }

  // Returns true if there is a variable referencing the given id, otherwise false.
  is_ref_by_var(id) {
    return this.variables.some((v) => v.ref === id);
  }

  // Returns true if there is an object referencing the given id, otherwise false.
  is_ref_by_obj(id) {
    for (const obj of this.objects) {
      if (obj.value === id) {
        return true;
      }
      if (obj.type === 'list') {
        // Also check all elements in the list
        if (obj.value.some((v) => v.ref === id)) {
          return true;
        }
      }
      // Add more object types that can reference other objects
    }
    return false;
  }

  // callback function with the current status as parameter
  callback(func) {
    func({ objects: this.objects, variables: this.variables });
  }
}

export default GlobalsParser;
