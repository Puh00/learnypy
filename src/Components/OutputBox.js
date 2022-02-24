/* eslint-disable no-unused-vars */
import React from 'react';

class Output_box extends React.Component {
  constructor(props) {
    super(props);
    this.state = { text: this.props.text };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({ text: this.props.text });
    this.forceUpdate();
  }

  render() {
    return (
      <div className="Output-box" onShow={this.handleChange} onApply={this.handleChange}>
        {this.state.text}
      </div>
    );
  }
}

export default Output_box;
