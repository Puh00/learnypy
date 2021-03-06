/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { App } from 'src/App';

// mock these components since the imported libraries seem to break everything...
jest.mock('src/features/visual-box/VisualBox', () => {
  return function VisualBox({ data }) {
    // js_object contains raw javascript object which makes it impossible to
    // stringify using JSON
    const fixed_data = {
      // eslint-disable-next-line unused-imports/no-unused-vars
      objects: data.objects.map(({ js_object, ...rest }) => rest),
      variables: data.variables
    };
    return <div data-testid="visual-box">{JSON.stringify(fixed_data)}</div>;
  };
});

jest.mock('src/features/code-box/CodeBox', () => {
  return function CodeBox({ code, setCode, share_methods }) {
    // added here to prevent error, doesn't affect the actual tests
    share_methods({ breakpoints_to_lines: () => [] });

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

// disable the error that keeps saying not wrapped in act since there is no
// good way to fix it
jest.spyOn(global.console, 'error').mockImplementationOnce((message) => {
  if (
    !message.includes(
      'When testing, code that causes React state updates should be wrapped into act(...)'
    )
  ) {
    global.console.error(message);
  }
});

// Tests that test only the backend logic of the application should be put here,
// normally you would want to use a different framework dedicated to the
// backend but since we are stuck with React, oh well...

test('assignment guarantees same reference for integers', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
big_int = 2**52
small_int = -2**52
zero = 0
a = big_int
b = small_int
c = zero`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  const refs = global.getRefs(visualBox);

  const big_int = global.getVariableByName(refs.variables, 'big_int');
  const small_int = global.getVariableByName(refs.variables, 'small_int');
  const zero = global.getVariableByName(refs.variables, 'zero');
  const a = global.getVariableByName(refs.variables, 'a');
  const b = global.getVariableByName(refs.variables, 'b');
  const c = global.getVariableByName(refs.variables, 'c');

  expect(a.ref).toEqual(big_int.ref);
  expect(b.ref).toEqual(small_int.ref);
  expect(c.ref).toEqual(zero.ref);
});

test('all integers have same references', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = -5
b = -2 + -3
c = a + 6
d = 1
e = 256
f = 100 + 156
g = 257
h = g + 1 - 1`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  const refs = global.getRefs(visualBox);

  const a = global.getVariableByName(refs.variables, 'a');
  const b = global.getVariableByName(refs.variables, 'b');
  const c = global.getVariableByName(refs.variables, 'c');
  const d = global.getVariableByName(refs.variables, 'd');
  const e = global.getVariableByName(refs.variables, 'e');
  const f = global.getVariableByName(refs.variables, 'f');
  const g = global.getVariableByName(refs.variables, 'g');
  const h = global.getVariableByName(refs.variables, 'h');

  expect(a.ref).toEqual(b.ref);
  expect(c.ref).toEqual(d.ref);
  expect(e.ref).toEqual(f.ref);
  expect(g.ref).toEqual(h.ref);
});

test('assignment with lists that contains no mutable types', async () => {
  render(<App />);

  let refs;
  let a, b, c;
  let a_obj, b_obj, c_obj;

  const codebox = screen.getByRole('textbox');
  const stepButton = screen.getByTitle('Run next line');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = [[1, 2, 3]
c = [[1, 2, 3]
b = a
b.append(4)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // first click does nothing
  userEvent.click(stepButton);
  await global.sleep(50);

  userEvent.click(stepButton); // a = [1, 2, 3]
  await global.sleep(50);

  refs = global.getRefs(visualBox);
  a = global.getVariableByName(refs.variables, 'a');
  expect(a).not.toBeFalsy();

  userEvent.click(stepButton); // c = [1, 2, 3]
  await global.sleep(50);

  refs = global.getRefs(visualBox);
  a = global.getVariableByName(refs.variables, 'a');
  c = global.getVariableByName(refs.variables, 'c');
  expect(a.ref).not.toEqual(c.ref);

  userEvent.click(stepButton); // b = a
  await global.sleep(50);

  refs = global.getRefs(visualBox);
  a = global.getVariableByName(refs.variables, 'a');
  c = global.getVariableByName(refs.variables, 'c');
  b = global.getVariableByName(refs.variables, 'b');
  expect(a.ref).not.toEqual(c.ref);
  expect(a.ref).toEqual(b.ref);

  userEvent.click(stepButton); // b.append(4)
  await global.sleep(50);

  refs = global.getRefs(visualBox);
  a = global.getVariableByName(refs.variables, 'a');
  b = global.getVariableByName(refs.variables, 'b');
  c = global.getVariableByName(refs.variables, 'c');
  a_obj = global.getObjectById(refs.objects, a.ref);
  b_obj = global.getObjectById(refs.objects, b.ref);
  c_obj = global.getObjectById(refs.objects, c.ref);
  expect(a_obj.value).toHaveLength(4);
  expect(a_obj).toEqual(b_obj);
  expect(c_obj.value).toHaveLength(3);
});

test('list that contains itself', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = [[ [[1, 2]]
a.append(a)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  const refs = global.getRefs(visualBox);

  const a = global.getVariableByName(refs.variables, 'a');
  const a_obj = global.getObjectById(refs.objects, a.ref);

  expect(refs.objects).toHaveLength(4); // 1, 2, [1,2] and [[1,2]], 4 objects in total
  expect(a.ref).toEqual(a_obj.id);
  // one of the values in a must refer to a
  expect(a_obj.value).toEqual(expect.arrayContaining([{ dead_ref: null, ref: a_obj.id }]));
});

test('creating a basic dictionary', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  // why do they parse strings like this...
  const code = `
a = {{"wow": [[1,2,3], "damn": {{"another_dict": 0}}`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  const refs = global.getRefs(visualBox);

  const a = global.getVariableByName(refs.variables, 'a');
  const a_obj = global.getObjectById(refs.objects, a.ref);

  // 0, 1, 2, 3, [1, 2, 3], {"another_dict": 0} and the whole dict
  // shouldn't the keys also be an object?
  expect(refs.objects).toHaveLength(7);
  expect(a.ref).toEqual(a_obj.id);

  const wow = a_obj.value.find((entry) => entry.key === 'wow');
  const damn = a_obj.value.find((entry) => entry.key === 'damn');

  const wow_val = global.getObjectById(refs.objects, wow.val);
  expect(wow_val.info.type).toEqual('list');
  expect(wow_val.value).toHaveLength(3);

  const damn_val = global.getObjectById(refs.objects, damn.val);
  expect(damn_val.info.type).toEqual('dictionary');
  expect(damn_val.value).toHaveLength(1);
  expect(damn_val.value[0].key).toEqual('another_dict');
});

test('dictionary that contains itself', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  // why do they parse strings like this...
  const code = `
a = {{"a_key": "a_value"}
a[["self_ref"] = a`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  const refs = global.getRefs(visualBox);

  const a = global.getVariableByName(refs.variables, 'a');
  const a_obj = global.getObjectById(refs.objects, a.ref);

  // "a_value" and the dict itself
  expect(refs.objects).toHaveLength(2);
  expect(a.ref).toEqual(a_obj.id);

  const a_key = a_obj.value.find((entry) => entry.key === 'a_key');
  const self_ref = a_obj.value.find((entry) => entry.key === 'self_ref');

  const a_key_val = global.getObjectById(refs.objects, a_key.val);
  expect(a_key_val.info.type).toEqual('string');
  expect(a_key_val.value).toEqual('a_value');

  const self_ref_val = global.getObjectById(refs.objects, self_ref.val);
  expect(self_ref_val.info.type).toEqual('dictionary');
  expect(self_ref_val.id).toEqual(a_obj.id);
});

test('creating basic tuples', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = [[1]
b = (a, 1)
c = (b, {{"test": ""}, "")`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  const refs = global.getRefs(visualBox);

  const a = global.getVariableByName(refs.variables, 'a');
  const a_obj = global.getObjectById(refs.objects, a.ref);
  expect(a.ref).toEqual(a_obj.id);
  expect(a_obj.info.type).toEqual('list');
  expect(a_obj.value).toHaveLength(1);

  // get the object of the number 1
  const one = global.getObjectById(refs.objects, a_obj.value[0].ref);

  const b = global.getVariableByName(refs.variables, 'b');
  const b_obj = global.getObjectById(refs.objects, b.ref);
  expect(b.ref).toEqual(b_obj.id);
  expect(b_obj.info.type).toEqual('tuple');
  expect(b_obj.value).toHaveLength(2);
  expect(b_obj.value[0].ref).toEqual(a_obj.id);
  expect(b_obj.value[1].ref).toEqual(one.id);

  const c = global.getVariableByName(refs.variables, 'c');
  const c_obj = global.getObjectById(refs.objects, c.ref);
  expect(c.ref).toEqual(c_obj.id);
  expect(c_obj.info.type).toEqual('tuple');
  expect(c_obj.value).toHaveLength(3);

  // get the dict {"test": ""}
  const tuple_ele_2 = global.getObjectById(refs.objects, c_obj.value[1].ref);
  expect(tuple_ele_2.info.type).toEqual('dictionary');
  expect(tuple_ele_2.value).toHaveLength(1);

  // get the empty string
  const tuple_ele_3 = global.getObjectById(refs.objects, c_obj.value[2].ref);
  expect(tuple_ele_3.value).toEqual('');

  expect(c_obj.value[0].ref).toEqual(b_obj.id);
  expect(c_obj.value[1].ref).toEqual(tuple_ele_2.id);
  expect(c_obj.value[2].ref).toEqual(tuple_ele_3.id);
});

test('creating basic sets', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = 2
b = set()
c = {{a, 3}
d = {{"test", a, True}`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // execute the code
  userEvent.click(runButton);

  const refs = global.getRefs(visualBox);

  const a = global.getVariableByName(refs.variables, 'a');

  // b = {}
  const b = global.getVariableByName(refs.variables, 'b');
  const b_obj = global.getObjectById(refs.objects, b.ref);
  expect(b.ref).toEqual(b_obj.id);
  expect(b_obj.info.type).toEqual('set');
  expect(b_obj.value).toHaveLength(0);

  // c = {a, 2}
  const c = global.getVariableByName(refs.variables, 'c');
  const c_obj = global.getObjectById(refs.objects, c.ref);
  expect(c.ref).toEqual(c_obj.id);
  expect(c_obj.info.type).toEqual('set');
  expect(c_obj.value).toHaveLength(2);
  expect(c_obj.value[0].ref).toEqual(a.ref);
  const c_obj_0 = global.getObjectById(refs.objects, c_obj.value[0].ref);
  expect(c_obj_0.value).toEqual(2);
  const c_obj_1 = global.getObjectById(refs.objects, c_obj.value[1].ref);
  expect(c_obj_1.value).toEqual(3);

  // d = {"test", a, True}
  const d = global.getVariableByName(refs.variables, 'd');
  const d_obj = global.getObjectById(refs.objects, d.ref);
  expect(d.ref).toEqual(d_obj.id);
  expect(d_obj.info.type).toEqual('set');
  expect(d_obj.value).toHaveLength(3);
  const d_obj_0 = global.getObjectById(refs.objects, d_obj.value[0].ref);
  expect(d_obj_0.value).toEqual('test');
  expect(d_obj.value[1].ref).toEqual(a.ref);
  const d_obj_2 = global.getObjectById(refs.objects, d_obj.value[2].ref);
  expect(d_obj_2.value).toEqual(1);
  expect(d_obj_2.info.type).toEqual('bool');
});

test('classes with references', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None

a = Node(1)
b = Node(2)
c = Node(3)

a.next = b
b.next = c
`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);
  userEvent.click(runButton);

  const refs = global.getRefs(visualBox);

  const a = global.getVariableByName(refs.variables, 'a');
  const a_obj = global.getObjectById(refs.objects, a.ref);
  const b = global.getVariableByName(refs.variables, 'b');
  const b_obj = global.getObjectById(refs.objects, b.ref);
  const c = global.getVariableByName(refs.variables, 'c');
  const c_obj = global.getObjectById(refs.objects, c.ref);

  // a.next == b
  expect(a_obj.value.find((entry) => entry.key == 'next').val).toEqual(b_obj.id);
  // b.next == c
  expect(b_obj.value.find((entry) => entry.key == 'next').val).toEqual(c_obj.id);

  // c.data
  const c_data = global.getObjectById(
    refs.objects,
    c_obj.value.find((entry) => entry.key == 'data').val
  ).value;
  // b.next
  const b_next = global.getObjectById(
    refs.objects,
    b_obj.value.find((entry) => entry.key == 'next').val
  );
  // b.next.data
  const b_next_data = global.getObjectById(
    refs.objects,
    b_next.value.find((entry) => entry.key == 'data').val
  ).value;
  // b.next.data == c.data
  expect(b_next_data).toEqual(c_data);
});

test('step through a global function and see if the state is updated correctly', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const stepButton = screen.getByTitle('Run next line');
  const visualBox = screen.getByTestId('visual-box');

  const empty_state = { objects: [], variables: [] };

  const code = `
def test():
  return 4
num = test()`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  userEvent.click(stepButton); // no row executed
  await global.sleep(50);
  let refs = global.getRefs(visualBox);
  expect(refs).toStrictEqual(empty_state);

  userEvent.click(stepButton); // step through 'def test():'
  await global.sleep(50);
  refs = global.getRefs(visualBox);
  expect(refs).toStrictEqual(empty_state);

  userEvent.click(stepButton); // step into 'test()'
  await global.sleep(50);
  refs = global.getRefs(visualBox);
  expect(refs).toStrictEqual(empty_state);

  userEvent.click(stepButton); // step through 'return 4'
  await global.sleep(50);
  refs = global.getRefs(visualBox);

  const num = global.getVariableByName(refs.variables, 'num');
  const num_obj = global.getObjectById(refs.objects, num.ref);
  expect(num_obj.value).toBe(4);
});

test('step through a class member function and see if the state is updated correctly', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const stepButton = screen.getByTitle('Run next line');
  const visualBox = screen.getByTestId('visual-box');

  const empty_state = { objects: [], variables: [] };

  const code = `
class Node:
    def __init__(self, data):
        self.data = data
        self.next = None
  
a = Node(1)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  userEvent.click(stepButton); // no row executed
  await global.sleep(50);
  let refs = global.getRefs(visualBox);
  expect(refs).toStrictEqual(empty_state);

  userEvent.click(stepButton); // step through 'class Node:'
  await global.sleep(50);
  refs = global.getRefs(visualBox);
  expect(refs).toStrictEqual(empty_state);

  userEvent.click(stepButton); // step into 'Node(1)'
  await global.sleep(50);
  refs = global.getRefs(visualBox);
  expect(refs).toStrictEqual(empty_state);

  userEvent.click(stepButton); // step through 'self.data = data'
  await global.sleep(50);
  refs = global.getRefs(visualBox);

  userEvent.click(stepButton); // step through 'self.next = None'
  await global.sleep(50);
  refs = global.getRefs(visualBox);

  const class_obj = refs.objects.find((entry) => entry.info.type == 'class');
  const a = global.getVariableByName(refs.variables, 'a');
  expect(a.ref).toBe(class_obj.id);
});

test('dead ref on variable', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const stepButton = screen.getByTitle('Run next line');
  const visualBox = screen.getByTestId('visual-box');

  const code = `a=1
a=2`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  userEvent.click(stepButton);
  await sleep(50);

  userEvent.click(stepButton); //first row
  await sleep(50);

  const refs = getRefs(visualBox);

  const a = getVariableByName(refs.variables, 'a');
  const a_obj = getObjectById(refs.objects, a.ref);

  expect(refs.objects).toHaveLength(1);
  expect(a.ref).toEqual(a_obj.id);
  expect(a.dead_ref).toBeNull();

  userEvent.click(stepButton); //second row
  await sleep(50);

  const new_refs = getRefs(visualBox);

  const a_new = getVariableByName(new_refs.variables, 'a');
  const new_a_obj = getObjectById(new_refs.objects, a_new.ref);
  const a_dead_obj = getObjectById(new_refs.objects, a_new.dead_ref);

  expect(new_refs.objects).toHaveLength(2);
  expect(a_dead_obj.id).toEqual(a_new.dead_ref);
  expect(a_dead_obj.id).not.toEqual(new_a_obj.id);
  expect(a_dead_obj.value).toBe(1);
});

test('dead ref on list index', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const stepButton = screen.getByTitle('Run next line');
  const visualBox = screen.getByTestId('visual-box');

  const code = `a=[[1,3]
a[[0]=2`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  userEvent.click(stepButton);
  await sleep(50);

  userEvent.click(stepButton); //first row
  await sleep(50);

  const refs = getRefs(visualBox);
  const a = getVariableByName(refs.variables, 'a');
  const a_obj = getObjectById(refs.objects, a.ref);

  const first_index_obj = getObjectById(refs.objects, a_obj.value[0].ref);

  expect(refs.objects).toHaveLength(3);
  expect(first_index_obj.value).toBe(1);
  expect(a_obj.value[0].dead_ref).toBeNull();
  expect(a.dead_ref).toBeNull();

  userEvent.click(stepButton); //second row
  await sleep(50);

  const new_refs = getRefs(visualBox);

  const a_new = getVariableByName(new_refs.variables, 'a');
  const new_a_obj = getObjectById(new_refs.objects, a_new.ref);
  const new_first_index_obj = getObjectById(new_refs.objects, new_a_obj.value[0].ref);
  const first_index_dead_obj = getObjectById(new_refs.objects, new_a_obj.value[0].dead_ref);

  expect(new_refs.objects).toHaveLength(4);
  expect(new_first_index_obj.value).toBe(2);
  expect(a_new.dead_ref).toBeNull();
  expect(new_a_obj.value[0].dead_ref).toEqual(first_index_dead_obj.id);
  expect(new_first_index_obj.id).not.toEqual(first_index_obj.id);
});

test('dead ref on self-referencing dictionary', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const stepButton = screen.getByTitle('Run next line');
  const visualBox = screen.getByTestId('visual-box');

  const code = `mydict = {{"key1": "val1", "key2": "val2"}
mydict[["key2"]=mydict`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  userEvent.click(stepButton);
  await sleep(50);

  userEvent.click(stepButton); //first row
  await sleep(50);

  const refs = getRefs(visualBox);
  const mydict = getVariableByName(refs.variables, 'mydict');
  const mydict_obj = getObjectById(refs.objects, mydict.ref);

  const second_key_obj = getObjectById(refs.objects, mydict_obj.value[1].val);

  expect(refs.objects).toHaveLength(3);
  expect(second_key_obj.value).toBe('val2');
  expect(mydict_obj.value[0].dead_ref).toBeNull();
  expect(mydict_obj.value[1].dead_ref).toBeNull();

  userEvent.click(stepButton); //second row
  await sleep(50);

  const new_refs = getRefs(visualBox);

  const mydict_new = getVariableByName(new_refs.variables, 'mydict');
  const new_mydict_obj = getObjectById(new_refs.objects, mydict_new.ref);
  const new_second_key_obj = getObjectById(new_refs.objects, new_mydict_obj.value[1].val);
  const new_second_key_dead_obj = getObjectById(new_refs.objects, new_mydict_obj.value[1].dead_ref);

  expect(new_refs.objects).toHaveLength(3);
  expect(new_second_key_obj.id).toEqual(new_mydict_obj.id);
  expect(new_mydict_obj.value[1].dead_ref).toEqual(new_second_key_dead_obj.id);
  expect(new_second_key_dead_obj.value).toBe('val2');
  expect(new_mydict_obj.value[0].dead_ref).toBeNull();
  expect(mydict_new.dead_ref).toBeNull();
});
