import React from 'react';
import { ReactComponent as Play_logo } from './Icons/play.svg';
import { ReactComponent as Next_logo } from './Icons/arrow-right.svg';
import { ReactComponent as Stop_logo } from './Icons/stop.svg';
import { ReactComponent as Menu_logo } from './Icons/vertical-menu-dots.svg';
import DropdownLocal from './Dropdown';

import { Button, ButtonGroup } from 'react-bootstrap';

const ControlPanel = ({ code, runit, step, restart, setCode, drop_down_menu_ref }) => {
  const create_button = (func, tooltip_text, logo) => (
    <Button variant="light" onClick={func} data-toggle="tooltip" title={tooltip_text}>
      {logo}
    </Button>
  );

  return (
    <ButtonGroup>
      {create_button(
        () => {
          runit(code);
        },
        'Run code (until next breakpoint)',
        <Play_logo />
      )}
      {create_button(
        () => {
          step(code);
        },
        'Run next line',
        <Next_logo />
      )}
      {create_button(
        () => {
          restart(code);
        },
        'Stop execution',
        <Stop_logo />
      )}
      <DropdownLocal
        logo={<Menu_logo />}
        setCode={setCode}
        restart={restart}
        data-toggle="tooltip"
        title={'Code Examples'}
        drop_down_menu_ref={drop_down_menu_ref}
      />
    </ButtonGroup>
  );
};

export default ControlPanel;
