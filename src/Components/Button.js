import React from 'react';

/* GENERAL BUTTONS CLASS */
class Button {
  icon; //Button icon, svg
  on_click = () => {}; //Fuction called when button is clicked
  tooltip = ''; //Tooltip showed on hover
  className = ''; //Custom styling

  constructor(icon, on_click, tooltip, className = 'Button') {
    this.icon = icon;
    this.on_click = on_click;
    this.tooltip = tooltip;
    this.className = className;
  }

  render = () => {
    return (
      <button
        onClick={this.on_click}
        className={this.className}
        data-toggle="tooltip"
        title={this.tooltip}>
        {this.icon}
      </button>
    );
  };
}

export default Button;
