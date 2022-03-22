import React, { useEffect, useState } from 'react';

import { Graphviz } from 'graphviz-react';
import generate_dot from '../util/dotGenerator';

const VisualBox = ({ data }) => {
  const [graph, setGraph] = useState({ dot: 'graph {}' });

  useEffect(() => {
    const dot = generate_dot(data);
    setGraph(dot);

    //TODO screen reader
    set_logical_tabbing_on_graph();
  }, [data]);

  const set_logical_tabbing_on_graph = () => {
    var viz_box = document.getElementsByClassName('Visual-box')[0];
    viz_box.setAttribute('tabindex', '0');
  };

  return (
    <div className="Visual-box">
      <Graphviz dot={graph.dot} options={{ zoom: true }} />
    </div>
  );
};

export default VisualBox;
