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
 * Retrieves the name of all of the user defined classes in entries
 * @param {Object} entries Dictionary of all of the Skulpt variables and objects
 * @returns The name of all of the user-defined classes
 */
const fetch_class_names = (entries) => {
  const class_names = [];
  entries.forEach(([key, value]) => {
    if (Object.getPrototypeOf(value).tp$name == 'type') class_names.push(key);
  });
  return class_names;
};

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
    const skulpt_entries = Object.entries(other);
    const user_defined_class_names = fetch_class_names(skulpt_entries);

    // Must be from Sk.globals and not Sk.builtin.globals, since the latter creates an entirely
    // new dictionary which renders the '===' operator useless for reference checking (which is
    // used in retrieve_object_id(...))
    for (const [key, value] of skulpt_entries) {
      // skip if it's an Python attribute, a function or a class (which is signified by 'type')
      if (
        filter.includes(key) ||
        ['function', 'type'].includes(Object.getPrototypeOf(value).tp$name)
      )
        continue;

      variables.push({
        name: key,
        ref: retrieve_object_id(objects, value, user_defined_class_names)
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
 * @param {Array} class_names List of user-defined class names
 * @returns The newly created object
 */
const create_object = (objects, js_object, class_names) => {
  /**
   * Parses the values from a Skulpt dictionary
   * @param {Array} values The values from a Skulpt dictionary
   * @param {Boolean} set Indicates if the dictionary is a set instead of a map
   * @returns A parsed version of the values from the dicitonary
   */
  const parse_dictionary_values = (values, set = false) => {
    const _values = [];
    values.forEach((val) => {
      if (!set)
        _values.push({ key: val.lhs.v, val: retrieve_object_id(objects, val.rhs, class_names) });
      else _values.push({ ref: retrieve_object_id(objects, val.lhs, class_names) });
    });
    return _values;
  };

  /**
   * Parses the class and instance variables from a Skulpt class
   * @param {Object} js_object The Javascript representation of the Python object
   * @returns The parsed values from the class
   */
  const parse_class_values = (js_object) => {
    const irrelevant_skulpt_attributes = [
      'tp$name',
      'ob$type',
      '__init__',
      '__module__',
      'hp$type',
      '$r',
      'tp$setattr',
      'tp$str',
      'tp$length',
      'tp$call',
      'tp$getitem',
      'tp$setitem',
      'tp$getattr',
      // The name 'constructor' seems to be reserved in Skulpt which only appears
      // when inheritance is used. If a user-defined function in a class is named
      // 'constructor' then it will be named 'constructor_$rw$' instead
      'constructor'
    ];
    // Instance variables
    const values = parse_dictionary_values(Object.values(js_object.$d.entries));

    const instance_variables_names = new Set();
    values.forEach((v) => instance_variables_names.add(v.key));

    // Class variables
    for (const [key, value] of Object.entries(Object.getPrototypeOf(js_object))) {
      if (
        // Skip if an instance variable is shadowing the class variable
        instance_variables_names.has(key) ||
        irrelevant_skulpt_attributes.includes(key) ||
        // Skip functions declared inside of a class
        Object.getPrototypeOf(value).tp$name == 'function'
      )
        continue;

      values.push({
        key: key,
        val: retrieve_object_id(objects, value, class_names)
      });
    }
    return values;
  };

  // Create initial object without a value assigned
  let obj = {
    id: uuidv4(),
    value: null,
    info: js_object?.hp$type // check if it's class or not
      ? {
          type: 'class',
          class_name: js_object.tp$name
        }
      : {
          type: retrieve_full_type_name(js_object.tp$name)
        },
    js_object: js_object
  };
  objects.push(obj);

  let value;
  if (js_object.tp$name === 'list' || js_object.tp$name === 'tuple') {
    value = [];
    for (const v of js_object.v) {
      value.push({ ref: retrieve_object_id(objects, v, class_names) });
    }
  } else if (js_object.tp$name === 'dict' && !js_object?.hp$type) {
    // the second condition is required because otherwise a user-defined class
    // named 'dict' will bypass the condition
    value = parse_dictionary_values(Object.values(js_object.entries));
  } else if (class_names.includes(js_object.tp$name)) {
    // User-defined class
    value = parse_class_values(js_object);
  } else if (js_object.tp$name === 'set') {
    value = parse_dictionary_values(Object.values(js_object.v.entries), true);
  }
  // Immutables
  else value = js_object.tp$name == 'NoneType' ? 'None' : js_object.v;

  obj.value = value;
  return obj;
};

/**
 * Returns the full name of the type given a shorthand notation
 * @param {String} js_object_type The shorthand notation of the type
 * @returns The full name of the type
 */
const retrieve_full_type_name = (js_object_type) => {
  switch (js_object_type) {
    case 'str':
      return 'string';
    case 'dict':
      return 'dictionary';
    case 'int':
      return 'integer';
    default:
      return js_object_type;
  }
};

/**
 * Retrieves the object id for the given value. If an object with this value already
 * exists then their id is returned. Otherwise a new object is created and this object's
 * id is returned.
 * @param {Array} objects List of the parsed objects
 * @param {Object} js_object The Javascript representation of the Python object
 * @param {Array} class_names List of user-defined class names
 * @returns The id of the object with a matching value
 */
const retrieve_object_id = (objects, js_object, class_names) => {
  var obj;
  for (const obj of objects) {
    // '===' returns true only if the objects have the same reference
    if (
      obj.js_object === js_object ||
      (obj.info.type === 'integer' && obj.js_object.v === js_object.v)
    )
      return obj.id;
  }
  // If the object doesn't exist yet add it and return new id
  obj = create_object(objects, js_object, class_names);

  return obj.id;
};

export { parse_globals, parse_locals };
