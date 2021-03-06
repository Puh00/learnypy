/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { App } from 'src/App';

// mock these components since the imported libraries seem to break everything...
jest.mock('src/features/visual-box/VisualBox', () => {
  return function VisualBox({ data }) {
    return <div data-testid="visual-box">{JSON.stringify(data)}</div>;
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

/**
 * ____________________________________NOTES____________________________________
 * =============================================================================
 * - You can simply ignore the warning/error about not using act(), it's not
 *   really possible to do with the setup in our website, it's always going to
 *   change state after the program finished runnning.
 *
 * - App.test.js tests the UI, in other words the tests here try to mimic how
 *   a user would use the program and check that everything works as intended.
 *
 * - Don't think there is a way to test if the nodes/edges have been rendered
 *   correctly since the graph visualisation library does not want to work,
 *   the best we can do is to test if the parse() function parses correctly.
 *
 * - Similarly it can't test if breakpoints display correctly, but we can test
 *   for instance if the program stops at the correct line.
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
  await global.sleep(50);
  expect(outputBox.textContent).toBe('');

  userEvent.click(stepButton); // a = [1,2,3]
  await global.sleep(50);
  expect(outputBox.textContent).toBe('');

  userEvent.click(stepButton); // b = a
  await global.sleep(50);
  expect(outputBox.textContent).toBe('');

  userEvent.click(stepButton); // print(b)
  await global.sleep(50);
  expect(outputBox.textContent).toBe('[1, 2, 3]\n');

  userEvent.click(stepButton); // b.append(4)
  await global.sleep(50);
  expect(outputBox.textContent).toBe('[1, 2, 3]\n');

  userEvent.click(stepButton); // print(b)
  await global.sleep(50);
  expect(outputBox.textContent).toBe('[1, 2, 3]\n[1, 2, 3, 4]\n');

  userEvent.click(stepButton); // print(a)
  await global.sleep(50);
  expect(outputBox.textContent).toBe('[1, 2, 3]\n[1, 2, 3, 4]\n[1, 2, 3, 4]\n');
});

test('syntax error outputs correctly', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');

  // line 4 or 5 should yield an syntax error, missing closing parenthesis
  const code = `
a = [[1,2,3]
b = a
print(b
a.append(4)
print(b)
print(a)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  userEvent.click(runButton);
  await global.sleep(50);

  const expected = 'SyntaxError: bad input on line 5';

  expect(outputBox.textContent).toEqual(expected);
});

test('can run the code after error is fixed directly', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');

  let code = `
a = 1
b == 2
a = b
print(a)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);
  userEvent.click(runButton);
  await sleep(50);

  let expected = "NameError: name 'b' is not defined on line 3";
  expect(outputBox.textContent).toEqual(expected);

  // fix the code, should be able to run directly
  code = `
a = 1
b = 2
a = b
print(a)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);
  userEvent.click(runButton);
  await sleep(50);

  expected = '2\n';
  expect(outputBox.textContent).toEqual(expected);
});

test('changing code examples from a class while stepping', async () => {
  render(<App />);

  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const stepButton = screen.getByTitle('Run next line');
  const dropDownButton = screen.getByTitle('Code Examples');

  userEvent.click(dropDownButton);
  await global.sleep(50);

  const linkedListExample = screen.getByText('Linked list');
  userEvent.click(linkedListExample);
  await global.sleep(50);

  // step 4 times
  for (let i = 0; i < 4; i++) {
    userEvent.click(stepButton);
    await global.sleep(50);
  }

  expect(outputBox.textContent).toEqual('');

  userEvent.click(dropDownButton);
  await global.sleep(50);

  const aliasingExample = screen.getByText('Aliasing');
  userEvent.click(aliasingExample);
  await global.sleep(50);

  expect(outputBox.textContent).toEqual('');

  userEvent.click(runButton);
  await global.sleep(50);

  expect(outputBox.textContent).toEqual('[3]\n[3]\n[3]\nTrue\nFalse\n');
});
