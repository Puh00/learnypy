import { v4 as uuidv4 } from 'uuid';

let variables = [];
let objects = [];

// retrieve the global variables and objects
const parse_globals = () => parse_objects(window.Sk.globals);

// retrieve the local variables and objects
const parse_locals = () => parse_objects(window.Sk._frame?.locals);

/**
 * Parse the current status of {other} and return variables and objects
 * @param {Object} other generally globals or locals
 * @param {Array} filter irrelevant python attributes that are filtered out
 * @returns variables and objects from {other}
 */
const parse_objects = (other, filter = ['__doc__', '__file__', '__name__', '__package__']) => {
  // Variables and objects reset before parsing
  variables = [];
  objects = [];

  // there's a risk for locals being undefined
  if (other) {
    // Must be from Sk.globals and not Sk.builtin.globals, since the latter creates an entirely
    // new dictionary which renders the '===' operator useless for reference checking (which is
    // used in retrieve_object_id(...))
    for (const [key, value] of Object.entries(other)) {
      // skip if it's an Python attribute or a function
      if (filter.includes(key) || Object.getPrototypeOf(value).tp$name == 'function') continue;

      variables.push({
        name: key,
        ref: retrieve_object_id(value)
      });
    }
  }

  return {
    objects: objects,
    variables: variables
  };
};

/*
Create and return new object.
Type of object:
  Object: {
    id: uuid for the object,
    value: used for visual representation,
    type: type of the object,
    js_object: used to compare with objects from Sk.globals
  }
*/
const create_object = (js_object) => {
  let obj = {
    id: uuidv4(),
    value: null,
    type: js_object.tp$name,
    js_object: js_object
  };
  objects.push(obj);

  let value = null;
  if (js_object.tp$name === 'list' || js_object.tp$name === 'tuple') {
    value = [];
    for (const v of js_object.v) {
      value.push({ ref: retrieve_object_id(v) });
    }
  } else if (js_object.tp$name === 'dict') {
    value = [];
    const entries = Object.values(js_object.entries);
    for (let i = 0; i < entries.length; i++) {
      value.push({ key: entries[i].lhs.v, val: retrieve_object_id(entries[i].rhs) });
    }

    // Add more types here
  } else {
    // Immutables
    value = js_object.v;
  }

  obj.value = value;
  return obj;
};

// Retrieve the object id for the given value.
// If the value already exists the id to the already existing object is returned.
// Otherwise a new object is created and this id is returned.
const retrieve_object_id = (js_object) => {
  var obj;
  for (const obj of objects) {
    // '===' returns true only if the objects have the same reference
    if (obj.js_object === js_object) {
      return obj.id;
    }
  }
  //small int objects is not created more than once
  if (js_object.tp$name === 'int' && js_object.v <= 256 && js_object.v >= -5) {
    var small_int_id = retrieve_small_int_object_id(js_object, objects);
    if (!small_int_id) {
      obj = create_object(js_object);
    } else return small_int_id;
  } else {
    // If the object doesn't exist yet add it and return new id
    obj = create_object(js_object);
  }
  //objects.push(obj);
  return obj.id;
};

// If the small int value already exists the id to the already existing object is returned,
// otherwise false is returned.
const retrieve_small_int_object_id = (js_object) => {
  for (const obj of objects) {
    if (obj.type === 'int' && obj.js_object.v === js_object.v) {
      return obj.id;
    }
  }
  return false;
};

export { parse_globals, parse_locals };
