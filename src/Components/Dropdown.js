import './Dropdown.css';

import React from 'react';
import { ButtonGroup, Dropdown } from 'react-bootstrap';

const code_examples = [
  {
    name: 'Aliasing',
    code: `a=[]
b=a
b.append(3)
c=[3]
c.append(4)
c.remove(4)

print(a)  
print(b)  
print(c)  

print(a is b)
print(a is c or b is c)`
  },
  {
    name: 'Nested functions',
    code:
      'def test():\n  print(2)\n  another_test()\n  print(4)\n\ndef another_test():' +
      '\n  print(3)\n\nprint(1)\ntest()\nprint(5)'
  },
  {
    name: 'Mutables vs immutables',
    code: `a=["bye"]
b=a
    
c=1
d=1
    
b[0]="hello"
d=2`
  },
  {
    name: 'Classes',
    code: `class Dog:
  def __init__(self, name, age, bark):
    self.name = name
    self.age = age
    self.bark = bark
    
  def say_hi(self):
    print(self.bark)
    
dog1 = Dog("Charlie", 3, "woof!")
dog2 = Dog("Lady", 5, "ruff!")
    
dog1.say_hi()
dog2.say_hi()`
  },
  {
    name: 'Linked list',
    code: `class Node:
  def __init__(self, data):
    self.data = data
    self.next = None
  
class LinkedList:
  def __init__(self):
    self.head = None
      
  def create_list(self):
    self.head = Node(1)
    self.head.next = Node(2)

  def traverse_list(self):
    node = self.head
    while node != None:
      print(node.data)
      node = node.next

mylist = LinkedList()
mylist.create_list()
mylist.traverse_list()`
  }
];

function DropdownLocal({ logo, setCode, restart, drop_down_menu_ref, button_border }) {
  return (
    <Dropdown style={button_border} as={ButtonGroup}>
      <Dropdown.Toggle
        data-toggle="tooltip"
        title="Code Examples"
        variant="light"
        id="dropdown-basic"
        ref={drop_down_menu_ref}>
        <p>Code examples {logo} </p>
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
