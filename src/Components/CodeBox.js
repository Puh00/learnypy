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

const CodeBox = ({ code, setCode, line, graph_ref, drop_down_menu_ref }) => {
  const [next, setNext] = useState(null);

  const setHighlightedRow = (editor) => {
    // remove all previous highlighted lines
    editor.eachLine((line) => {
      editor.removeLineClass(line, 'wrap', 'mark');
    });

    if (line >= 0) {
      // highlight the current execution row
      editor.addLineClass(line, 'wrap', 'mark');
    }
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
          tabindex: 0
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
        onKeyDown={(_editor, event) => {
          if (event.key === 'Tab') {
            if (event.shiftKey) return drop_down_menu_ref.current.focus();
            graph_ref.current.focus();
          }
        }}
      />
    </div>
  );
};

export default CodeBox;
