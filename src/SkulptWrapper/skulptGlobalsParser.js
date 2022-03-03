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

      let _id = this.retrieve_object_id(value);
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

    this.update_values();
    this.remove_unreferenced_objects();

    if (typeof callback === 'function') {
      this.callback(callback);
    }
  }

  // Create new object
  // (value is used to represent object, js_object is used for comparison)
  create_object(js_object) {
    if (js_object.tp$name === 'list') {
      let value = [];
      for (const v of js_object.v) {
        value.push({ ref: this.retrieve_object_id(v) });
      }
      return {
        id: uuidv4(),
        value: value,
        type: js_object.tp$name,
        js_object: js_object
      };
      // Add more types here
    } else {
      return {
        id: uuidv4(),
        value: js_object.v,
        type: js_object.tp$name,
        js_object: js_object
      };
    }
  }

  // Update all values (if there was a change in js_object)
  update_values() {
    for (let i = 0; i < this.objects.length; i++) {
      if (this.objects[i].type === 'list') {
        let test2 = [];
        for (const v of this.objects[i].js_object.v) {
          test2.push({ ref: this.retrieve_object_id(v) });
        }
        this.objects[i].value = test2;
      } else {
        console.log(this.objects[i].js_object.v);
        this.objects[i].ref = this.objects[i].js_object.v;
        this.objects[i].value = this.objects[i].js_object.v;
      }
    }
  }

  // Retrieve the object id for the given value.
  // If the value already exists the id to the already existing object is returned.
  // Otherwise a new object is created and this id is returned.
  retrieve_object_id(js_object) {
    for (const obj of this.objects) {
      // '===' returns true only if the objects have the same reference
      if (obj.js_object === js_object) {
        return obj.id;
      }
    }
    // If the object doesn't exist yet add it and return new id
    let obj = this.create_object(js_object);
    this.objects.push(obj);
    return obj.id;
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
