import React, { useState, useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { Controlled as CodeMirror } from 'react-codemirror2-react-17';
import { add_breakpoint, clear_breakpoint } from '../SkulptWrapper/skulptWrapper';

import './CodeBox.css'; // CodeMirror stuff
import styles from './CodeBox.module.css';
import border from './Border.module.css';

const CodeBox = ({ code, setCode, line, drop_down_menu_ref, output_box_ref }) => {
  const [next, setNext] = useState(null);

  // To prevent error caused by typos
  const breakpointGutterID = 'breakpoints';
  const lineMarkerGutterID = 'lineMarker';

  const setHighlightedRow = (editor) => {
    // remove all previous highlighted lines and line markers
    editor.eachLine((line) => {
      editor.removeLineClass(line, 'wrap', styles['Line-highlight']);
      editor.setGutterMarker(line, lineMarkerGutterID, null);
    });

    if (line >= 0) {
      // Create line marker
      var marker_node = document.createElement('span');
      marker_node.className = styles['marker-node'];
      marker_node.innerHTML =
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="16" fill="currentColor"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm1.828-8L8.293 6.464A1 1 0 0 1 9.707 5.05l4.243 4.243a1 1 0 0 1 0 1.414L9.707 14.95a1 1 0 1 1-1.414-1.414L11.828 10z"></path></svg>';

      // highlight the current execution row
      editor.addLineClass(line, 'wrap', styles['Line-highlight']);
      editor.setGutterMarker(line, lineMarkerGutterID, marker_node);
    }
  };

  const setBreakpoint = (lineNumber) => {
    console.log('setBreakpont on line ' + lineNumber);
    var breakpoint_node = document.createElement('span');
    breakpoint_node.className = styles['breakpoint-node'];
    breakpoint_node.innerHTML =
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-2 -2 24 24" width="15" fill="currentColor"><path d="M10 20C4.477 20 0 15.523 0 10S4.477 0 10 0s10 4.477 10 10-4.477 10-10 10zM5 9a1 1 0 1 0 0 2h10a1 1 0 0 0 0-2H5z"></path></svg>';

    // Add breakpoint functionality
    add_breakpoint(lineNumber);

    // Set breakpoint icon
    return breakpoint_node;
  };

  const clearBreakpoint = (lineNumber) => {
    console.log('clearBreakpont on line ' + lineNumber);

    // Remove breakpoint functionality
    clear_breakpoint(lineNumber);

    // Clear breakpoint icon
    return null;
  };

  const handleBreakpoints = (editor, lineNumber) => {
    var info = editor.lineInfo(lineNumber);

    //Set or clear breakpoint from clicked line
    editor.setGutterMarker(
      lineNumber,
      breakpointGutterID,
      info.gutterMarkers ? clearBreakpoint(lineNumber) : setBreakpoint(lineNumber)
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
          handleBreakpoints(editor, lineNumber);
        }}
        editorDidMount={(_editor, _value, next) => {
          setNext(() => next);
        }}
        editorDidConfigure={(editor) => {
          setHighlightedRow(editor);
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
