import { v4 as uuidv4 } from 'uuid';

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
          to: item.ref
        });
      });
    } else {
      // immutable objects
      nodes.push({
        id: o.id,
        label: o.value.toString()
      });
    }
  });
  console.log(nodes);
  console.log(edges);

  return {
    nodes: nodes,
    edges: edges
  };
};

export default parse;
