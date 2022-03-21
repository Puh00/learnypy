import React, { useEffect, useState } from 'react';

import styles from './VisualBox.module.css';

import Graph from 'react-graph-vis';
import parse from '../util/parser';

const VisualBox = ({ data }) => {
  const [graph, setGraph] = useState({ edges: [], nodes: [] });

  useEffect(() => {
    disable_tabbing_on_graph();
  }, []);

  useEffect(() => {
    const parsed_data = parse(data);
    setGraph(parsed_data);

    // can't pass graph here since it hasn't updated yet (weird flow in react)
    set_text(parsed_data);
  }, [data]);

  const options = {
    layout: {
      hierarchical: {
        treeSpacing: 80,
        direction: 'LR',
        sortMethod: 'directed'
      }
    },
    edges: {
      color: '#000000'
    },
    nodes: {
      shape: 'box'
    },
    physics: {
      enabled: false
    }
    // interaction: {
    //   zoomView: false
    // }
  };

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

  // for some reason the Graph component has a tabIndex of 900
  const disable_tabbing_on_graph = () => {
    var viz_box = document.getElementsByClassName('vis-network')[0];
    // disable the graph's tabindex
    viz_box.setAttribute('tabindex', '-1');
  };

  return (
    <div className={styles['visual-box']} tabIndex={0}>
      <Graph graph={graph} options={options} />
    </div>
  );
};

export default VisualBox;
