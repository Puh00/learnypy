import { v4 as uuidv4 } from 'uuid';

/**
 * Retrieves the global variables and objects of the current Skulpt state
 * @returns The global variables and objects
 */
const parse_globals = () => parse_objects(window.Sk.globals);

/**
 * Retrieves the local variables and objects of the current Skulpt state
 * @returns The local variables and objects
 */
const parse_locals = () => parse_objects(window.Sk._frame?.locals);

/**
 * Parse the current status of {other} and return variables and objects
 * @param {Object} other Generally globals or locals
 * @param {Array} filter Irrelevant python attributes that are filtered out
 * @returns Variables and objects from {other}
 */
const parse_objects = (other, filter = ['__doc__', '__file__', '__name__', '__package__']) => {
  const variables = [];
  const objects = [];

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
        ref: retrieve_object_id(objects, value)
      });
    }
  }

  return {
    objects: objects,
    variables: variables
  };
};

/**
 * Creates an object of the follwing structure and appends it to the list of objects:
 * Object: {
 *   id: uuid for the object,
 *   value: used for visual representation,
 *   type: type of the object,
 *   js_object: used to compare with objects from Sk.globals
 * }
 * @param {Array} objects List of the parsed objects
 * @param {Object} js_object The Javascript representation of the Python object
 * @returns The newly created object
 */
const create_object = (objects, js_object) => {
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
    for (const entr of entries) {
      value.push({ key: entr.lhs.v, val: retrieve_object_id(objects, entr.rhs) });
    }
    // Add more types here
  } else {
    // Immutables
    value = js_object.v;
  }

  obj.value = value;
  return obj;
};

/**
 * Retrieves the object id for the given value. If an object with this value already
 * exists then their id is returned. Otherwise a new object is created and this object's
 * id is returned.
 * @param {Array} objects List of the parsed objects
 * @param {Object} js_object The Javascript representation of the Python object
 * @returns The id of the object with a matching value
 */
const retrieve_object_id = (objects, js_object) => {
  var obj;
  for (const obj of objects) {
    // '===' returns true only if the objects have the same reference
    if (obj.js_object === js_object) return obj.id;
  }
  //small int objects is not created more than once
  if (js_object.tp$name === 'int' && js_object.v <= 256 && js_object.v >= -5) {
    var small_int_id = retrieve_small_int_object_id(objects, js_object);
    if (!small_int_id) obj = create_object(objects, js_object);
    else return small_int_id;
  }
  // If the object doesn't exist yet add it and return new id
  else obj = create_object(objects, js_object);

  return obj.id;
};

/**
 * If a small int value already exists then the id to the already existing object is
 * returned, otherwise false is returned
 * @param {Array} objects List of the parsed objects
 * @param {Object} js_object The Javascript representation of the Python object
 * @returns id or false.
 */
const retrieve_small_int_object_id = (objects, js_object) => {
  for (const obj of objects) {
    if (obj.type === 'int' && obj.js_object.v === js_object.v) {
      return obj.id;
    }
  }
  return false;
};

export { parse_globals, parse_locals };
