import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import DropdownLocal from './Dropdown';
import { ReactComponent as Next_logo } from './Icons/arrow-right.svg';
import { ReactComponent as Clear_breakpoints_logo } from './Icons/clear-breakpoints.svg';
import { ReactComponent as Play_logo } from './Icons/play.svg';
import { ReactComponent as Stop_logo } from './Icons/stop.svg';
import { ReactComponent as Menu_logo } from './Icons/vertical-menu-dots.svg';

import styles from './ControlPanel.module.css';

const btng_style = {
  border: '2px solid',
  borderRadius: '4px',
  borderColor: 'var(--dark)',
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  backgroundColor: 'var(--components)',
  boxShadow: 'var(--shadow)'
};

const btng_left = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  flexBasis: 'contents'
};

const btng_right = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  flexBasis: '100%'
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
      className={`${styles.Container}`}
      variant="light"
      onClick={func}
      data-toggle="tooltip"
      title={tooltip_text}
      aria-label={tooltip_text}>
      {logo}
    </Button>
  );

  return (
    <ButtonGroup style={btng_style}>
      <ButtonGroup style={btng_left}>
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
      </ButtonGroup>
      <ButtonGroup style={btng_right}>
        <DropdownLocal
          logo={<Menu_logo />}
          setCode={setCode}
          restart={restart}
          data-toggle="tooltip"
          title="Code Examples"
          drop_down_menu_ref={drop_down_menu_ref}
          button_border={{ borderLeft: '2px solid' }}
        />
      </ButtonGroup>
    </ButtonGroup>
  );
};

export default ControlPanel;
