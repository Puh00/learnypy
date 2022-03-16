/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';
import sleep from './util/sleep';

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

test('basic reference 1', async () => {
  render(<App />);

  let refs;

  const codebox = screen.getByRole('textbox');
  const stepButton = screen.getByTitle('Run next line');
  const visualBox = screen.getByTestId('visual-box');

  const code = `
a = 1
b = a`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // first click, does nothing
  userEvent.click(stepButton);
  await sleep(50);

  // runs the first line
  userEvent.click(stepButton);
  refs = JSON.parse(visualBox.textContent);

  expect(refs.objects).toHaveLength(1);
  expect(refs.objects[0].value).toBe(1);

  expect(refs.variables).toHaveLength(1);
  expect(refs.variables[0].ref).toBe(refs.objects[0].id);

  // if you click too fast the it apparently won't have time to update...
  await sleep(50);

  // second click
  userEvent.click(stepButton);
  refs = JSON.parse(visualBox.textContent);

  expect(refs.objects).toHaveLength(1);
  expect(refs.variables).toHaveLength(2);
  // check that they point at the same ref
  expect(refs.variables[0].ref).toBe(refs.variables[1].ref);
});
