import { v4 as uuidv4 } from 'uuid';

let nodes;
let edges;

const generate_dot = (refs) => {
  nodes = '#Nodes:\n';
  edges = '\n#Edges:\n';

  // variables
  refs.variables.forEach((v) => {
    const var_id = uuidv4();
    // add variable as node
    nodes +=
      '##Variable:\n"' +
      var_id +
      '" [label=' +
      v.name +
      ' shape=ellipse color=bisque4 fillcolor=beige style=filled];\n';
    // add edge from variable to the referenced object
    edges += '"' + var_id + '" ' + '->' + ' "' + v.ref + '"[color=lightsteelblue4];\n';
  });

  // objects
  refs.objects.forEach((o) => {
    if (o.type === 'tuple') {
      set_indexable_object(o, '(', ')');
    } else if (o.type === 'list') {
      set_indexable_object(o, '[', ']');
    } else if (o.type === 'dict') {
      set_indexable_object(o, '{', '}');
    } else {
      // immutables
      let label = o.value.toString();
      if (o.type === 'str') {
        label = '"&#34;' + label + '&#34;"';
      } else if (o.type === 'float' && o.value % 1 === 0) {
        label = label + '.0';
      } else if (o.type === 'bool' && o.value === 0) {
        label = 'False';
      } else if (o.type === 'bool' && o.value === 1) {
        label = 'True';
      }
      nodes +=
        '##Immutable object:\n"' +
        o.id +
        '" [label=' +
        label +
        ' style="rounded, filled" fillcolor=seashell color=seashell4];\n';
    }
  });
  let res = 'digraph structs { node [shape=box]\n' + nodes + edges + '}';

  // use console.log to check for errors in dot language when adding new types
  console.log(res);
  return {
    dot: res
  };
};

// Used for tuple, list and dict
const set_indexable_object = (o, start_bracket, end_bracket) => {
  let count = 0;
  let index = '';
  let to = '';

  nodes +=
    '##Indexable object:\n"' +
    o.id +
    '" [shape=plaintext label=<\n<TABLE BGCOLOR="mistyrose" COLOR="mistyrose4" BORDER="0" CELLBORDER="1" CELLSPACING="0">' +
    '\n\t<TR>\n\t\t<TD BGCOLOR="mistyrose2" COLSPAN="' +
    o.value.length +
    '"><I>' +
    o.type +
    '</I><BR/>' +
    start_bracket +
    'size: ' +
    o.value.length +
    end_bracket +
    '</TD>\n\t</TR>\n\t<TR>\n\t\t<TD ';

  // set value for index and add arrow to object
  o.value.forEach((item) => {
    switch (o.type) {
      case 'tuple':
      case 'list':
        index = count;
        to = item.ref;
        break;
      case 'dict':
        index = item.key;
        to = item.val;
        break;
      default:
    }
    nodes += 'PORT="' + count + '">' + index;
    edges += '"' + o.id + '":"' + count + '" -> "' + to + '"[color=lightsteelblue3];\n';

    // check if one more key is added after this one
    count++;
    if (count < o.value.length) nodes += '</TD>\n\t\t<TD ';
  });

  nodes += '</TD>\n\t</TR>\n</TABLE>\n>];\n';
};

export default generate_dot;
