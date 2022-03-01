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

  // instantiate with setRefs as the callback function
  const runit_callback = (prog) => runit(prog, setRefs);
  const step_callback = (prog) =>
    step(prog, (vars, objs) => {
      setRefs(vars, objs);
    });
  const start_callback = (prog) =>
    start(prog, false, () => {
      setOutput('');
    });
  let latest_output = '';
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
