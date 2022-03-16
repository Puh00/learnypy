// The forwardRef is important!!
// Dropdown needs access to the DOM node in order to position the Menu
import React from 'react';
import { Dropdown } from 'react-bootstrap';
import 'react-dropdown/style.css';

class DropdownLocal extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div className={'Control-button'}>
        <Dropdown autoClose="outside" className={'Dropdown'}>
          <Dropdown.Toggle
            variant="success"
            id="dropdown-autoclose-outside"
            className={'Dropdown-button'}>
            {this.props.logo}
          </Dropdown.Toggle>
          <Dropdown.Menu>
            <Dropdown.Item className={'Dropdown-item'} href="#">
              Home Page
            </Dropdown.Item>
            <Dropdown.Item className={'Dropdown-item'} href="#">
              Settings
            </Dropdown.Item>
            <Dropdown.Item className={'Dropdown-item'} href="#">
              Ld
            </Dropdown.Item>
            <Dropdown.Item className={'Dropdown-item'} href="#">
              Logout
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </div>
    );
  }
}

export default DropdownLocal;
