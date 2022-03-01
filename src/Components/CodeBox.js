/* eslint-disable react/prop-types */
import React from 'react';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/python/python';
import 'codemirror/theme/neat.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { Controlled as ControlledEditorComponent } from 'react-codemirror2-react-17';

class CodeBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'print(1)\nprint(2)\na=1;\nb=2;\nc=a;'
    };

    this.runit = props.runit;
    this.restart = props.restart;
    this.step = props.step;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(editor, data, value) {
    this.setState({ value: value });
  }

  handleSubmit(event) {
    console.log('handleSubmit');
    event.preventDefault();
    if (event.nativeEvent?.submitter.name == 'run') {
      console.log('run');
      this.runit(this.state.value);
    } else if (event.nativeEvent?.submitter.name == 'step') {
      console.log('step');
      this.step(this.state.value);
    } else if (event.nativeEvent?.submitter.name == 'restart') {
      console.log('restart');
      this.restart(this.state.value);
    }
  }

  render() {
    return (
      <div className="Code-box">
        <ControlledEditorComponent
          onBeforeChange={this.handleChange}
          value={this.state.value}
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
        />
      </div>
    );
  }
}

export default CodeBox;
