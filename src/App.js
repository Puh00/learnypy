import React, { useState } from 'react';
import './App.css';
import CodeBox from './Components/CodeBox';
import Header from './Components/Header';
import Control_panel from './Components/ControlPanel';
import VisualBox from './Components/VisualBox';
import Output_box from './Components/OutputBox';

import { func, start, step, runit } from './SkulptWrapper/skulptWrapper';

function App() {
  const [refs, setRefs] = useState({ objects: [], variables: [] });
  const [output, setOutput] = useState({ text: '' });

  let latest_output = '';

  // instantiate with setRefs as the callback function
  const runit_callback = (prog) => {
    setOutput({ test: '' });
    runit(prog, setRefs);
    latest_output = '';
  };
  const step_callback = (prog) => {
    setOutput({ text: latest_output });
    step(prog, setRefs);
  };
  const start_callback = (prog) =>
    start(prog, false, () => {
      setOutput({ text: '' });
    });
  func.outf = (text) => {
    latest_output = latest_output + text;
    setOutput({ text: latest_output });
  };

  return (
    <div className="App">
      <Header />
      <div id="App-body">
        <div id="Left-body">
          <Control_panel />
          <CodeBox runit={runit_callback} restart={start_callback} step={step_callback}></CodeBox>
          <Output_box text={output} />
        </div>
        <div id="Right-body">
          <VisualBox data={refs} />
        </div>
      </div>
    </div>
  );
}
export default App;
