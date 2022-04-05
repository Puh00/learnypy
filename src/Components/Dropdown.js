import React from 'react';

import { Dropdown, ButtonGroup } from 'react-bootstrap';

import './Dropdown.css';

const code_examples = [
  { name: 'Example 1', code: 'a=[]\nb=a\nb.append(3)\nprint(b)' },
  {
    name: 'Example 2',
    code:
      'def test():\n  print(2)\n  another_test()\n  print(4)\n\ndef another_test():' +
      '\n  print(3)\n\nprint(1)\ntest()\nprint(5)'
  },
  {
    name: 'Example 3',
    code: `class Node:
  def __init__(self, data):
    self.data = data
    self.next = None
  
class LinkedList:
  def __init__(self):
    self.head = None
      
  def create_list(self):
    self.head = Node(1)
    second = Node(2)
    third = Node(3)
    self.head.next = second
    second.next = third
    
  def traverse_list(self):
    node = self.head
    while node != None:
      print(node.data)
      node = node.next

llist = LinkedList()
llist.create_list()
llist.traverse_list()`
  }
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
