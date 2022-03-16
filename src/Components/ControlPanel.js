import React from 'react';
import { ReactComponent as Play_logo } from './Icons/play.svg';
import { ReactComponent as Next_logo } from './Icons/arrow-right.svg';
import { ReactComponent as Pause_logo } from './Icons/pause.svg';
import { ReactComponent as Repeat_logo } from './Icons/repeat.svg';
import { ReactComponent as Menu_logo } from './Icons/vertical-menu-dots.svg';
import DropdownLocal from './Dropdown';

const ControlPanel = ({ code, runit, step, restart }) => {
  const play_button = () => {
    return (
      <button
        onClick={() => {
          runit(code);
        }}
        className={'Control-button'}
        data-toggle="tooltip"
        title={'Run code'}>
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

  const pause_button = () => {
    return (
      <button
        onClick={() => {
          console.log('Pause not implemented');
        }}
        className={'Control-button'}
        data-toggle="tooltip"
        title={'Pause running code'}>
        {<Pause_logo />}
      </button>
    );
  };

  const repeat_button = () => {
    return (
      <button
        onClick={() => {
          restart(code);
        }}
        className={'Control-button'}
        data-toggle="tooltip"
        title={'Restart'}>
        {<Repeat_logo />}
      </button>
    );
  };

  const menu_button = () => {
    return <DropdownLocal logo={<Menu_logo />} />;
  };

  return (
    <div aria-label="test" className="Control-panel">
      {play_button()}
      {next_button()}
      {pause_button()}
      {repeat_button()}
      {menu_button()}
    </div>
  );
};

export default ControlPanel;
