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

/**
 * ____________________________________NOTES____________________________________
 * =============================================================================
 * - You can simply ignore the warning/error about not using act(), it's not
 *   really possible to do with the setup in our website, it's always going to
 *   change state after the program finished runnning.
 *
 * - Don't think there is a way to test if the nodes/edges have been rendered
 *   correctly since the graph visualisation library does not want to work,
 *   the best we can do is to test if the parse() function parses correctly.
 *
 * - Can we at some point remove all the console.log()?
 */

test('render correctly', () => {
  render(<App />);
});

test('run code on empty input', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');

  // clear any default code snippet
  userEvent.clear(codebox);
  expect(codebox).toHaveValue('');

  // click run button, expect the no text should be in the output
  userEvent.click(runButton);
  expect(outputBox.textContent).toBeFalsy();
});

test('print string displays correctly in the output', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');

  const testString = 'A completely random string that should not break anything whatsoever';

  const code = `
print("${testString}")`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);
  userEvent.click(runButton);

  // reminders that print in Python appends a newline character
  expect(outputBox.textContent).toBe(testString + '\n');
});

test('print numbers displays correctly in the output', () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');

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

test('step through a simple program and check if output display correctly', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const stepButton = screen.getByTitle('Run next line');

  // '{' and '[' are used as special characters in userEvent.type() so we need to double them...
  const code = `
a = [[1,2,3]
b = a
print(b)
a.append(4)
print(b)
print(a)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  userEvent.click(stepButton); // no row executed
  await sleep(50);

  userEvent.click(stepButton); // a = [1,2,3]
  await sleep(50);

  userEvent.click(stepButton); // b = a
  await sleep(50);

  userEvent.click(stepButton); // print(b)
  await sleep(50);
  expect(outputBox.textContent).toBe('[1, 2, 3]\n');

  userEvent.click(stepButton); // b.append(4)
  await sleep(50);

  userEvent.click(stepButton); // print(b)
  await sleep(50);

  expect(outputBox.textContent).toBe('[1, 2, 3]\n[1, 2, 3, 4]\n');
  userEvent.click(stepButton); // print(a)
  await sleep(50);

  expect(outputBox.textContent).toBe('[1, 2, 3]\n[1, 2, 3, 4]\n[1, 2, 3, 4]\n');
});
