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
    graphviz(`#graph-body`)
      .keyMode('id') // default keyMode is title, switch to id to avoid bugs
      .attributer((d) => {
        if (d.tag === 'svg') {
          // hide the generated svg file from screen readers
          d.attributes['aria-hidden'] = true;
          return;
        }

        if (d.tag === 'title') {
          // <title> should only have one child
          // set the title text as blank to prevent it from showing up as tooltip
          // otherwise it gives some pretty weird tooltips
          d.children[0].text = '';
        }
      })
      .renderDot(graph.dot);
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
