// Keeps track of all variables that points to the same non-primitve object. key:object id, val:list of variables that points directly to it
let pointers = {};
let objects;

// Generates a string describing the structure of the graph (variables and objects, and how the relate to each other)
const set_text = (data_objects, variables) => {
  objects = data_objects;
  pointers = initialize_pointers_dict();
  let graph_text = '';
  //traverses all variables and object to find which variables points to which object
  for (const v of variables) {
    for (const o of objects) {
      if (v.ref === o.id) {
        graph_text = graph_text.concat('Variable "' + v.name + '" points to ');
        if (['list', 'tuple', 'dictionary', 'class'].includes(o.info.type)) {
          graph_text = graph_text.concat(get_text_for_indexable_objects(o, v.name, true));
          if (!pointers[o.id].includes('variable ' + v.name)) {
            pointers[o.id].push('variable ' + v.name);
          }
        } else if (o.value == '') {
          graph_text = graph_text.concat('an empty ' + o.info.type + '. ');
        } else {
          graph_text = graph_text.concat('the ' + o.info.type + ' value ' + o.value + '. ');
        }
      }
    }
  }
  return graph_text;
};

const initialize_pointers_dict = () => {
  let pointers = {};
  for (const o of objects) {
    if (['list', 'tuple', 'dictionary', 'class'].includes(o.info.type)) {
      pointers[o.id] = [];
    }
  }
  return pointers;
};

// Text for non-primitve objects
// is_root keeps track of if this is the "root" object (needed if there are nestled objects).
const get_text_for_indexable_objects = (o, variable_name, is_root) => {
  let text = '';

  // index 0: description of the object (not it's indices)
  // index 1: boolean. if a variable points to the same object as another, the
  // referenced object will not be explained again
  let outer_object_description = get_description_of_outer_object(o);

  text = text.concat(outer_object_description[0]);

  let explain_object = outer_object_description[1];
  if (explain_object) {
    let index_number = 0;

    //traverses all indices
    for (const val of o.value) {
      // If this is the root object we want to write the variables name pointing to the
      // object, otherwise refer to the object as "this"
      if (!is_root) {
        if (['dictionary', 'class'].includes(o.info.type)) {
          text = text.concat(
            (o.info.type == 'dictionary' ? 'Key ' : 'Attribute ') +
              o.value[index_number].key +
              ' of ' +
              'this ' +
              o.info.type +
              ' points to '
          );
        } else {
          text = text.concat(
            'Index nr ' + index_number + ' of ' + 'this ' + o.info.type + ' points to '
          );
        }
      } else {
        if (['dictionary', 'class'].includes(o.info.type)) {
          text = text.concat(
            (o.info.type == 'dictionary' ? 'Key ' : 'Attribute ') +
              o.value[index_number].key +
              ' of "' +
              variable_name +
              '" points to '
          );
        } else {
          text = text.concat('Index nr ' + index_number + ' of "' + variable_name + '" points to ');
        }
      }
      //traverses all objects to find what object the index points to
      for (const ob of objects) {
        //val.ref works for lists and tuples, val.val works for dictionarys
        if (val.ref === ob.id || val.val === ob.id) {
          //if there are nestled non-primitive objects this method needs to be called recursively
          if (['list', 'tuple', 'dictionary', 'class'].includes(ob.info.type)) {
            //this is for objects with self-references
            if (o.id === ob.id) {
              if (!pointers[o.id].includes('variable ' + variable_name)) {
                pointers[o.id].push('variable ' + variable_name);
              }
              let t = text_for_many_pointers_at_the_same_object(pointers[ob.id]);
              text = text.concat(
                'the same ' + o.info.type + ' of size ' + o.value.length + ' as ' + t + '. '
              );
            } else {
              text = text.concat(get_text_for_indexable_objects(ob, variable_name, false));
            }
            //save keys / indices that points to the object
            if (o.info.type == 'dictionary') {
              pointers[ob.id].push(variable_name + "'s key " + o.value[index_number].key);
            } else if (o.info.type == 'list') {
              pointers[ob.id].push(variable_name + "'s index " + index_number);
            }
          } else if (ob.value == '') {
            text = text.concat('an empty ' + ob.info.type + '. ');
          } else {
            text = text.concat('the ' + ob.info.type + ' value ' + ob.value + '. ');
          }
        }
      }
      index_number++;
    }
  }
  return text;
};

const get_description_of_outer_object = (o) => {
  let text = '';
  let explain_object = true;
  if (pointers[o.id].length >= 1) {
    let t = text_for_many_pointers_at_the_same_object(pointers[o.id]);
    text = text.concat(
      'the same ' + o.info.type + ' of size ' + o.value.length + ' as ' + t + '. '
    );
    explain_object = false;
  } else {
    text = text.concat('a ' + o.info.type + ' of size ' + o.value.length + '. ');
  }

  return [text, explain_object];
};

const text_for_many_pointers_at_the_same_object = (names) => {
  let text = '';
  for (let n = 0; n < names.length; n++) {
    text = text.concat(names[n]);
    if (n < names.length - 1) {
      text = text.concat(' & ');
    }
  }
  return text;
};

export default set_text;
