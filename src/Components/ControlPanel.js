import React from 'react';
import { ReactComponent as Play_logo } from './Icons/play.svg';
import { ReactComponent as Next_logo } from './Icons/arrow-right.svg';
import { ReactComponent as Pause_logo } from './Icons/pause.svg';
import { ReactComponent as Repeat_logo } from './Icons/repeat.svg';
import { ReactComponent as Menu_logo } from './Icons/vertical-menu-dots.svg'; /*Find correct logo*/
import Button from './Button';

/* SPECIALICED BUTTONS CLASS */
class Control_button extends Button {
  constructor(icon, on_click, tooltip) {
    super(icon, on_click, tooltip, 'Control-button');
  }

  render = () => {
    //prob. better way to do this instead of if/else?
    if (this.on_click() == 'run') {
      return (
        <button
          type="submit"
          form="CodeForm"
          name="run"
          className={this.className}
          title={this.tooltip}>
          {this.icon}
        </button>
      );
    } else if (this.on_click() == 'step') {
      return (
        <button
          type="submit"
          form="CodeForm"
          name="step"
          className={this.className}
          title={this.tooltip}>
          {this.icon}
        </button>
      );
    } else if (this.on_click() == 'restart') {
      return (
        <button
          type="submit"
          form="CodeForm"
          name="restart"
          className={this.className}
          title={this.tooltip}>
          {this.icon}
        </button>
      );
    } else {
      //Must be able to return super.render here somehow?
      return (
        <button onClick={this.on_click} className={this.className} title={this.tooltip}>
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
    return 'run';
  },
  'Run code'
);

const next_button = new Control_button(
  <Next_logo />,
  () => {
    return 'step';
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
    return 'restart';
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
