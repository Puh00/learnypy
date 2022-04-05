/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from '../App';
import { getRefs } from '../util/testUtils';
import set_text from '../util/textGenerator';

// mock these components since the imported libraries seem to break everything...
jest.mock('../Components/VisualBox', () => {
  return function VisualBox({ data }) {
    // js_object contains raw javascript object which makes it impossible to
    // stringify using JSON
    const fixed_data = {
      // eslint-disable-next-line no-unused-vars
      objects: data.objects.map(({ js_object, ...rest }) => rest),
      variables: data.variables
    };
    return <div data-testid="visual-box">{JSON.stringify(fixed_data)}</div>;
  };
});

jest.mock('../Components/CodeBox', () => {
  return function CodeBox({ code, setCode }) {
    return (
      <form className="Code-box">
        <textarea
          role="textbox"
          value={code}
          onChange={(event) => {
            setCode(event.target.value);
          }}
        />
      </form>
    );
  };
});

test('simple assignment with integers', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = 1
b = 1
c = b`;

  const expected =
    'Variable "a" points to the integer value 1. Variable "b" points to the integer value 1. Variable "c" points to the integer value 1. ';

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  // get the objects and variables, and generate text from these
  const refs = getRefs(visualBox);
  const text = set_text(refs.objects, refs.variables);

  expect(text).toEqual(expected);
});

test('simple assignment with lists', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = [[1,2]
b = a
b.append(3)`;

  const expected =
    'Variable "a" points to a list of size 3. Index nr 0 of "a" points to the integer value 1. Index nr 1 of "a" points to the integer value 2. Index nr 2 of "a" points to the integer value 3. Variable "b" points to the same list of size 3 as variable a. ';

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  // get the objects and variables, and generate text from these
  const refs = getRefs(visualBox);
  const text = set_text(refs.objects, refs.variables);

  expect(text).toEqual(expected);
});

test('simple assignment with dictionaries', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = {{"key": "a value"}
b = a
b[[2] = "a new value"`;

  const expected =
    'Variable "a" points to a dictionary of size 2. Key key of "a" points to the string value a value. Key 2 of "a" points to the string value a new value. Variable "b" points to the same dictionary of size 2 as variable a. ';

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  // get the objects and variables, and generate text from these
  const refs = getRefs(visualBox);
  const text = set_text(refs.objects, refs.variables);

  expect(text).toEqual(expected);
});

test('deeply nested lists', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = [[ [[ [[ [[ [[ ]]]]]`; // the same as `a = [[[[[]]]]]`

  const expected =
    'Variable "a" points to a list of size 1. Index nr 0 of "a" points to a list of size 1. Index nr 0 of this list points to a list of size 1. Index nr 0 of this list points to a list of size 1. Index nr 0 of this list points to a list of size 0. ';

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  // get the objects and variables, and generate text from these
  const refs = getRefs(visualBox);
  const text = set_text(refs.objects, refs.variables);

  expect(text).toEqual(expected);
});

test('self referencing dictionaries', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = {{}
a[["a"] = a
b = a
b[["b"] = b`;

  const expected =
    'Variable "a" points to a dictionary of size 2. Key a of "a" points to the same dictionary of size 2 as variable a. Key b of "a" points to the same dictionary of size 2 as variable a & a\'s key a. Variable "b" points to the same dictionary of size 2 as variable a & a\'s key a & a\'s key b. ';

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  // get the objects and variables, and generate text from these
  const refs = getRefs(visualBox);
  const text = set_text(refs.objects, refs.variables);

  expect(text).toEqual(expected);
});

test('linked list', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
class Node:
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

llist = LinkedList()
llist.create_list()`;

  const expected =
    'Variable "llist" points to a class named "LinkedList" with 1 attribute. Attribute head of "llist" points to a class named "Node" with 2 attributes. Attribute data of this class points to the integer value 1. Attribute next of this class points to a class named "Node" with 2 attributes. Attribute data of this class points to the integer value 2. Attribute next of this class points to a class named "Node" with 2 attributes. Attribute data of this class points to the integer value 3. Attribute next of this class points to the NoneType value None. ';

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  // get the objects and variables, and generate text from these
  const refs = getRefs(visualBox);
  const text = set_text(refs.objects, refs.variables);

  expect(text).toEqual(expected);
});
