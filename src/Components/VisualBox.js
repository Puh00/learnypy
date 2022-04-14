import { graphviz } from 'd3-graphviz';
import React, { useEffect, useRef, useState } from 'react';

import generate_dot from '../util/dotGenerator';
import set_text from '../util/textGenerator';
import border from './Border.module.css';
import styles from './VisualBox.module.css';

var text;

const VisualBox = ({ data }) => {
  const [graph, setGraph] = useState({ dot: 'graph {bgcolor="skyblue1"}' });
  const container = useRef(null);

  useEffect(() => {
    const dot = generate_dot(data);
    setGraph(dot);
    text = set_text(data.objects, data.variables);
  }, [data]);

  useEffect(() => {
    const removeTitle = (ele) => {
      if (ele.tagName === 'title') {
        ele.innerHTML = '';
        return;
      }

      ele.childNodes.forEach((node) => {
        removeTitle(node);
      });
    };

    graphviz(`#graph-body`)
      .attributer((d) => {
        if (d.tag === 'svg') {
          // hide the generated svg file from screen readers
          d.attributes['aria-hidden'] = true;
          return;
        }
      })
      .renderDot(graph.dot);

    // remove title texts from all <title> tags, to prevent tooltips
    // after the graph has been rendered, this is a kinda scuffed...
    removeTitle(container.current.childNodes[0]);
  }, [graph]);

  return (
    <div
      ref={container}
      className={`${styles.Container} ${border.Border}`}
      id="graph-body"
      tabIndex={0}
      aria-label={text}></div>
  );
};

export default VisualBox;
