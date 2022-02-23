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

  return (
    <div className={styles['visual-box']}>
      <Graph graph={parse(data)} options={options} />
    </div>
  );
}

export default VisualBox;
