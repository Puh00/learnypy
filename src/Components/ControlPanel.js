import React from 'react';
import { ReactComponent as Play_logo } from './Icons/play.svg';
import { ReactComponent as Next_logo } from './Icons/arrow-right.svg';
import { ReactComponent as Stop_logo } from './Icons/stop.svg';
import { ReactComponent as Clear_breakpoints_logo } from './Icons/clear-breakpoints.svg';
import { ReactComponent as Menu_logo } from './Icons/vertical-menu-dots.svg';
import DropdownLocal from './Dropdown';

import { Button, ButtonGroup } from 'react-bootstrap';

const button_border = {
  border: '1px solid'
};

const ControlPanel = ({
  code,
  runit,
  step,
  restart,
  clear_breakpoints,
  setCode,
  drop_down_menu_ref
}) => {
  const create_button = (func, tooltip_text, logo) => (
    <Button
      style={button_border}
      variant="light"
      onClick={func}
      data-toggle="tooltip"
      title={tooltip_text}
      aria-label={tooltip_text}>
      {logo}
    </Button>
  );

  return (
    <ButtonGroup style={{ border: '1px solid', borderRadius: '5px' }}>
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
      {create_button(
        () => {
          clear_breakpoints();
        },
        'Clear all breakpoints',
        <Clear_breakpoints_logo />
      )}
      <DropdownLocal
        logo={<Menu_logo />}
        setCode={setCode}
        restart={(code) => {
          restart(code);
          clear_breakpoints();
        }}
        data-toggle="tooltip"
        title="Code Examples"
        drop_down_menu_ref={drop_down_menu_ref}
        button_border={button_border}
      />
    </ButtonGroup>
  );
};

export default ControlPanel;
