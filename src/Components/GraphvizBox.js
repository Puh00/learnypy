import React, { useEffect, useState } from 'react';

import styles from './VisualBox.module.css';

import { Graphviz } from 'graphviz-react';
import generate_dot from '../util/dotGenerator';
import parse from '../util/parser';

const VisualBox = ({ data }) => {
  const [graph, setGraph] = useState({ dot: `graph {}` });

  useEffect(() => {
    const dot = generate_dot(data);
    setGraph(dot);
    const parsed_data = parse(data); // TODO still needed for screen reader

    // can't pass graph here since it hasn't updated yet (weird flow in react)
    set_text(parsed_data);
    set_logical_tabbing_on_graph();
  }, [data]);

  // generates a text that discribes the graph of objects and sets it as aria-label
  // for the canvas element to support screen readers
  const set_text = (graph) => {
    const refs = graph;
    var alt_text = '';
    for (let i = 0; i < refs.nodes.length; i++) {
      var id = refs.nodes[i].id;
      for (let p = 0; p < refs.edges.length; p++) {
        if (refs.edges[p].from == id) {
          var to = refs.edges[p].to;
          for (let j = 0; j < refs.nodes.length; j++) {
            if (refs.nodes[j].id == to) {
              alt_text = alt_text.concat(' Node ');
              alt_text = alt_text.concat(refs.nodes[i].label);
              alt_text = alt_text.concat(' points to ');
              alt_text = alt_text.concat(refs.nodes[j].label);
              alt_text = alt_text.concat('.');
            }
          }
        }
      }
    }
    var canvas = document.getElementsByTagName('canvas')[0];
    canvas.setAttribute('aria-label', alt_text);
  };

  //TODO
  const set_logical_tabbing_on_graph = () => {
    var viz_box = document.getElementsByClassName('vis-network')[0];
    viz_box.setAttribute('tabindex', '0');
  };

  return (
    <div className={styles['visual-box']}>
      <Graphviz dot={graph.dot} />
    </div>
  );
};

export default VisualBox;
