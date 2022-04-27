import { v4 as uuidv4 } from 'uuid';

// Colors
let line_col;
//Colors from X11 color scheme, Ref: https://www.w3schools.com/colors/colors_x11.asp
let var_col;
let immutable_col;
let indexable_col;

let nodes; // To represent variables and objects
let edges; // To represent references

// Generates a string containing nodes and edges as a representation of variables and objects
const generate_dot = (data, colors) => {
  line_col = colors[0];
  var_col = colors[1];
  immutable_col = colors[2];
  indexable_col = colors[3];
  nodes = '#Nodes:\n';
  edges = '\n#Edges:\n';

  // variables
  data.variables.forEach((v) => {
    const var_id = uuidv4();
    const edge_tooltip = "Variable '" + v.name + "'" + ' references ...';
    const node_tooltip = "Variable '" + v.name + "'";
    // add variable as node
    nodes +=
      '##Variable:\n"' +
      var_id +
      '" [label=' +
      v.name +
      ' tooltip="' +
      node_tooltip +
      '" shape=oval color=' +
      line_col +
      ' fillcolor=' +
      var_col +
      ' style=filled];\n';
    // add edge from variable to the referenced object
    edges += get_ref_edge(var_id, v.ref, edge_tooltip);

    if (v.dead_ref) {
      const dead_edge_tooltip = "Variable '" + v.name + "'" + ' referenced ...';
      edges += get_dead_ref_edge(var_id, v.dead_ref, dead_edge_tooltip);
    }
  });

  // objects
  data.objects.forEach((o) => {
    const object_tooltip = o.info.type;
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
        ' tooltip="' +
        object_tooltip +
        '" style="rounded, filled" fillcolor=' +
        immutable_col +
        ' color=' +
        line_col +
        '];\n';
    }
  });
  let res =
    'digraph structs { bgcolor=transparent\nnode [shape=box] [fontname="Arial"] [fontcolor=' +
    colors[0] +
    '] \n' +
    nodes +
    edges +
    '}';

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

  const node_tooltip =
    o.info.type == 'class'
      ? 'A ' + o.info.type + " named '" + o.info.class_name + "'"
      : 'A ' + o.info.type + ' of size ' + o.value.length;

  nodes +=
    '##Indexable object:\n"' +
    o.id +
    '" [shape=plaintext ' +
    'tooltip= "' +
    node_tooltip +
    '" label=<\n<TABLE BGCOLOR="' +
    indexable_col +
    '" COLOR="' +
    line_col +
    '" BORDER="0" CELLBORDER="1" CELLPADDING="5" CELLSPACING="0">' +
    '\n\t<TR>\n\t\t<TD PORT="base" BGCOLOR="' +
    indexable_col +
    '" COLSPAN="' +
    o.value.length +
    '">' +
    get_node_description() +
    '</TD>\n\t</TR>\n';

  if (o.info.type === 'set') {
    // Sets are unordered => edges are not connected to an index
    const edge_tooltip = ' this set references...';
    o.value.forEach((item) => {
      edges += get_ref_edge(o.id + '":"base', item.ref, edge_tooltip);
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
      const edge_tooltip = " index '" + index + "' references...";
      nodes += 'PORT="' + count + '">' + index;
      edges += get_ref_edge(o.id + '":"' + count, to, edge_tooltip);

      if (o.value[count].dead_ref) {
        const dead_edge_tooltip = " index '" + index + "' referenced...";
        edges += get_dead_ref_edge(
          o.id + '":"' + count,
          o.value[count].dead_ref,
          dead_edge_tooltip
        );
      }

      // check if one more key is added after this one
      count++;
      if (count < o.value.length) nodes += '</TD>\n\t\t<TD ';
    });

    nodes += '</TD>\n\t</TR>\n';
  }
  nodes += '</TABLE>\n>];\n';
};

// Returns the edge for an active/living reference.
const get_ref_edge = (from, to, edge_tooltip) => {
  return (
    '"' +
    from +
    '" ' +
    '->' +
    '"' +
    to +
    '"[penwidth= 1.25, color=' +
    line_col +
    '] [edgetooltip="' +
    edge_tooltip +
    '"];\n'
  );
};

// Returns the edge for a dead reference.
const get_dead_ref_edge = (from, to, edge_tooltip) => {
  return (
    '"' +
    from +
    '" -> "' +
    to +
    '" [penwidth=0.75, arrowhead=onormal, style=dashed, color="indianred2"] [edgetooltip="' +
    edge_tooltip +
    '"];\n'
  );
};

export default generate_dot;
