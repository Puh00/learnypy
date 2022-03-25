import React from 'react';
import { useState, useEffect, useRef } from 'react';

import ControlPanel from '../Components/ControlPanel';
import CodeBox from '../Components/CodeBox';
import OutputBox from '../Components/OutputBox';
import VisualBox from '../Components/VisualBox';

import { func, start, step, runit } from '../SkulptWrapper/skulptWrapper';
import Header from '../Components/Header';

const Home = () => {
  const [globals, setGlobals] = useState({ objects: [], variables: [] });
  // eslint-disable-next-line no-unused-vars
  const [locals, setLocals] = useState({ objects: [], variables: [] });
  const [output, setOutput] = useState({ text: '' });
  const [code, setCode] = useState('a=1\nb=1\nc=b');
  const [line, setLine] = useState(-1);
  const [stepped, setStepped] = useState(false);

  const drop_down_menu_ref = useRef(null);
  const output_box_ref = useRef(null);

  let latest_output = '';

  // callback function sent to the debugger
  const callback = (globals, locals) => {
    setGlobals(globals);
    setLocals(locals);
  };

  const restart = (prog) =>
    start(prog, false, () => {
      clear();
    });

  // instantiate with setRefs as the callback function
  const runit_callback = (prog) => {
    clear();
    runit(prog, callback);
  };

  const step_callback = (prog) => {
    if (!stepped) {
      // reset the program to allow continous stepping
      restart(prog);
      setStepped(true);
      setLine(0);
      return;
    }

    step(prog, callback);
  };

  const clear = () => {
    setOutput({ text: '' });
    setGlobals({ objects: [], variables: [] });
    setLocals({ objects: [], variables: [] });
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
      setGlobals({ objects: [], variables: [] });
      setLocals({ objects: [], variables: [] });
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
    <div className="Outer-grid">
      <Header navItems={navItems} />
      <div className="Content-body">
        <div className="Left-body">
          <ControlPanel
            code={code}
            runit={runit_callback}
            step={step_callback}
            restart={clear}
            drop_down_menu_ref={drop_down_menu_ref}
            setCode={setCode}
          />
          <CodeBox
            code={code}
            setCode={setCode}
            line={line}
            drop_down_menu_ref={drop_down_menu_ref}
            output_box_ref={output_box_ref}
          />
          <OutputBox output={output} output_box_ref={output_box_ref} />
        </div>
        <VisualBox data={globals} />
      </div>
    </div>
  );
};

export default Home;
