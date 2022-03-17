/* eslint-disable react/display-name */
// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
import React from 'react';

import { Dropdown } from 'react-bootstrap';
import 'react-dropdown/style.css';

const example1 = 'a=[]\nb=a\nb.append(3)\nprint(b)';
const example2 = 'a=2\nb=1\nc=b';
const example3 = 'a=3\nb=1\nc=b';

function DropdownLocal(props) {
  return (
    <div className={'Control-button'}>
      <Dropdown autoClose="outside">
        <Dropdown.Toggle variant="success" id="Dropdown" className={'Dropdown-button'}>
          {props.logo}
        </Dropdown.Toggle>
        <Dropdown.Menu id={'dropdownMenu'}>
          <Dropdown.Item as="button" id={'Dropdown-item'} href="#">
            <button
              id={'Dropdown-button'}
              onClick={() => {
                props.setCode(example1);
                props.restart(example1);
              }}>
              Example 1
            </button>
          </Dropdown.Item>
          <Dropdown.Item as="button" id={'Dropdown-item'} href="#">
            <button
              id={'Dropdown-button'}
              onClick={() => {
                props.setCode(example2);
                props.restart(example2);
              }}>
              Example 2
            </button>
          </Dropdown.Item>
          <Dropdown.Item as="button" id={'Dropdown-item'} href="#">
            <button
              id={'Dropdown-button'}
              onClick={() => {
                props.setCode(example3);
                props.restart(example3);
              }}>
              Example 3
            </button>
          </Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default DropdownLocal;
