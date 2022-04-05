import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import './CodeBox.css';

import raw from 'raw.macro';
import React, { useState } from 'react';
import { Controlled as CodeMirror } from 'react-codemirror2-react-17';

import border from './Border.module.css';
import styles from './CodeBox.module.css';

const marker_logo = raw('./Icons/marker-node.svg');
const breakpoint_logo = raw('./Icons/breakpoint-node.svg');

const CodeBox = ({
  code,
  setCode,
  line,
  breakpoints,
  drop_down_menu_ref,
  output_box_ref,
  add_breakpoint,
  remove_breakpoint
}) => {
  const [editor, setEditor] = useState(null);

  const set_highlighted_row = (_editor) => {
    // remove all previous highlighted lines and line markers
    _editor.eachLine((line) => {
      _editor.removeLineClass(line, 'wrap', styles['Line-highlight']);
      _editor.setGutterMarker(line, 'lineMarker', null);
    });

    if (line >= 0) {
      // Create line marker
      let marker_node = document.createElement('span');
      marker_node.className = styles['marker-node'];
      marker_node.innerHTML = marker_logo;

      // highlight the current execution row
      _editor.addLineClass(line, 'wrap', styles['Line-highlight']);
      _editor.setGutterMarker(line, 'lineMarker', marker_node);
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

  const breakpoint_node = () => {
    const breakpoint_node = document.createElement('span');
    breakpoint_node.className = styles['breakpoint-node'];
    breakpoint_node.innerHTML = breakpoint_logo;
    breakpoint_node.setAttribute('data-toggle', 'tooltip');
    breakpoint_node.setAttribute('title', 'Click to remove breakpoint');
    return breakpoint_node;
  };

  const update_breakpoints = (_editor) => {
    _editor.eachLine((line) => {
      _editor.setGutterMarker(
        line,
        'breakpoints',
        breakpoints.includes(line.lineNo()) ? breakpoint_node() : null
      );
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
