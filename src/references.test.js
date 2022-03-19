/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import { getObjectByValue, getVariableByName } from './util/testUtils';

// mock these components since the imported libraries seem to break everything...
jest.mock('./Components/VisualBox', () => {
  return function VisualBox({ data }) {
    return <div data-testid="visual-box">{JSON.stringify(data)}</div>;
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

test('assignment guarantees same reference for integers', async () => {
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

  const refs = JSON.parse(visualBox.textContent);

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

test('small integers have same references', async () => {
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

  const refs = JSON.parse(visualBox.textContent);

  const a = getVariableByName(refs.variables, 'a');
  const b = getVariableByName(refs.variables, 'b');
  const c = getVariableByName(refs.variables, 'c');
  const d = getVariableByName(refs.variables, 'd');
  const e = getVariableByName(refs.variables, 'e');
  const f = getVariableByName(refs.variables, 'f');
  const g = getVariableByName(refs.variables, 'g');
  const h = getVariableByName(refs.variables, 'h');

  const minus_five = getObjectByValue(refs.objects, -5);
  const one = getObjectByValue(refs.objects, 1);
  const _256 = getObjectByValue(refs.objects, 256);
  const _257 = getObjectByValue(refs.objects, 257);

  expect(minus_five).toHaveLength(1);
  expect(one).toHaveLength(1);
  expect(_256).toHaveLength(1);
  expect(_257).toHaveLength(2);

  expect(a.ref).toEqual(b.ref);
  expect(c.ref).toEqual(d.ref);
  expect(e.ref).toEqual(f.ref);
  expect(g.ref).not.toEqual(h.ref);
});
