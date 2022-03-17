import React from 'react';
import { ReactComponent as Play_logo } from './Icons/play.svg';
import { ReactComponent as Next_logo } from './Icons/arrow-right.svg';
import { ReactComponent as Stop_logo } from './Icons/stop.svg';
import { ReactComponent as Menu_logo } from './Icons/vertical-menu-dots.svg';
import DropdownLocal from './Dropdown';

const ControlPanel = ({ code, runit, step, restart, setCode }) => {
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
      <DropdownLocal
        className={'Control-button'}
        logo={<Menu_logo />}
        setCode={setCode}
        restart={restart}
        data-toggle="tooltip"
        title={'Code Examples'
      />

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
