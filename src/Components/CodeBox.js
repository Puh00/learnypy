import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { Controlled as ControlledEditorComponent } from 'react-codemirror2-react-17';

import './CodeBox.css';

// eslint-disable-next-line no-unused-vars
const CodeBox = ({ code, setCode, line }) => {
  return (
    <div className="Code-box">
      <ControlledEditorComponent
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
        onBeforeChange={(editor, data, value) => {
          setCode(value);
          // editor.addLineClass(line, 'wrap', 'mark');
        }}
      />
    </div>
  );
};

export default CodeBox;
