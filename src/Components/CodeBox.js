import React, { useEffect } from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { UnControlled as CodeMirror } from 'react-codemirror2-react-17';

import './CodeBox.css';

const CodeBox = ({ code, setCode, line }) => {
  // This is a truly horrible and scuffed hack for forcing the CodeMirror to update.
  // The two useEffects below basically appends and removes a character that I found
  // from scrolling through the character list for UTF-16. This forces the CodeMirror
  // component to update which triggers the onChange event.
  useEffect(() => {
    setCode(code + 'ϗ');
  }, [line]);
  useEffect(() => {
    // Yes, this code makes it impossible to write the 'ϗ' symbol. Hopefully there
    // won't be any greek programmers that uses our tool in the future.
    if (code.slice(-1) === 'ϗ') setCode(code.slice(0, -1));
  }, [code]);

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
          autoCloseTags: true
        }}
        onChange={(editor, _, value) => {
          setCode(value);

          // remove all previous highlighted lines
          editor.removeLineClass(Infinity, 'wrap', 'mark');
          if (line > 0) {
            // highlight the current execution row
            editor.addLineClass(line, 'wrap', 'mark');
          }
        }}
      />
    </div>
  );
};

export default CodeBox;
