var objects;

// keeps track of all variables that points to the same non-primitve object. key:object id, val:list of variables that points directly to it
var pointers = {};

const set_text = (data_objects, variables) => {
  objects = data_objects;
  pointers = initialize_pointers_dict();
  var graph_text = '';
  //traverses all variables and object to find which variables points to which object
  for (const v of variables) {
    for (const o of objects) {
      if (v.ref === o.id) {
        graph_text = graph_text.concat(' ' + v.name + ' points to ');
        if (o.type === 'list' || o.type === 'tuple' || o.type === 'dict') {
          graph_text = graph_text.concat(get_text_for_indexable_objects(o, v.name, true));
          pointers[o.id].push(v.name);
        } else {
          graph_text = graph_text.concat(o.value + '.');
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
    if (o.type == 'list' || o.type == 'tuple' || o.type == 'dict') {
      pointers[o.id] = [];
    }
  }
  return pointers;
};

//text for non-primitve objects
//is_root keeps track of if this is the "root" object (needed if there are nestled objects).
const get_text_for_indexable_objects = (o, variable_name, is_root) => {
  let text = '';

  // description of the object (not it's indices)
  text = text.concat(get_description_of_outer_object(o));

  let index_number = 0;

  //traverses all indices
  for (const val of o.value) {
    //if this is the root object we want to write the variables name pointing to the object, otherwise refer to the object as "this"
    if (!is_root) {
      if (o.type === 'dict') {
        text = text.concat(
          ' Key ' + o.value[index_number].key + ' of ' + 'this ' + o.type + ' points to '
        );
      } else {
        text = text.concat(' Index nr ' + index_number + ' of ' + 'this ' + o.type + ' points to ');
      }
    } else {
      if (o.type === 'dict') {
        text = text.concat(
          ' Key ' + o.value[index_number].key + ' of ' + variable_name + ' points to '
        );
      } else {
        text = text.concat(' Index nr ' + index_number + ' of ' + variable_name + ' points to ');
      }
    }
    //traverses all objects to find what object the index points to
    for (const ob of objects) {
      //val.ref works for lists and tuples, val.val works for dictionarys
      if (val.ref === ob.id || val.val === ob.id) {
        //if there are nestled non-primitive objects this method needs to be called recursively
        if (ob.type === 'list' || ob.type === 'tuple' || ob.type === 'dict') {
          //this is to avoid stack overflow for lists that appends themselves
          if (o.id === ob.id) {
            text = text.concat(' ' + variable_name + '.');
          } else {
            text = text.concat(get_text_for_indexable_objects(ob, variable_name, false));
          }
        } else {
          text = text.concat(ob.value + '.');
        }
      }
    }
    index_number++;
  }
  return text;
};

const get_description_of_outer_object = (o) => {
  let text = '';

  if (pointers[o.id].length >= 1) {
    let t = text_for_many_pointers_at_the_same_object(pointers[o.id]);
    text = text.concat('the same ' + o.type + ' of size ' + o.value.length + ' as' + t + '.');
  } else {
    text = text.concat('a ' + o.type + ' of size ' + o.value.length + '.');
  }

  return text;
};

const text_for_many_pointers_at_the_same_object = (names) => {
  let text = ' ';
  for (let n = 0; n < names.length; n++) {
    text = text.concat(names[n]);
    if (n < names.length - 1) {
      text = text.concat(' & ');
    }
  }
  return text;
};

export default set_text;
