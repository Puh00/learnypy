import React from 'react';
import { ButtonGroup } from 'react-bootstrap';

import { ReactComponent as Next_logo } from 'src/assets/arrow-right.svg';
import { ReactComponent as Menu_logo } from 'src/assets/chevron-down.svg';
import { ReactComponent as Clear_breakpoints_logo } from 'src/assets/clear-breakpoints.svg';
import { ReactComponent as Play_logo } from 'src/assets/play.svg';
import { ReactComponent as Stop_logo } from 'src/assets/stop.svg';
import Button from 'src/components/Button';
import styles from 'src/features/code-box/ControlPanel.module.css';
import DropdownLocal from 'src/features/code-box/Dropdown';

const ControlPanel = ({
  code,
  runit,
  step,
  restart,
  clear_breakpoints,
  setCode,
  drop_down_menu_ref
}) => {
  return (
    <ButtonGroup className={`${styles.Btng}`}>
      <ButtonGroup className={`${styles.BtngLeft}`}>
        <Button
          onClick={() => {
            runit(code);
          }}
          className={styles.Container}
          tooltip="Run code (until next breakpoint)"
          logo={<Play_logo />}
        />
        <Button
          onClick={() => {
            step(code);
          }}
          className={styles.Container}
          tooltip="Run next line"
          logo={<Next_logo />}
        />
        <Button
          onClick={() => {
            restart(code);
          }}
          className={styles.Container}
          tooltip="Stop execution"
          logo={<Stop_logo />}
        />
        <Button
          onClick={() => {
            clear_breakpoints();
          }}
          className={styles.Container}
          tooltip="Clear all breakpoints"
          logo={<Clear_breakpoints_logo />}
        />
      </ButtonGroup>
      <ButtonGroup className={`${styles.BtngRight}`}>
        <DropdownLocal
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
