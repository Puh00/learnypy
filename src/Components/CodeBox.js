import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import './CodeBox.css';

import raw from 'raw.macro';
import React, { useEffect, useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2-react-17';

import styles from './CodeBox.module.css';

const breakpoint_logo = raw('./Icons/breakpoint-node.svg');

const CodeBox = ({
  code,
  setCode,
  isStepping,
  line,
  breakpoints,
  drop_down_menu_ref,
  output_box_ref,
  setError,
  setLine,
  error,
  add_breakpoint,
  remove_breakpoint
}) => {
  const [editor, setEditor] = useState(null);
  // eslint-disable-next-line unused-imports/no-unused-vars
  const [prevLine, setPrevLine] = useState(-1);
  const [prevBreakpoints, setPrevBreakpoints] = useState(() => []);

  let logo = error ? 'help' : 'marker-node';
  const marker_logo = raw(`./Icons/${logo}.svg`);

  const breakpoint_node = () => {
    const breakpoint_node = document.createElement('span');
    breakpoint_node.className = styles['breakpoint-node'];
    breakpoint_node.innerHTML = breakpoint_logo;
    breakpoint_node.setAttribute('data-toggle', 'tooltip');
    breakpoint_node.setAttribute('title', 'Click to remove breakpoint');
    return breakpoint_node;
  };

  const marker_node = () => {
    const marker_node = document.createElement('span');
    marker_node.className = styles['marker-node'];
    marker_node.innerHTML = marker_logo;
    marker_node.setAttribute('data-toggle', 'tooltip');
    marker_node.setAttribute('title', error ? 'Error on this line' : 'Next line to be executed');
    return marker_node;
  };

  const set_highlighted_row = (_editor) => {
    // remove previous highlighted line and line marker
    if (!error) {
      for (let i = 0; i < _editor.lineCount(); i++) {
        _editor.removeLineClass(i, 'wrap', styles['Line-highlight']);
        _editor.removeLineClass(i, 'wrap', styles['Error-Line-highlight']);
        _editor.setGutterMarker(i, 'lineMarker', null);
      }
    }

    if (line >= 0) {
      // highlight the current execution row
      _editor.addLineClass(line, 'wrap', styles[error ? 'Error-Line-highlight' : 'Line-highlight']);
      _editor.setGutterMarker(line, 'lineMarker', marker_node());
      _editor.scrollIntoView(line);
      if (error) {
        setLine(-1);
      }
    }
  };

  const handle_breakpoints = (_editor, lineNumber) => {
    let info = _editor.lineInfo(lineNumber);

    if (info.gutterMarkers && info.gutterMarkers.breakpoints) {
      remove_breakpoint(lineNumber);
      return;
    }

    add_breakpoint(lineNumber);
  };

  const update_breakpoints = (_editor) => {
    const bps_to_remove = prevBreakpoints.filter((bp) => !breakpoints.includes(bp));
    const bps_to_add = breakpoints.filter((bp) => !prevBreakpoints.includes(bp));

    bps_to_remove.forEach((bp) => {
      _editor.setGutterMarker(bp, 'breakpoints', null);
    });

    bps_to_add.forEach((bp) => {
      _editor.setGutterMarker(bp, 'breakpoints', breakpoint_node());
    });
  };

  const set_tooltip_breakpoint_area = () => {
    var breakpoint_area = document.getElementsByClassName('CodeMirror-gutters')[0];
    breakpoint_area.setAttribute('data-toggle', 'tooltip');
    breakpoint_area.setAttribute(
      'title',
      'Click next to the corresponding line to generate breakpoint'
    );
  };

  if (editor) {
    // update everything every time something rerenders
    update_breakpoints(editor);
    set_highlighted_row(editor);
    set_tooltip_breakpoint_area();
  }

  useEffect(() => {
    // update previous line for next render, only if line changed
    setPrevLine(line);
  }, [line]);

  useEffect(() => {
    // similar optimisation for breakpoints
    setPrevBreakpoints(() => breakpoints);
  }, [breakpoints]);

  return (
    <div className={`${styles.Container}`}>
      <CodeMirror
        className={isStepping ? 'read-only' : ''}
        value={code}
        options={{
          configureMouse: () => {
            return { addNew: false };
          },
          lineWrapping: true,
          lint: true,
          mode: 'python',
          lineNumbers: true,
          readOnly: isStepping ? 'nocursor' : false,
          theme: 'neat',
          autoCloseBrackets: true,
          autoCloseTags: true,
          gutters: ['breakpoints', 'lineMarker', 'CodeMirror-linenumbers']
        }}
        onGutterClick={(_editor, lineNumber) => {
          handle_breakpoints(_editor, lineNumber);
        }}
        editorDidMount={(_editor) => {
          setEditor(() => _editor);
        }}
        onBeforeChange={(_editor, data, value) => {
          if (data.text[0] != '\t') {
            setCode(value);
            update_breakpoints(_editor);
          }
        }}
        onKeyDown={(_editor, event) => {
          setError(false);
          if (event.key === 'Tab') {
            if (event.shiftKey) return drop_down_menu_ref.current.focus();
            output_box_ref.current.focus();
          }
        }}
      />
    </div>
  );
};

export default CodeBox;
