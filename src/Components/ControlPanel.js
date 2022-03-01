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
    return (
      <button
        onClick={this.on_click} //The onClick functions needs to call handleSubmit() in CodeBox. But how?
        className={this.className}
        title={this.tooltip}
        aria-label={this.tooltip}>
        {this.icon}
      </button>
    );
  };
}

/*  CREATING BUTTONS */
const play_button = new Control_button(
  <Play_logo />,
  () => {
    /* Run all code */
    console.log('clicked play-button');
    return 'run';
  },
  'Run code'
);

const next_button = new Control_button(
  <Next_logo />,
  () => {
    console.log('clicked step-button');
    return 'step';
  },
  'Run next line'
);

const pause_button = new Control_button(
  <Pause_logo />,
  () => {
    /*pause running code*/
    console.log('clicked pause-button');
    return 'pause';
  },
  'Pause running code'
);

const repeat_button = new Control_button(
  <Repeat_logo />,
  () => {
    console.log('clicked repeat-button');
    return 'restart';
  },
  'Restart'
);

const menu_button = new Control_button(
  <Menu_logo />,
  () => {
    /*Drop down menu*/
    console.log('clicked menu-button');
    return 'dropdown';
  },
  'Menu'
);

/* CREATING CONTROL PANEL */
function Control_panel() {
  return (
    <div aria-label="test" className="Control-panel">
      <play_button.render />
      <next_button.render />
      <pause_button.render />
      <repeat_button.render />
      <menu_button.render />
    </div>
  );
}

export default Control_panel;
