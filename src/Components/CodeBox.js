import React, { useState, useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { Controlled as CodeMirror } from 'react-codemirror2-react-17';

import './CodeBox.css'; // CodeMirror stuff
import styles from './CodeBox.module.css';
import border from './Border.module.css';

const CodeBox = ({ code, setCode, line, drop_down_menu_ref, output_box_ref }) => {
  const [next, setNext] = useState(null);

  const setHighlightedRow = (editor) => {
    // remove all previous highlighted lines
    editor.eachLine((line) => {
      editor.removeLineClass(line, 'wrap', styles['Line-highlight']);
    });

    if (line >= 0) {
      // highlight the current execution row
      editor.addLineClass(line, 'wrap', styles['Line-highlight']);
    }
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
          tabindex: 0
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
