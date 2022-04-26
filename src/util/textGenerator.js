// Keeps track of all variables that points to the same list/tuple/dictionary/class/set. key:object id, val:list of variables that points directly to it
let pointers = {};
let objects;
let composite_types = ['list', 'tuple', 'dictionary', 'class', 'set'];

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
        if (composite_types.includes(o.info.type)) {
          graph_text = graph_text.concat(get_text_for_traversable_objects(o, v, true));
          if (!pointers[o.id].includes('variable ' + v.name)) {
            pointers[o.id].push('variable ' + v.name);
          }
        } else if (o.value === '') {
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
    if (composite_types.includes(o.info.type)) {
      pointers[o.id] = [];
    }
  }
  return pointers;
};

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
      if (!o.value[index_number].dead_ref) {
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
          text = text.concat(
            index_number >= 1 ? 'This set also points to ' : 'This set points to '
          );
        }
      } else {
        text = text.concat(
          text_for_dead_refs(is_root ? '"' + v.name + '"' : 'this ' + o.info.type, o, index_number)
        );
      }
      //traverses all objects to find what object the index points to
      for (const ob of objects) {
        //val.ref works for lists and tuples, val.val works for dictionarys
        if (val.ref === ob.id || val.val === ob.id) {
          //if there are nestled objects this method needs to be called recursively
          if (composite_types.includes(ob.info.type)) {
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
          } else if (ob.value === '') {
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
  if (v.dead_ref) {
    text = text.concat(text_for_dead_refs(v, o));
  }
  if (pointers[o.id].length >= 1) {
    let t = text_for_many_pointers_at_the_same_object(pointers[o.id]);
    text = text.concat('the same ' + o.info.type + size_description + ' as ' + t + '. ');
    explain_object = false;
  } else {
    text = text.concat(o.info.type + size_description + '. ');
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

//help method for text_for_dead_refs()
const get_type_of_index = (index_number, new_object) => {
  if (index_number === undefined) {
    return null;
  } else {
    if (['dictionary', 'class'].includes(new_object.info.type)) {
      return objects.find((elem) => elem.id === new_object.value[index_number].val).info.type;
    } else {
      return objects.find((elem) => elem.id === new_object.value[index_number].ref).info.type;
    }
  }
};

//index_number is undefined if new_object is not a index/key/attribute
const text_for_dead_refs = (v, new_object, index_number) => {
  let text;
  let new_index_type = get_type_of_index(index_number, new_object);

  if (v.name != undefined) {
    text = 'Variable "' + v.name + '"';
  } else if (['dictionary', 'class'].includes(new_object.info.type)) {
    text =
      (new_object.info.type == 'dictionary' ? 'Key ' : 'Attribute ') +
      new_object.value[index_number].key +
      ' of "' +
      v +
      '"';
  } else {
    text = 'Index nr ' + index_number + ' of ' + v;
  }
  text = text.concat(' changed reference since the last step from pointing ');

  for (const old_object of objects) {
    //find the old object
    if (
      (v.name != undefined && old_object.id === v.dead_ref) ||
      (index_number != undefined && old_object.id === new_object.value[index_number].dead_ref)
    ) {
      if (old_object.value === '') {
        text = text.concat('at an empty ' + old_object.info.type + ' to now pointing to ');
      } else if (composite_types.includes(old_object.info.type)) {
        text = text.concat(
          'to a ' +
            old_object.info.type +
            ' of size ' +
            old_object.value.length +
            ' to now pointing to '
        );
        if (
          old_object.info.type === new_index_type ||
          (old_object.info.type === new_object.info.type && !index_number)
        ) {
          text = text.concat('another ');
        } else if (composite_types.includes(old_object.info.type)) {
          text = text.concat('a ');
        }
      } // if the old object is a bool,int,string,float,double,char..
      else {
        text = text.concat(
          'to the ' +
            old_object.info.type +
            ' value ' +
            old_object.value +
            ' to now pointing to ' +
            (old_object.info.type === new_object.info.type ? '' : 'a ')
        );
        if (!composite_types.includes(new_object.info.type)) {
          text = text.concat(new_object.info.type + ' value ' + new_object.value + '.');
        }
      }
    }
  }
  return text;
};

export default set_text;
