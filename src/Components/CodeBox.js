/* eslint-disable react/prop-types */
import React from 'react';

class CodeBox extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      value: 'print(1)\nprint(2)\nprint(3)\nprint(4)\nprint(5)'
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
      this.step(this.state.value);
    } else if (event.nativeEvent?.submitter.name == 'restart') {
      console.log('restart');
      this.restart(this.state.value);
    }
  }

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
