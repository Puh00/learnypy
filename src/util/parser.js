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
      label: v.name
    });
    // add edge from variable to the referenced object
    edges.push({
      from: var_id,
      to: v.ref
    });
  });

  refs.objects.forEach((o) => {
    if (o.type === 'list') {
      // lists
      nodes.push({
        id: o.id,
        label: '[...]' // TODO: Update label with something more appropriate
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
    } else {
      // immutable objects
      nodes.push({
        id: o.id,
        label: o.value.toString()
      });
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
