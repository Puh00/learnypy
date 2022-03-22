import React from 'react';
import { useState, useEffect } from 'react';

import ControlPanel from '../Components/ControlPanel';
import CodeBox from '../Components/CodeBox';
import Output_box from '../Components/OutputBox';
import VisualBox from '../Components/VisualBox';

import { func, start, step, runit } from '../SkulptWrapper/skulptWrapper';
import Header from '../Components/Header';

const Home = () => {
  const [refs, setRefs] = useState({ objects: [], variables: [] });
  const [output, setOutput] = useState({ text: '' });
  const [code, setCode] = useState('a=1\nb=1\nc=b');
  const [line, setLine] = useState(-1);
  const [stepped, setStepped] = useState(false);

  let latest_output = '';

  const restart = (prog) =>
    start(prog, false, () => {
      clear();
    });

  // instantiate with setRefs as the callback function
  const runit_callback = (prog) => runit(prog, setRefs);

  const step_callback = (prog) => {
    if (!stepped) {
      // reset the program to allow continous stepping
      restart(prog);
      setStepped(true);
      setLine(0);
      return;
    }

    step(prog, setRefs);
  };

  const clear = () => {
    setOutput({ text: '' });
    setRefs({ objects: [], variables: [] });
    setLine(-1);
    setStepped(false);
  };

  func.outf = (text) => {
    latest_output = latest_output + text;
    setOutput({ text: latest_output });
  };

  // run these functions only once
  useEffect(() => {
    func.current_line = (lineno) => {
      setLine(lineno);
    };

    func.success = () => {
      setLine(-1);
      setStepped(false);
    };

    func.error = (e) => {
      setRefs({ objects: [], variables: [] });
      setStepped(false);
      func.outf(e);
    };
  }, []);

  const navItems = [
    {
      name: 'about',
      link: '/about'
    }
  ];

  return (
    <div className="App">
      <Header navItems={navItems} />
      <div id="App-body">
        <div id="Left-body">
          <ControlPanel
            code={code}
            runit={runit_callback}
            step={step_callback}
            restart={clear}
            setCode={setCode}
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
};

export default Home;
