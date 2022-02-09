import React, { Component } from "react";

class Button extends Component {
  text = "klick!";

  handle() {}

  render() {
    return (
      <div className="Button">
        <Button onClick={this.handle}>Contained</Button>
      </div>
    );
  }
}

export default Button;
