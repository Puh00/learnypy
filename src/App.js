import React, { useState } from 'react';
import './App.css';
import CodeBox from './Components/CodeBox';
import Header from './Components/Header';
import Control_panel from './Components/ControlPanel';
import VisualBox from './Components/VisualBox';

import { start, step, runit } from './SkulptWrapper/skulptWrapper';

function App() {
  const [refs, setRefs] = useState({ objects: [], variables: [] });

  // instantiate with setRefs as the callback function
  const runit_callback = (prog) => runit(prog, setRefs);
  const step_callback = (prog) => step(prog, setRefs);

  return (
    <div className="App">
      <Header />
      <div id="App-body">
        <div id="Left-body">
          <Control_panel />
          <CodeBox runit={runit_callback} restart={start} step={step_callback}></CodeBox>
          <pre id="output" tabIndex={0}></pre>
        </div>
        <div id="Right-body">
          <VisualBox data={refs} />
        </div>
      </div>
    </div>
  );
}
export default App;
