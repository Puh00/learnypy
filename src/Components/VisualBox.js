import { graphviz } from 'd3-graphviz';
import React, { useEffect, useState } from 'react';

import generate_dot from '../util/dotGenerator';
import set_text from '../util/textGenerator';
import border from './Border.module.css';
import styles from './VisualBox.module.css';

var text;

const VisualBox = ({ data }) => {
  const [graph, setGraph] = useState({ dot: 'graph {}' });

  useEffect(() => {
    const dot = generate_dot(data);
    setGraph(dot);
    text = set_text(data.objects, data.variables);
  }, [data]);

  useEffect(() => {
    graphviz(`#graph-body`).renderDot(graph.dot);
  }, [graph]);

  return (
    <div
      className={`${styles.Container} ${border.Border}`}
      id="graph-body"
      tabIndex={0}
      aria-label={text}></div>
  );
};

export default VisualBox;
