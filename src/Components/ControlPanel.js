import React, { Component } from "react";
import { ReactComponent as Play_logo } from "./Icons/play.svg";
import { ReactComponent as Next_logo } from "./Icons/arrow-right.svg";
import { ReactComponent as Pause_logo } from "./Icons/pause.svg";
import { ReactComponent as Repeat_logo } from "./Icons/repeat.svg";
import { ReactComponent as Menu_logo } from "./Icons/repeat.svg"; /*Find correct logo*/

function Control_panel(props) {
  return (
    <div className="Control-panel">
      <Control_button type={play_button} />
      <Control_button type={next_button} />
      <Control_button type={pause_button} />
      <Control_button type={repeat_button} />
      <Control_button type={menu_button} />
    </div>
  );
}

function Control_button(props) {
  return (
    <button onClick={props.type.on_click} className="Control-button">
      {props.type.icon}
    </button>
  );
}

const play_button = {
  icon: <Play_logo />,
  on_click: () => {
    /* Run all code */
  },
};

const next_button = {
  icon: <Next_logo />,
  on_click: () => {
    /*Step one line in code*/
  },
};

const pause_button = {
  icon: <Pause_logo />,
  on_click: () => {
    /*pause running code*/
  },
};

const repeat_button = {
  icon: <Repeat_logo />,
  on_click: () => {
    /* Restart code */
  },
};

const menu_button = {
  icon: <Menu_logo />,
  on_click: () => {
    /*Drop down menu*/
  },
};

export default Control_panel;
