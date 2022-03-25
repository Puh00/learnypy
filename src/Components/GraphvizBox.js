import React, { useEffect, useState } from 'react';

import { graphviz } from 'd3-graphviz';
import generate_dot from '../util/dotGenerator';

const VisualBox = ({ data }) => {
  const [graph, setGraph] = useState({ dot: 'graph {}' });

  useEffect(() => {
    const dot = generate_dot(data);
    setGraph(dot);
    //TODO screen reader + tab
  }, [data]);

  useEffect(() => {
    graphviz(`#graph-body`).renderDot(graph.dot);
  }, [graph]);

  return <div className={'Visual-box'} id="graph-body"></div>;
};

export default VisualBox;
