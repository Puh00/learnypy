import React from 'react';

import styles from './VisualBox.module.css';

import Graph from 'react-graph-vis';
import parse from '../util/parser';

function VisualBox({ data }) {
  const options = {
    layout: {
      hierarchical: {
        direction: 'LR',
        sortMethod: 'directed'
      }
    },
    edges: {
      color: '#000000'
    },
    height: '500px',
    nodes: {
      shape: 'box'
    }
    // interaction: {
    //   zoomView: false
    // }
  };

  //generates a text that discribes the graph of objects and sets it as aria-label for the canvas element to support screen readers
  // eslint-disable-next-line no-unused-vars
  function set_text() {
    const refs = parse(data);
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
    //places the graph in logical tab order
    var viz_box = document.getElementsByClassName('vis-network')[0];
    viz_box.setAttribute('tabindex', '0');
  }
  return (
    <div className={styles['visual-box']}>
      <Graph graph={parse(data)} options={options} />
    </div>
  );
}

export default VisualBox;
