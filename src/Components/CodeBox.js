import React, { useState, useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { Controlled as CodeMirror } from 'react-codemirror2-react-17';

import './CodeBox.css';
import styles from './CodeBox.module.css';
import border from './Border.module.css';

import breakpoint_logo from './Icons/breakpoint-node';
import marker_logo from './Icons/marker-node';

const CodeBox = ({
  code,
  setCode,
  line,
  drop_down_menu_ref,
  output_box_ref,
  add_breakpoint,
  remove_breakpoint
}) => {
  const [next, setNext] = useState(null);

  // To prevent error caused by typos
  const breakpointGutterID = 'breakpoints';
  const lineMarkerGutterID = 'lineMarker';

  const set_highlighted_row = (editor) => {
    // remove all previous highlighted lines and line markers
    editor.eachLine((line) => {
      editor.removeLineClass(line, 'wrap', styles['Line-highlight']);
      editor.setGutterMarker(line, lineMarkerGutterID, null);
    });

    if (line >= 0) {
      // Create line marker
      let marker_node = document.createElement('span');
      marker_node.className = styles['marker-node'];
      marker_node.innerHTML = marker_logo;

      // highlight the current execution row
      editor.addLineClass(line, 'wrap', styles['Line-highlight']);
      editor.setGutterMarker(line, lineMarkerGutterID, marker_node);
    }
  };

  const set_breakpoint = (lineNumber) => {
    let breakpoint_node = document.createElement('span');
    breakpoint_node.className = styles['breakpoint-node'];
    breakpoint_node.innerHTML = breakpoint_logo;

    add_breakpoint(lineNumber);
    // Set breakpoint icon
    return breakpoint_node;
  };

  const clear_breakpoint = (lineNumber) => {
    remove_breakpoint(lineNumber);
    // Clear breakpoint icon
    return null;
  };

  const handle_breakpoints = (editor, lineNumber) => {
    let info = editor.lineInfo(lineNumber);

    //Set or clear breakpoint from clicked line
    editor.setGutterMarker(
      lineNumber,
      breakpointGutterID,
      info.gutterMarkers ? clear_breakpoint(lineNumber) : set_breakpoint(lineNumber)
    );
  };

  useEffect(() => {
    if (next === null) return;
    // calling next() to force an editorDidConfigure event
    next();
  }, [line]);

  return (
    <div className={`${styles.Container} ${border.Border}`}>
      <CodeMirror
        value={code}
        options={{
          lineWrapping: true,
          lint: true,
          mode: 'python',
          lineNumbers: true,
          theme: 'neat',
          autoCloseBrackets: true,
          autoCloseTags: true,
          gutters: [breakpointGutterID, lineMarkerGutterID, 'CodeMirror-linenumbers']
        }}
        onGutterClick={(editor, lineNumber) => {
          handle_breakpoints(editor, lineNumber);
        }}
        editorDidMount={(_editor, _value, next) => {
          setNext(() => next);
        }}
        editorDidConfigure={(editor) => {
          set_highlighted_row(editor);
        }}
        onBeforeChange={(_editor, data, value) => {
          if (data.text[0] != '\t') setCode(value);
        }}
        onKeyDown={(_editor, event) => {
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
