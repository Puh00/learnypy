import React, { useEffect, useState } from 'react';

import { graphviz } from 'd3-graphviz';
import generate_dot from '../util/dotGenerator';

import styles from './VisualBox.module.css';
import border from './Border.module.css';

const VisualBox = ({ data }) => {
  const [graph, setGraph] = useState({ dot: 'graph {}' });

  //TODO screen reader + tab

  useEffect(() => {
    const dot = generate_dot(data);
    setGraph(dot);
  }, [data]);

  useEffect(() => {
    graphviz(`#graph-body`).renderDot(graph.dot);
  }, [graph]);

  return (
    <div className={`${styles.Container} ${border.Border}`} id="graph-body" tabIndex={0}></div>
  );
};

export default VisualBox;
