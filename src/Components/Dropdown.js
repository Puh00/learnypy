import React from 'react';

import { Dropdown, ButtonGroup } from 'react-bootstrap';

const code_examples = [
  { name: 'Example 1', code: 'a=[]\nb=a\nb.append(3)\nprint(b)' },
  {
    name: 'Example 2',
    code:
      'def test():\n\tprint(2)\n\tanother_test()\n\tprint(4)\n\ndef another_test():' +
      '\n\tprint(3)\n\nprint(1)\ntest()\nprint(5)'
  },
  { name: 'Example 3', code: 'a=3\nb=1\nc=b' }
];

function DropdownLocal({ logo, setCode, restart, drop_down_menu_ref, button_border }) {
  return (
    <Dropdown style={button_border} as={ButtonGroup} data-toggle="tooltip" title="Code examples">
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
