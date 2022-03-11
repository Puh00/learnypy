import React, { useState } from 'react';
import './App.css';
import CodeBox from './Components/CodeBox';
import Header from './Components/Header';
import ControlPanel from './Components/ControlPanel';
import VisualBox from './Components/VisualBox';
import Output_box from './Components/OutputBox';

import { func, start, step, runit } from './SkulptWrapper/skulptWrapper';

function App() {
  const [refs, setRefs] = useState({ objects: [], variables: [] });
  const [output, setOutput] = useState({ text: '' });
  const [code, setCode] = useState('a=1\nb=1\nc=b');
  const [line, setLine] = useState(-1);

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
  func.current_line = (lineno) => {
    setLine(lineno);
  };
  func.success = () => {
    setLine(-1);
  };

  return (
    <div className="App">
      <Header />
      <div id="App-body">
        <div id="Left-body">
          <ControlPanel
            code={code}
            runit={runit_callback}
            step={step_callback}
            restart={start_callback}
          />
          <CodeBox code={code} setCode={setCode} line={line} />
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
