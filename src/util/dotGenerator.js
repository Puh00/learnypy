import { v4 as uuidv4 } from 'uuid';

// Colors
const var_col_1 = 'bisque4';
const var_col_2 = 'beige';
const arrow_col_1 = 'lightsteelblue4';
const arrow_col_2 = 'lightsteelblue3';
const immutable_col_1 = 'seashell4';
const immutable_col_2 = 'seashell';
const indexable_col_1 = 'mistyrose4';
const indexable_col_2 = 'mistyrose';
const indexable_col_3 = 'mistyrose2';

let nodes; // To represent variables and objects
let edges; // To represent references

// Generates a string containing nodes and edges as a representation of variables and objects
const generate_dot = (data) => {
  nodes = '#Nodes:\n';
  edges = '\n#Edges:\n';

  // variables
  data.variables.forEach((v) => {
    const var_id = uuidv4();
    // add variable as node
    nodes +=
      '##Variable:\n"' +
      var_id +
      '" [label=' +
      v.name +
      ' shape=ellipse color=' +
      var_col_1 +
      ' fillcolor=' +
      var_col_2 +
      ' style=filled];\n';
    // add edge from variable to the referenced object
    edges += '"' + var_id + '" ' + '->' + ' "' + v.ref + '"[color=' + arrow_col_1 + '];\n';
  });

  // objects
  data.objects.forEach((o) => {
    if (o.info.type === 'tuple') {
      set_collection_object(o, '(', ')');
    } else if (o.info.type === 'list') {
      set_collection_object(o, '[', ']');
    } else if (['dictionary', 'set', 'class'].includes(o.info.type)) {
      set_collection_object(o, '{', '}');
    } else {
      // immutables
      let label = o.value.toString();
      if (o.info.type === 'string') {
        label = '"&#34;' + label + '&#34;"';
      } else if (o.info.type === 'float' && o.value % 1 === 0) {
        label = label + '.0';
      } else if (o.info.type === 'bool' && o.value === 0) {
        label = 'False';
      } else if (o.info.type === 'bool' && o.value === 1) {
        label = 'True';
      }
      nodes +=
        '##Immutable object:\n"' +
        o.id +
        '" [label=' +
        label +
        ' style="rounded, filled" fillcolor=' +
        immutable_col_2 +
        ' color=' +
        immutable_col_1 +
        '];\n';
    }
  });
  let res = 'digraph structs { node [shape=box]\n' + nodes + edges + '}';

  return {
    dot: res
  };
};

// Used for tuple, list, dict, set and class
const set_collection_object = (o, start_bracket, end_bracket) => {
  const get_node_description = () =>
    o.info.type == 'class'
      ? o.info.class_name + '<BR/><I>' + o.info.type + '</I>'
      : '<I>' + o.info.type + '</I><BR/>' + start_bracket + 'size: ' + o.value.length + end_bracket;
  let count = 0;
  let index = '';
  let to = '';

  nodes +=
    '##Indexable object:\n"' +
    o.id +
    '" [shape=plaintext label=<\n<TABLE BGCOLOR="' +
    indexable_col_2 +
    '" COLOR="' +
    indexable_col_1 +
    '" BORDER="0" CELLBORDER="1" CELLSPACING="0">' +
    '\n\t<TR>\n\t\t<TD PORT="base" BGCOLOR="' +
    indexable_col_3 +
    '" COLSPAN="' +
    o.value.length +
    '">' +
    get_node_description() +
    '</TD>\n\t</TR>\n';

  if (o.info.type === 'set') {
    // Sets are unordered => edges are not connected to an index
    o.value.forEach((item) => {
      edges += '"' + o.id + '":"base" -> "' + item.ref + '"[color=' + arrow_col_2 + '];\n';
    });
  } else if (o.value.length > 0) {
    // All types that are ordered => edges should be connected to an index
    nodes += '\t<TR>\n\t\t<TD ';

    // set value for index and add edge to object
    o.value.forEach((item) => {
      switch (o.info.type) {
        case 'tuple':
        case 'list':
          index = count;
          to = item.ref;
          break;
        case 'dictionary':
        case 'class':
          index = item.key;
          to = item.val;
          break;
        default:
      }
      nodes += 'PORT="' + count + '">' + index;
      edges += '"' + o.id + '":"' + count + '" -> "' + to + '"[color=' + arrow_col_2 + '];\n';

      // check if one more key is added after this one
      count++;
      if (count < o.value.length) nodes += '</TD>\n\t\t<TD ';
    });

    nodes += '</TD>\n\t</TR>\n';
  }
  nodes += '</TABLE>\n>];\n';
};

export default generate_dot;
