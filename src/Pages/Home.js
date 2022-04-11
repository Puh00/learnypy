import React, { useEffect, useRef, useState } from 'react';

import CodeBox from '../Components/CodeBox';
import ControlPanel from '../Components/ControlPanel';
import Header from '../Components/Header';
import OutputBox from '../Components/OutputBox';
import VisualBox from '../Components/VisualBox';
import Skulpt from '../SkulptWrapper/Skulpt';
import styles from './Home.module.css';

const Home = () => {
  const [globals, setGlobals] = useState({ objects: [], variables: [] });
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [locals, setLocals] = useState({ objects: [], variables: [] });
  const [output, setOutput] = useState({ text: '' });
  const [code, setCode] = useState('a=1\nb=1\nc=b');
  const [line, setLine] = useState(-1);
  const [stepped, setStepped] = useState(false);
  const [breakpoints, setBreakpoints] = useState([]);

  const drop_down_menu_ref = useRef(null);
  const output_box_ref = useRef(null);
  // create a mutatable ref so that it won't be reinitialised every rerender
  const shared_methods = useRef({});

  const skulpt = Skulpt.instance();

  let latest_output = '';

  // ===========================================================
  // =========================UTILITIES=========================
  // ===========================================================

  // highlights and stops at the specified line of the code
  const stop_at = (prog, line = 0) => {
    restart_callback(prog);
    setStepped(true);
    setLine(line);
  };

  const first_row_of_code = () => {
    const isSkippableLine = (row) => {
      // if the string is whitespace or a comment then it will be skipped
      return row.trim().length === 0 || row.trim().startsWith('#');
    };

    const rows = code.split('\n');

    for (let i = 0; i < rows.length; i++) {
      if (!isSkippableLine(rows[i])) return i;
    }
    return -1;
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

  // allow Home.js to use methods from the children by passing down this function
  // add more functions as parameters if needed
  const share_methods = ({ resetGraphZoom }) => {
    shared_methods.current.resetGraphZoom = resetGraphZoom;
  };

  // ===========================================================
  // ==========================BUTTONS==========================
  // ===========================================================

  // callback function sent to the debugger
  const callback = (globals, locals) => {
    setGlobals(globals);
    setLocals(locals);
  };

  const restart_callback = (prog) => skulpt.restart(prog, clear_visuals);

  const run_callback = (prog) => {
    // hack for stopping at the first row of the code if the condition is satisfied
    const first_row = first_row_of_code();
    if (!stepped && breakpoints.includes(first_row)) {
      stop_at(prog, first_row);
      return;
    }

    clear_visuals();
    setStepped(true);
    skulpt.run(prog, callback);

    if (typeof shared_methods.current.resetGraphZoom === 'function') {
      shared_methods.current.resetGraphZoom();
    }
  };

  const step_callback = (prog) => {
    const first_row = first_row_of_code();
    if (!stepped) {
      if (line === -1) {
        stop_at(prog, first_row);
      } else {
        stop_at(prog);
      }
      return;
    }

    skulpt.step(prog, callback);
  };

  // ===========================================================
  // ===================SKULPT CONFIGURATIONS===================
  // ===========================================================

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

  // ===========================================================
  // ===========================OTHER===========================
  // ===========================================================

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
        <VisualBox data={globals} share_methods={share_methods} />
      </div>
    </div>
  );
};

export default Home;
