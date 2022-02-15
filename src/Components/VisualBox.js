import React from 'react';

import Graph from 'react-graph-vis';
import parse from '../util/parser';

function VisualBox({ data }) {
  const options = {
    layout: {
      hierarchical: true
    },
    edges: {
      color: '#000000'
    },
    height: '500px'
  };

  const graph = parse(data);

  console.log(graph);

  return (
    <div className="Visual-box">
      <Graph graph={graph} options={options} />
    </div>
  );
}

export default VisualBox;
