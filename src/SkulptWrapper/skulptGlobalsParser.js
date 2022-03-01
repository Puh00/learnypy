import { v4 as uuidv4 } from 'uuid';

class GlobalsParser {
  constructor() {
    this.variables = [];
    this.objects = [];
  }

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

      let _id = this.retrieve_object_id(value, this.objects);

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

      this.delete_unreferenced_objects();
    }

    if (typeof callback === 'function') {
      this.callback(callback);
    }
  }

  // Retrieve the object id for the given value.
  // If the value already exists the id to the already existing object is returned.
  // Otherwise a new object is created and this id is returned.
  retrieve_object_id(value, objects) {
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
  delete_unreferenced_objects() {
    for (let i = 0; i < this.objects.length; i++) {
      if (!this.variables.some((v) => v.ref === this.objects[i].id)) {
        this.objects.splice(i, 1);
        i--;
      }
    }
  }

  // callback function with the current status as parameter
  callback(func) {
    func({ objects: this.objects, variables: this.variables });
  }
}

export default GlobalsParser;
