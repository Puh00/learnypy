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

import './CodeBox.css';

const CodeBox = ({ code, setCode, line }) => {
  const [next, setNext] = useState(null);

  const setHighlightedRow = (editor) => {
    // remove all previous highlighted lines
    editor.eachLine((line) => {
      editor.removeLineClass(line, 'wrap', 'mark');
    });

    if (line > 0) {
      // highlight the current execution row
      editor.addLineClass(line, 'wrap', 'mark');
    }
  };

  // To prevent error caused by typos
  const breakpointGutterID = 'breakpoints';

  const setBreakpoint = (lineNumber) => {
    var breakpoint_node = document.createElement('span');
    breakpoint_node.innerHTML = '&#128308;';

    // Add breakpoint functionality
    add_breakpoint(lineNumber);

    // Set breakpoint icon
    return breakpoint_node;
  };

  const clearBreakpoint = (lineNumber) => {
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
    <div className="Code-box">
      <CodeMirror
        value={code}
        className="code-mirror-wrapper"
        options={{
          lineWrapping: true,
          lint: true,
          mode: 'python',
          lineNumbers: true,
          theme: 'neat',
          autoCloseBrackets: true,
          autoCloseTags: true,
          gutters: [breakpointGutterID, 'CodeMirror-linenumbers']
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
        onBeforeChange={(_editor, _data, value) => {
          setCode(value);
        }}
      />
    </div>
  );
};

export default CodeBox;
