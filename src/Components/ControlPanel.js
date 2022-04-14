import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';

import styles from './ControlPanel.module.css';
import DropdownLocal from './Dropdown';
import { ReactComponent as Next_logo } from './Icons/arrow-right.svg';
import { ReactComponent as Clear_breakpoints_logo } from './Icons/clear-breakpoints.svg';
import { ReactComponent as Play_logo } from './Icons/play.svg';
import { ReactComponent as Stop_logo } from './Icons/stop.svg';
import { ReactComponent as Menu_logo } from './Icons/vertical-menu-dots.svg';

const ControlPanel = ({
  code,
  runit,
  step,
  restart,
  clear_breakpoints,
  toggle_theme,
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
    <ButtonGroup className={`${styles.Btng}`}>
      <ButtonGroup className={`${styles.BtngLeft}`}>
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
        {create_button(
          () => {
            toggle_theme();
          },
          'Toggle light/dark mode',
          <Clear_breakpoints_logo />
        )}
      </ButtonGroup>
      <ButtonGroup className={`${styles.BtngRight}`}>
        <DropdownLocal
          className={`${styles.Container}`}
          logo={<Menu_logo />}
          setCode={setCode}
          restart={(code) => {
            restart(code);
            clear_breakpoints();
          }}
          drop_down_menu_ref={drop_down_menu_ref}
          button_border={{ borderLeft: '2px solid' }}
        />
      </ButtonGroup>
    </ButtonGroup>
  );
};

export default ControlPanel;
