import React from 'react';
import { useState, useEffect, useRef } from 'react';

import ControlPanel from '../Components/ControlPanel';
import CodeBox from '../Components/CodeBox';
import OutputBox from '../Components/OutputBox';
import VisualBox from '../Components/VisualBox';
import Header from '../Components/Header';

import styles from './Home.module.css';

import Skulpt from '../SkulptWrapper/Skulpt';

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

  const skulpt = Skulpt.instance();

  let latest_output = '';

  // callback function sent to the debugger
  const callback = (globals, locals) => {
    setGlobals(globals);
    setLocals(locals);
  };

  const restart_callback = (prog) => skulpt.restart(prog, clear_visuals);

  const run_callback = (prog) => {
    // hack for stopping at the first row if the condition is satisfied
    if (!stepped && breakpoints.includes(0)) return stop_at_first_line(prog);

    clear_visuals();
    setStepped(true);
    skulpt.run(prog, callback);
  };

  const step_callback = (prog) => {
    if (!stepped) return stop_at_first_line(prog);

    skulpt.step(prog, callback);
  };

  // highlights and stops at the first line of the code
  const stop_at_first_line = (prog) => {
    restart_callback(prog);
    setStepped(true);
    setLine(0);
  };

  const clear_visuals = () => {
    setOutput({ text: '' });
    setGlobals({ objects: [], variables: [] });
    setLocals({ objects: [], variables: [] });
    setLine(-1);
    setStepped(false);
  };

  const clear_breakpoints = () => {
    setBreakpoints(() => []);
  };

  skulpt.configure({
    outf: (text) => {
      latest_output = latest_output + text;
      setOutput({ text: latest_output });
    },
    current_line: (lineno) => {
      setLine(lineno);
    },
    success: () => {
      setLine(-1);
      setStepped(false);
    },
    error: (e) => {
      setGlobals({ objects: [], variables: [] });
      setLocals({ objects: [], variables: [] });
      setStepped(false);
      skulpt.outf(e);
    }
  });

  useEffect(() => {
    skulpt.update_breakpoints(breakpoints);
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
            runit={run_callback}
            step={step_callback}
            restart={restart_callback}
            clear_breakpoints={clear_breakpoints}
            drop_down_menu_ref={drop_down_menu_ref}
            setCode={setCode}
          />
          <CodeBox
            code={code}
            setCode={setCode}
            line={line}
            breakpoints={breakpoints}
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
