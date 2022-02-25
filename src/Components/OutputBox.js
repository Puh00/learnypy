/* eslint-disable no-unused-vars */
import React from 'react';

class Output_box extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Output-box" ref={this.ref}>
        {this.props.text.text}
      </div>
    );
  }
}

export default Output_box;
