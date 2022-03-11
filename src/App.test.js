/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { selectOptions } from '@testing-library/user-event/dist/select-options';
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

test('run code on empty input', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code');

  // clear any default code snippet
  userEvent.clear(codebox);
  expect(codebox).toHaveValue('');

  // click run button, expect the no text should be in the output
  userEvent.click(runButton);
  expect(outputBox.textContent).toBeFalsy();
});

test('output 1', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code');

  const code = `
print(1)
print(2)
print(3)
print(4)
print(5)`;

  // be aware of new lines and stuff...
  const expected = '1\n2\n3\n4\n5\n';

  userEvent.clear(codebox);
  userEvent.type(codebox, code);
  userEvent.click(runButton);

  expect(outputBox.textContent).toBe(expected);
});

test('reference 1', async () => {
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

  // first click
  userEvent.click(stepButton);
  refs = JSON.parse(visualBox.textContent);

  expect(refs.objects).toHaveLength(1);
  expect(refs.objects[0].value.v).toBe(1);

  expect(refs.variables).toHaveLength(1);
  expect(refs.variables[0].ref).toBe(refs.objects[0].id);

  // im sorry for this but this is somehow needed...
  await sleep(50);

  // second click
  userEvent.click(stepButton);
  refs = JSON.parse(visualBox.textContent);

  expect(refs.objects).toHaveLength(1);
  expect(refs.variables).toHaveLength(2);
  // check that they point at the same ref
  expect(refs.variables[0].ref).toBe(refs.variables[1].ref);
});
