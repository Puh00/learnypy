import React from 'react';

class CodeBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value:
        "import turtle\nt = turtle.Turtle()\nfor c in ['red', 'green', 'yellow', 'blue']:\n\tt.color(c)\n\tt.forward(75)\n\tt.left(90)"
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
      <form onSubmit={this.handleSubmit}>
        <label>
          <textarea value={this.state.value} onChange={this.handleChange} cols="50" rows="20" />
        </label>
        <input type="submit" value="Run" />
      </form>
    );
  }
}

export default CodeBox;
