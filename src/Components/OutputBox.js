import React from 'react';

class Output_box extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="Output-box" data-testid="output-box" ref={this.ref}>
        {this.props.text.text}
      </div>
    );
  }
}

export default Output_box;
