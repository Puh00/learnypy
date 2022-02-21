/* eslint-disable react/prop-types */
import React from 'react';

class CodeBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: "print('Hello World!')"
    };

    this.runit = props.runit;
    this.restart = props.restart;
    this.step = props.step;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    if (event.nativeEvent?.submitter.name == 'run') {
      console.log('run');
      this.runit(this.state.value);
    } else if (event.nativeEvent?.submitter.name == 'step') {
      console.log('step');
      this.step();
    } else if (event.nativeEvent?.submitter.name == 'restart') {
      console.log('restart');
      this.restart(this.state.value);
    }
  }

  // //Only submits first line. Use to step through code?
  // handleLineSubmit(event) {
  //   let line0 = this.state.value.split('\n')[0];
  //   event.preventDefault();
  //   this.runit(line0);
  // }

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="Form-box" id="CodeForm">
        <label>
          <textarea
            value={this.state.value}
            onChange={this.handleChange}
            cols="68" //TODO: Sizeing needs to be dynamic to account for different window sizes
            rows="25"
            className="Code-box"
          />
        </label>
      </form>
    );
  }
}

export default CodeBox;
