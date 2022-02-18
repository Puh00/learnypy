import React from 'react';
import { ReactComponent as Play_logo } from './Icons/play.svg';
import { ReactComponent as Next_logo } from './Icons/arrow-right.svg';
import { ReactComponent as Pause_logo } from './Icons/pause.svg';
import { ReactComponent as Repeat_logo } from './Icons/repeat.svg';
import { ReactComponent as Menu_logo } from './Icons/vertical-menu-dots.svg'; /*Find correct logo*/

// } else if (this.on_click() == 'dropdown') {
//   return (
//     <div className="Dropdown">
//       <button onClick={this.on_click} className="Control-button">
//         {this.icon}
//       </button>
//       <div className="Dropdown-menu">
//         <a className="Dropdown-item" href="#">
//           Action
//         </a>
//         <a className="Dropdown-item" href="#">
//           Another action
//         </a>
//         <a className="Dropdown-item" href="#">
//           Something else here
//         </a>
//       </div>
//     </div>
//   );

/* BUTTONS CLASS */
//This could possibly be moved to create a more general buttons-class
class Control_button {
  icon; //Button icon, svg
  on_click = () => {}; //Fuction called when button is clicked
  tooltip = '';

  constructor(icon, on_click, tooltip) {
    this.icon = icon;
    this.on_click = on_click;
    this.tooltip = tooltip;
  }

  render = () => {
    //prob. better way to do this instead of if/else?
    if (this.on_click() == 'submit') {
      return (
        <button
          type="submit"
          form="CodeForm"
          className="Control-button"
          data-toggle="tooltip"
          title={this.tooltip}>
          {this.icon}
        </button>
      );
    } else {
      return (
        <button
          onClick={this.on_click}
          className="Control-button"
          data-toggle="tooltip"
          title={this.tooltip}>
          {this.icon}
        </button>
      );
    }
  };
}

/*  CREATING BUTTONS */
const play_button = new Control_button(
  <Play_logo />,
  () => {
    /* Run all code */
    return 'submit';
  },
  'Run code'
);

const next_button = new Control_button(
  <Next_logo />,
  () => {
    /*Step one line in code*/
  },
  'Run next line'
);

const pause_button = new Control_button(
  <Pause_logo />,
  () => {
    /*pause running code*/
  },
  'Pause running code'
);

const repeat_button = new Control_button(
  <Repeat_logo />,
  () => {
    /* Restart code */
  },
  'Restart'
);

const menu_button = new Control_button(
  <Menu_logo />,
  () => {
    /*Drop down menu*/
    return 'dropdown';
  },
  'Menu'
);

/* CREATING CONTROL PANEL */
function Control_panel() {
  return (
    <div className="Control-panel">
      <play_button.render />
      <next_button.render />
      <pause_button.render />
      <repeat_button.render />
      <menu_button.render />
    </div>
  );
}

export default Control_panel;
