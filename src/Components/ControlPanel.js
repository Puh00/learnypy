import React from 'react';
import { ReactComponent as Play_logo } from './Icons/play.svg';
import { ReactComponent as Next_logo } from './Icons/arrow-right.svg';
import { ReactComponent as Stop_logo } from './Icons/stop.svg';
import { ReactComponent as Menu_logo } from './Icons/vertical-menu-dots.svg';

const ControlPanel = ({ code, runit, step, restart }) => {
  const play_button = () => {
    return (
      <button
        onClick={() => {
          runit(code);
        }}
        className={'Control-button'}
        data-toggle="tooltip"
        title={'Run code (until next breakpoint)'}>
        {<Play_logo />}
      </button>
    );
  };

  const next_button = () => {
    return (
      <button
        onClick={() => {
          step(code);
        }}
        className={'Control-button'}
        data-toggle="tooltip"
        title={'Run next line'}>
        {<Next_logo />}
      </button>
    );
  };

  const stop_button = () => {
    return (
      <button
        onClick={() => {
          restart(code);
        }}
        className={'Control-button'}
        data-toggle="tooltip"
        title={'Stop execution'}>
        {<Stop_logo />}
      </button>
    );
  };

  const menu_button = () => {
    return (
      <button
        onClick={() => {
          console.log('Drop-down menu not implemented');
        }}
        className={'Control-button'}
        data-toggle="tooltip"
        title={'Code Examples'}>
        {<Menu_logo />}
      </button>
    );
  };
  return (
    <div aria-label="test" className="Control-panel">
      {play_button()}
      {next_button()}
      {stop_button()}
      {menu_button()}
    </div>
  );
};

export default ControlPanel;
