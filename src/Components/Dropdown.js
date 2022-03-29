import React from 'react';

import { Dropdown, ButtonGroup } from 'react-bootstrap';

import './Dropdown.css';

const code_examples = [
  { name: 'Example 1', code: 'a=[]\nb=a\nb.append(3)\nprint(b)' },
  { name: 'Example 2', code: 'a=2\nb=1\nc=b' },
  { name: 'Example 3', code: 'a=3\nb=1\nc=b' }
];

function DropdownLocal({ logo, setCode, restart, drop_down_menu_ref, button_border }) {
  return (
    <Dropdown style={button_border} as={ButtonGroup}>
      <Dropdown.Toggle variant="light" id="dropdown-basic" ref={drop_down_menu_ref}>
        {logo}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {code_examples.map((item, index) => {
          return (
            <Dropdown.Item
              as="button"
              id={'Dropdown-item'}
              key={index}
              onClick={() => {
                setCode(item.code);
                restart(item.code);
              }}>
              {item.name}
            </Dropdown.Item>
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default DropdownLocal;
