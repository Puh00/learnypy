import React from 'react';

class CodeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: "print('Hello World!')"
    };
    // eslint-disable-next-line react/prop-types
    this.runit = props.runit;

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.runit(this.state.value);
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
