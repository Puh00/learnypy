import { v4 as uuidv4 } from 'uuid';

var count = 0;

const parse = (refs) => {
  const nodes = [];
  const edges = [];

  refs.variables.forEach((v) => {
    const var_id = uuidv4();
    // add variable as node
    nodes.push({
      id: var_id,
      label: v.name,
      shape: 'circle'
    });
    // add edge from variable to the referenced object
    edges.push({
      from: var_id,
      to: v.ref
    });
  });

  refs.objects.forEach((o) => {
    if (o.type === 'list') {
      // add node for list
      nodes.push({
        id: o.id,
        font: { multi: true },
        label: '{size: ' + o.value.length + '}\n<i>list</i>' // TODO: Update label with something more appropriate
      });

      // add edges from this node to all of the items in the list
      o.value.forEach((item) => {
        edges.push({
          from: o.id,
          to: item.ref,
          label: generate_index_text(count, o.id, item.ref) //TODO: style labels
        });
        count++;
      });
      count = 0;
    } else if (o.type === 'tuple') {
      // add node for tuple
      nodes.push({
        id: o.id,
        font: { multi: true },
        label: '{size: ' + o.value.length + '}\n<i>tuple</i>'
      });

      // add edges from this node to all of the items in the tuple
      o.value.forEach((item) => {
        edges.push({
          from: o.id,
          to: item.ref,
          label: generate_index_text(count, o.id, item.ref) //TODO: style labels
        });
        count++;
      });
      count = 0;
    } else if (o.type === 'dict') {
      // add node for dict
      nodes.push({
        id: o.id,
        font: { multi: true },
        label: '{size: ' + o.value.length + '}\n<i>dict</i>'
      });

      // add edge from var to val with key ad label
      o.value.forEach((item) => {
        edges.push({
          from: o.id,
          to: item.val,
          label: item.key.toString()
        });
      });
    } else {
      // immutable objects
      try {
        let label = o.value.toString();
        if (o.type === 'str') {
          label = '"' + label + '"';
        } else if (o.type === 'float' && o.value % 1 === 0) {
          label = label + '.0';
        } else if (o.type === 'bool' && o.value === 0) {
          label = 'False';
        } else if (o.type === 'bool' && o.value === 1) {
          label = 'True';
        }

        nodes.push({
          id: o.id,
          label: label
        });
      } catch (e) {
        console.log(e);
      }
    }
  });
  //console.log(nodes);
  //console.log(edges);

  function generate_index_text(count, from, to) {
    for (let i = 0; i < edges.length; i++) {
      if (edges[i].from == from && edges[i].to == to) {
        let old_label = edges[i].label;
        edges[i].label = '';
        return old_label + ' & index:' + count;
      }
    }
    return 'index:' + count;
  }

  return {
    nodes: nodes,
    edges: edges
  };
};

export default parse;
