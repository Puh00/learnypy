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
      value: ['1', '2']
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
  ]
};

import { v4 as uuidv4 } from 'uuid';

const parse = (refs) => {
  refs = data;
  if (typeof refs === 'string') refs = JSON.parse(refs);

  const nodes = [];
  const edges = [];

  refs.variables.forEach((_var) => {
    _var.uuid = uuidv4();

    const obj = refs.objects.find((obj) => obj.id === _var.ref);
    if (typeof obj === 'undefined') throw new Error('Dangling variable! Memory Leak ALERT!!!!');

    if (typeof obj.vars === 'undefined') obj.vars = [];

    obj.vars.push(_var);
  });

  refs.objects.forEach((obj) => {
    obj.uuid = uuidv4();

    nodes.push({
      id: obj.uuid,
      label: obj.value.toString()
    });

    obj.vars.forEach((_var) => {
      nodes.push({
        id: _var.uuid,
        label: _var.name
      });

      edges.push({
        from: _var.uuid,
        to: obj.uuid
      });
    });
  });

  return {
    nodes: nodes,
    edges: edges
  };
};

export default parse;
