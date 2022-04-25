// Keeps track of all variables that points to the same list/tuple/dictionary/class/set. key:object id, val:list of variables that points directly to it
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
        if (!v.dead_ref) {
          graph_text = graph_text.concat('Variable "' + v.name + '" points to ');
        }
        if (['list', 'tuple', 'dictionary', 'class', 'set'].includes(o.info.type)) {
          graph_text = graph_text.concat(get_text_for_traversable_objects(o, v, true));
          if (!pointers[o.id].includes('variable ' + v.name)) {
            pointers[o.id].push('variable ' + v.name);
          }
        } else if (o.value == '') {
          graph_text = graph_text.concat('an empty ' + o.info.type + '. ');
        } else {
          v.dead_ref
            ? (graph_text = graph_text.concat(text_for_dead_refs(v, o)))
            : (graph_text = graph_text.concat('the ' + o.info.type + ' value ' + o.value + '. '));
        }
      }
    }
  }
  console.log(graph_text);
  return graph_text;
};

const initialize_pointers_dict = () => {
  let pointers = {};
  for (const o of objects) {
    if (['list', 'tuple', 'dictionary', 'class', 'set'].includes(o.info.type)) {
      pointers[o.id] = [];
    }
  }
  return pointers;
};

// Text for non-primitve objects
// is_root keeps track of if this is the "root" object (needed if there are nestled objects).
const get_text_for_traversable_objects = (o, v, is_root) => {
  let text = '';

  // index 0: description of the object (not it's indices)
  // index 1: boolean. if a variable points to the same object as another, the
  // referenced object will not be explained again
  let outer_object_description = get_description_of_outer_object(o, v);

  text = text.concat(outer_object_description[0]);

  let explain_object = outer_object_description[1];
  if (explain_object) {
    let index_number = 0;

    //traverses all indices
    for (const val of o.value) {
      //set are not indexable
      if (!['set'].includes(o.info.type)) {
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
                v.name +
                '" points to '
            );
          } else {
            text = text.concat('Index nr ' + index_number + ' of "' + v.name + '" points to ');
          }
        }
      } else {
        text = text.concat(index_number >= 1 ? 'This set also points to ' : 'This set points to ');
      }
      //traverses all objects to find what object the index points to
      for (const ob of objects) {
        //val.ref works for lists and tuples, val.val works for dictionarys
        if (val.ref === ob.id || val.val === ob.id) {
          //if there are nestled objects this method needs to be called recursively
          if (['list', 'tuple', 'dictionary', 'class', 'set'].includes(ob.info.type)) {
            //this is for objects with self-references
            if (o.id === ob.id) {
              if (!pointers[o.id].includes('variable ' + v.name)) {
                pointers[o.id].push('variable ' + v.name);
              }
              let t = text_for_many_pointers_at_the_same_object(pointers[ob.id]);
              text = text.concat(
                'the same ' + o.info.type + ' of size ' + o.value.length + ' as ' + t + '. '
              );
            } else {
              text = text.concat(get_text_for_traversable_objects(ob, v, false));
            }
            //save keys / indices that points to the object
            if (o.info.type == 'dictionary') {
              pointers[ob.id].push(v.name + "'s key " + o.value[index_number].key);
            } else if (o.info.type == 'list') {
              pointers[ob.id].push(v.name + "'s index " + index_number);
            }
          } else if (ob.value == '') {
            text = text.concat('an empty ' + ob.info.type + '. ');
          } else {
            text = text.concat('the ' + ob.info.type + ' value ' + ob.value + '. ');
          }
          if (o.value[index_number].dead_ref) {
            text = text.concat(
              get_text_for_dead_refs_on_index(
                is_root ? '"' + v.name + '"' : 'this ' + o.info.type,
                o,
                index_number
              )
            );
          }
        }
      }
      index_number++;
    }
  }
  return text;
};

const get_description_of_outer_object = (o, v) => {
  const size_description =
    o.info.type == 'class'
      ? ' named "' +
        o.info.class_name +
        '" with ' +
        o.value.length +
        (o.value.length > 1 ? ' attributes' : ' attribute')
      : ' of size ' + o.value.length;

  let text = '';
  let explain_object = true;
  console.log(v);
  if (v.dead_ref) {
    text = text.concat(text_for_dead_refs(v, o));
  }
  if (pointers[o.id].length >= 1) {
    let t = text_for_many_pointers_at_the_same_object(pointers[o.id]);
    text = text.concat('the same ' + o.info.type + size_description + ' as ' + t + '. ');
    explain_object = false;
  } else {
    text = text.concat('a ' + o.info.type + size_description + '. ');
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

const text_for_dead_refs = (v, new_object) => {
  let text = 'Variable "' + v.name + '" changed reference since the last step';
  for (const old_object of objects) {
    if (old_object.id === v.dead_ref) {
      if (old_object.value == '') {
        text = text.concat(
          ' from pointing at an empty ' + old_object.info.type + ' to now pointing to the '
        );
      } else if (!['list', 'tuple', 'dictionary', 'class', 'set'].includes(new_object.info.type)) {
        text = text.concat(
          ' from pointing to the ' +
            old_object.info.type +
            ' value ' +
            old_object.value +
            ' to now pointing to the '
        );
        text = text.concat(new_object.info.type + ' value ' + new_object.value + '.');
      } else {
        text = text.concat('. Variable "' + v.name + '" now points to ');
      }
    }
  }
  return text;
};

const get_text_for_dead_refs_on_index = (variable_name, new_object, index_number) => {
  let text = '';
  if (['dictionary', 'class'].includes(new_object.info.type)) {
    text = text.concat(
      (new_object.info.type == 'dictionary' ? 'Key ' : 'Attribute ') +
        new_object.value[index_number].key +
        ' of "' +
        variable_name +
        '" changed reference since the last step'
    );
    text = text.concat(get_text_for_old_object(new_object, index_number));
  } else {
    text = text.concat(
      'Index nr ' + index_number + ' of ' + variable_name + ' changed reference since the last step'
    );
    text = text.concat(get_text_for_old_object(new_object, index_number));
  }
  return text;
};

const get_text_for_old_object = (new_object, index_number) => {
  let text = '';
  for (const old_object of objects) {
    if (old_object.id === new_object.value[index_number].dead_ref) {
      text = text.concat(
        ['list', 'tuple', 'dictionary', 'class', 'set'].includes(old_object.info.type)
          ? '. '
          : ' from pointing to the ' + old_object.info.type + ' value ' + old_object.value + '. '
      );
    }
  }
  return text;
};

export default set_text;
