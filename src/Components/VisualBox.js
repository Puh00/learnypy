import React, { useEffect, useState } from 'react';
import styles from './VisualBox.module.css';

import Graph from 'react-graph-vis';
import parse from '../util/parser';

const test = {
  nodes: [
    { id: 'popo', label: 'Node 1' },
    { id: 'pipi', label: 'Node 2' },
    { id: 'bobo', label: 'Node 3' },
    { id: 'bubu', label: 'Node 4' },
    { id: 'yayeet', label: 'Node 5' }
  ],
  edges: [
    { from: 'popo', to: 'pipi' },
    { from: 'popo', to: 'bobo' },
    { from: 'pipi', to: 'bubu' },
    { from: 'pipi', to: 'yayeet' }
  ]
};

function VisualBox({ data }) {
  const canvas = React.createRef(); //vill nå 'canvas' elementet, funkar ej
  const [refs, setRefs] = useState({ nodes: [], edges: [] });

  useEffect(() => {
    setRefs({ ...parse(data) });
  }, []);

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

  console.log(canvas.current); //fungerar ej
  //canvas.title = 'vill här beskriva bilden, dynamiskt vad den visar';
  //canvas.tabIndex = '0';
  return (
    <div alt="area for visualizing the objects in the code" className={styles['visual-box']}>
      {
        //g
        <button
          onClick={() => {
            setRefs(test);
          }}>
          Update graph
        </button>
      }
      <Graph key={Date.now()} graph={refs} options={options}>
        <input ref={canvas} />
      </Graph>
    </div>
  );
}

export default VisualBox;
