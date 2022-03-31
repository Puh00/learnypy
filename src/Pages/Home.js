import React from 'react';
import { useState, useEffect, useRef } from 'react';

import ControlPanel from '../Components/ControlPanel';
import CodeBox from '../Components/CodeBox';
import OutputBox from '../Components/OutputBox';
import VisualBox from '../Components/VisualBox';
import Header from '../Components/Header';

import { func, start, step, runit, update_breakpoints } from '../SkulptWrapper/skulptWrapper';

import styles from './Home.module.css';

const Home = () => {
  const [globals, setGlobals] = useState({ objects: [], variables: [] });
  // eslint-disable-next-line no-unused-vars
  const [locals, setLocals] = useState({ objects: [], variables: [] });
  const [output, setOutput] = useState({ text: '' });
  const [code, setCode] = useState('a=1\nb=1\nc=b');
  const [line, setLine] = useState(-1);
  const [stepped, setStepped] = useState(false);
  const [breakpoints, setBreakpoints] = useState([]);

  const drop_down_menu_ref = useRef(null);
  const output_box_ref = useRef(null);

  let latest_output = '';

  const restart = (prog) =>
    start(prog, false, () => {
      clear();
    });

  // highlights and stops at the first line of the code
  const stop_at_first_line = (prog) => {
    restart(prog);
    setStepped(true);
    setLine(0);
  };

  // callback function sent to the debugger
  const callback = (globals, locals) => {
    setGlobals(globals);
    setLocals(locals);
  };

  const runit_callback = (prog) => {
    // hack for stopping at the first row if the condition is satisfied
    if (!stepped && breakpoints.includes(0)) return stop_at_first_line(prog);

    clear();
    setStepped(true);
    runit(prog, callback);
  };

  const step_callback = (prog) => {
    if (!stepped) return stop_at_first_line(prog);

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

  useEffect(() => {
    update_breakpoints(breakpoints);
  }, [breakpoints]);

  const navItems = [
    {
      name: 'about',
      link: '/about'
    }
  ];

  return (
    <div className={styles['Outer-grid']}>
      <Header navItems={navItems} />
      <div className={styles['Content-body']}>
        <div className={styles['Left-body']}>
          <ControlPanel
            code={code}
            runit={runit_callback}
            step={step_callback}
            restart={restart}
            drop_down_menu_ref={drop_down_menu_ref}
            setCode={setCode}
          />
          <CodeBox
            code={code}
            setCode={setCode}
            line={line}
            drop_down_menu_ref={drop_down_menu_ref}
            output_box_ref={output_box_ref}
            add_breakpoint={(line_number) =>
              setBreakpoints((breakpoints) => [...breakpoints, line_number])
            }
            remove_breakpoint={(line_number) =>
              setBreakpoints((breakpoints) => [...breakpoints].filter((e) => e !== line_number))
            }
          />
          <OutputBox output={output} output_box_ref={output_box_ref} />
        </div>
        <VisualBox data={globals} />
      </div>
    </div>
  );
};

export default Home;
