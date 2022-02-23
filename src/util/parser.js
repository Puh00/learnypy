const data = {
  objects: [
    {
      id: '1',
      _type: 'numeric',
      value: 72
    },
    {
      id: '2',
      _type: 'string',
      value: 'hello world!'
    },
    {
      id: '3',
      _type: 'list',
      value: [
        {
          ref: '1'
        },
        {
          ref: '2'
        },
        {
          ref: '4'
        }
      ]
    },
    {
      id: '4',
      _type: 'list',
      value: [
        {
          ref: '1'
        }
      ]
    }
  ],
  variables: [
    {
      name: 'x',
      ref: '1'
    },
    {
      name: 'y',
      ref: '1'
    },
    {
      name: 'z',
      ref: '2'
    },
    {
      name: 'w',
      ref: '3'
    }
    /*,
    {
      // TODO: if nothing is referencing to '4' then program crash
      name: 'g',
      ref: '4'
    }*/
  ]
};

import { v4 as uuidv4 } from 'uuid';

const parse = (refs) => {
  refs = data;
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
    if (o._type === 'list') {
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
