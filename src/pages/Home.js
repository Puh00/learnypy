import React, { useEffect, useRef, useState } from 'react';
import { useCookies } from 'react-cookie';

import Header from 'src/components/Header';
import CodeBox from 'src/features/code-box/CodeBox';
import ControlPanel from 'src/features/code-box/ControlPanel';
import OutputBox from 'src/features/output-box/OutputBox';
import VisualBox from 'src/features/visual-box/VisualBox';
import styles from 'src/pages/Home.module.css';
import Skulpt from 'src/skulpt-wrapper/Skulpt';

const Home = () => {
  const [globals, setGlobals] = useState({ objects: [], variables: [] });
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [locals, setLocals] = useState({ objects: [], variables: [] });
  const [output, setOutput] = useState({ text: '' });
  const [line, setLine] = useState(-1);
  const [locked, setLocked] = useState(false);
  // breakpoints is a list of Line objects from codemirror because of we need the side effects
  const [breakpoints, setBreakpoints] = useState([]);
  const [error, setError] = useState(false);

  // get the cookies with a dependency on 'code'
  const [cookies, setCookie] = useCookies(['code']);

  const drop_down_menu_ref = useRef(null);
  const output_box_ref = useRef(null);
  // create a mutatable ref so that it won't be reinitialised every rerender
  const shared_methods = useRef({});

  const skulpt = Skulpt.instance();

  let latest_output = '';
  document.title = 'LearnyPy';

  // ===========================================================
  // =========================UTILITIES=========================
  // ===========================================================

  // highlights and stops at the specified line of the code
  const stop_at = (prog, line = 0, run = false) => {
    restart_callback(prog, run);
    setLine(line);
    setLocked(true);
  };

  const first_row_of_code = () => {
    const isSkippableLine = (row) => {
      // if the string is whitespace or a comment then it will be skipped
      return row.trim().length === 0 || row.trim().startsWith('#');
    };

    const rows = cookies.code.split('\n');

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
    setLocked(false);
  };

  const clear_breakpoints = () => {
    setBreakpoints(() => []);
  };

  // allow Home.js to use methods from the children by passing down this function
  const share_methods = (methods) => {
    for (const method of Object.getOwnPropertyNames(methods)) {
      if (typeof methods[method] === 'function') {
        shared_methods.current[method] = methods[method];
      }
    }
  };

  const setCode = (code) => {
    // set a cookie for the code which expires after 1 day
    setCookie('code', code, { path: '/', maxAge: 60 * 60 * 24 });
  };

  // ===========================================================
  // ==========================BUTTONS==========================
  // ===========================================================

  // callback function sent to the debugger
  const callback = (globals, locals) => {
    setGlobals(globals);
    setLocals(locals);
  };

  const restart_callback = (prog, run = false) => {
    setLocked(false);
    setError(false);
    skulpt.restart(prog, clear_visuals, run);
  };

  const run_callback = (prog) => {
    const bp_lines = shared_methods.current.breakpoints_to_lines(breakpoints);
    // update breakpoints only when running the program
    skulpt.update_breakpoints(bp_lines);
    // hack for stopping at the first row of the code if the condition is satisfied
    const first_row = first_row_of_code();
    if (!locked && bp_lines.includes(first_row)) {
      stop_at(prog, first_row);
      return;
    }

    clear_visuals();
    setError(false);
    setLocked(true);
    skulpt.run(prog, callback);

    if (typeof shared_methods.current.resetGraphZoom === 'function') {
      shared_methods.current.resetGraphZoom();
    }
  };

  const step_callback = (prog) => {
    setError(false);
    const first_row = first_row_of_code();
    if (!locked) {
      if (line === -1) {
        stop_at(prog, first_row, true);
      } else {
        stop_at(prog);
      }
      // reset the graph zoom at step if the program just restarted
      if (typeof shared_methods.current.resetGraphZoom === 'function') {
        shared_methods.current.resetGraphZoom();
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
      setLocked(false);
    },
    error: (e) => {
      // secretly restart the program whenever there is an error
      skulpt.restart('');
      skulpt.outf(e);
      setGlobals({ objects: [], variables: [] });
      setLocals({ objects: [], variables: [] });
      setLocked(false);
      setError(true);
    }
  });

  // ===========================================================
  // ===========================OTHER===========================
  // ===========================================================

  useEffect(() => {
    if (!cookies.code || !cookies.code.trim()) setCode('a=1\nb=1\nc=b');
  }, []);

  const navItems = [
    {
      name: 'about',
      link: '/about'
    }
  ];

  return (
    <div className={styles.Page}>
      <Header navItems={navItems} />
      <div className={styles.Container}>
        <div className={styles['Control-panel']}>
          <ControlPanel
            code={cookies.code}
            runit={run_callback}
            step={step_callback}
            restart={restart_callback}
            clear_breakpoints={clear_breakpoints}
            drop_down_menu_ref={drop_down_menu_ref}
            setCode={setCode}
          />
        </div>
        <div className={styles['Code-box']}>
          <CodeBox
            line={line}
            setLine={setLine}
            code={cookies.code}
            setCode={setCode}
            error={error}
            setError={setError}
            breakpoints={breakpoints}
            setBreakpoints={setBreakpoints}
            isStepping={locked}
            share_methods={share_methods}
            drop_down_menu_ref={drop_down_menu_ref}
            output_box_ref={output_box_ref}
          />
        </div>
        <div className={styles['Output-box']}>
          <OutputBox output={output} output_box_ref={output_box_ref} />
        </div>
        <div className={styles['Visual-box']} tabIndex={0}>
          <VisualBox data={globals} share_methods={share_methods} />
        </div>
      </div>
    </div>
  );
};

export default Home;
