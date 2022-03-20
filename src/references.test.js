/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import sleep from './util/sleep';
import { getObjectById, getVariableByName, getRefs } from './util/testUtils';

// mock these components since the imported libraries seem to break everything...
jest.mock('./Components/VisualBox', () => {
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

jest.mock('./Components/CodeBox', () => {
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

  const refs = getRefs(visualBox);

  const big_int = getVariableByName(refs.variables, 'big_int');
  const small_int = getVariableByName(refs.variables, 'small_int');
  const zero = getVariableByName(refs.variables, 'zero');
  const a = getVariableByName(refs.variables, 'a');
  const b = getVariableByName(refs.variables, 'b');
  const c = getVariableByName(refs.variables, 'c');

  expect(a.ref).toEqual(big_int.ref);
  expect(b.ref).toEqual(small_int.ref);
  expect(c.ref).toEqual(zero.ref);
});

test('small integers have same references', () => {
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

  const refs = getRefs(visualBox);

  const a = getVariableByName(refs.variables, 'a');
  const b = getVariableByName(refs.variables, 'b');
  const c = getVariableByName(refs.variables, 'c');
  const d = getVariableByName(refs.variables, 'd');
  const e = getVariableByName(refs.variables, 'e');
  const f = getVariableByName(refs.variables, 'f');
  const g = getVariableByName(refs.variables, 'g');
  const h = getVariableByName(refs.variables, 'h');

  expect(a.ref).toEqual(b.ref);
  expect(c.ref).toEqual(d.ref);
  expect(e.ref).toEqual(f.ref);
  expect(g.ref).not.toEqual(h.ref);
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
  await sleep(50);

  userEvent.click(stepButton); // a = [1, 2, 3]
  await sleep(50);

  refs = getRefs(visualBox);
  a = getVariableByName(refs.variables, 'a');
  expect(a).not.toBeFalsy();

  userEvent.click(stepButton); // c = [1, 2, 3]
  await sleep(50);

  refs = getRefs(visualBox);
  a = getVariableByName(refs.variables, 'a');
  c = getVariableByName(refs.variables, 'c');
  expect(a.ref).not.toEqual(c.ref);

  userEvent.click(stepButton); // b = a
  await sleep(50);

  refs = getRefs(visualBox);
  a = getVariableByName(refs.variables, 'a');
  c = getVariableByName(refs.variables, 'c');
  b = getVariableByName(refs.variables, 'b');
  expect(a.ref).not.toEqual(c.ref);
  expect(a.ref).toEqual(b.ref);

  userEvent.click(stepButton); // b.append(4)
  await sleep(50);

  refs = getRefs(visualBox);
  a = getVariableByName(refs.variables, 'a');
  b = getVariableByName(refs.variables, 'b');
  c = getVariableByName(refs.variables, 'c');
  a_obj = getObjectById(refs.objects, a.ref);
  b_obj = getObjectById(refs.objects, b.ref);
  c_obj = getObjectById(refs.objects, c.ref);
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

  const refs = getRefs(visualBox);

  const a = getVariableByName(refs.variables, 'a');
  const a_obj = getObjectById(refs.objects, a.ref);

  expect(refs.objects).toHaveLength(4); // 1, 2, [1,2] and [[1,2]], 4 objects in total
  expect(a.ref).toEqual(a_obj.id);
  // one of the values in a must refer to a
  expect(a_obj.value).toEqual(expect.arrayContaining([{ ref: a_obj.id }]));
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

  const refs = getRefs(visualBox);

  const a = getVariableByName(refs.variables, 'a');
  const a_obj = getObjectById(refs.objects, a.ref);

  // 0, 1, 2, 3, [1, 2, 3], {"another_dict": 0} and the whole dict
  // shouldn't the keys also be an object?
  expect(refs.objects).toHaveLength(7);
  expect(a.ref).toEqual(a_obj.id);

  const wow = a_obj.value.find((entry) => entry.key === 'wow');
  const damn = a_obj.value.find((entry) => entry.key === 'damn');

  const wow_val = getObjectById(refs.objects, wow.val);
  expect(wow_val.type).toEqual('list');
  expect(wow_val.value).toHaveLength(3);

  const damn_val = getObjectById(refs.objects, damn.val);
  expect(damn_val.type).toEqual('dict');
  expect(damn_val.value).toHaveLength(1);
  expect(damn_val.value[0].key).toEqual('another_dict');
});

test('dictionary that conatins itself', () => {
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

  const refs = getRefs(visualBox);

  const a = getVariableByName(refs.variables, 'a');
  const a_obj = getObjectById(refs.objects, a.ref);

  // "a_value" and the dict itself
  expect(refs.objects).toHaveLength(2);
  expect(a.ref).toEqual(a_obj.id);

  const a_key = a_obj.value.find((entry) => entry.key === 'a_key');
  const self_ref = a_obj.value.find((entry) => entry.key === 'self_ref');

  const a_key_val = getObjectById(refs.objects, a_key.val);
  expect(a_key_val.type).toEqual('str');
  expect(a_key_val.value).toEqual('a_value');

  const self_ref_val = getObjectById(refs.objects, self_ref.val);
  expect(self_ref_val.type).toEqual('dict');
  expect(self_ref_val.id).toEqual(a_obj.id);
});
