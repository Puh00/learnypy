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

  render() {
    return (
      <form onSubmit={this.handleSubmit} className="Form-box">
        <label>
          <textarea
            value={this.state.value}
            onChange={this.handleChange}
            cols="68"
            rows="25"
            className="Code-box"
          />
        </label>
        <input type="submit" value="Run" />
      </form>
    );
  }
}

export default CodeBox;
