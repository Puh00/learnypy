/* eslint-disable no-undef */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import App from '../App';
import sleep from '../util/sleep';

// mock these components since the imported libraries seem to break everything...
jest.mock('../Components/VisualBox', () => {
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

// hack to allow setting breakpoints...
// limitations of frontend testing, can't access setBreakpoints directly...
let set_breakpoints;

jest.mock('../Components/CodeBox', () => {
  return function CodeBox({ code, setCode, add_breakpoint }) {
    set_breakpoints = (breakpoints) => {
      breakpoints.forEach((bp) => {
        add_breakpoint(bp);
      });
    };

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
 * - The following tests test only breakpoints, so the program used consists of
 *   mostly print statement since the actual variables and objects shouldn't
 *   matter to this test suite. One exception to this is when testing if the
 *   program properly stops at different scopes in functions, or testing
 *   if-statements/loops.
 */

test('run the program until a single breakpoint and run again', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const outputBox = screen.getByTestId('output-box');

  const code = `print(1)
print(2)
print(3)
print(4)
print(5)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // TODO: incoming merge conflict
  set_breakpoints([2]); // insert a breakpoint at line 3 -> `print(3)`

  // execute the code once
  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n');

  // execute the code twice
  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n3\n4\n5\n');
});

test('a program with breakpoints on all rows', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const outputBox = screen.getByTestId('output-box');

  const code = `print(1)
print(2)
print(3)
print(4)
print(5)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // insert the breakpoints at each row
  set_breakpoints([0, 1, 2, 3, 4]);

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('');

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n');

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n');

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n3\n');

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n3\n4\n');

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n3\n4\n5\n');
});

test('stopping on the first row of code but the first line is empty', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const outputBox = screen.getByTestId('output-box');

  const code = `
print(1)
print(2)
print(3)
print(4)
print(5)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // insert a breakpoint at the first row of the code (not the first line)
  set_breakpoints([1]);

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('');

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n3\n4\n5\n');
});

test('run and step works interchangeably with breakpoints', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const stepButton = screen.getByTitle('Run next line');

  const code = `print(1)
print(2)
print(3)
print(4)
print(5)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // insert breakpoints at `print(2)` and `print(5)`
  set_breakpoints([1, 4]);

  // run
  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n');

  // step
  userEvent.click(stepButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n');

  // step
  userEvent.click(stepButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n3\n');

  // run
  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n3\n4\n');

  // run
  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('1\n2\n3\n4\n5\n');
});

test('breakpoints in if-statements', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');

  const code = `if True:
  print("yes")
print("yup")
if False:
  print("no")
print("over")`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // insert breakpoints at `print("yes")` and `print("no")`
  set_breakpoints([1, 2, 4]);

  // run the code
  userEvent.click(runButton);
  await sleep(50);
  // should stopped at print("yes") and have printed nothing yet
  expect(outputBox.textContent).toEqual('');

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('yes\n');

  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual('yes\nyup\nover\n');
});

test('breakpoints in loops', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');

  const code = `for i in range(10):
  print(i)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // insert a breakpoint at `print(i)`
  set_breakpoints([1]);

  let expected = '';

  // first time have not printed anything yet
  userEvent.click(runButton);
  await sleep(50);
  expect(outputBox.textContent).toEqual(expected);

  for (let i = 0; i < 10; i++) {
    expected += `${i}\n`;

    userEvent.click(runButton);
    await sleep(50);
    expect(outputBox.textContent).toEqual(expected);
  }
});

test('breakpoints with functions', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');

  const code = `def a():
  print(1)
def b():
  print(2)
a()
b()`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // insert a breakpoint at `print(1)` and `print(2)`
  set_breakpoints([1, 3]);

  userEvent.click(runButton);
  await sleep(50);
  // stopped at `print(1)`
  expect(outputBox.textContent).toEqual('');

  userEvent.click(runButton);
  await sleep(50);
  // printed 1 and stopped at `print(2)`
  expect(outputBox.textContent).toEqual('1\n');

  userEvent.click(runButton);
  await sleep(50);
  // printed 2
  expect(outputBox.textContent).toEqual('1\n2\n');
});

test('choosing examples removes old breakpoints', async () => {
  render(<App />);

  const codebox = screen.getByRole('textbox');
  const outputBox = screen.getByTestId('output-box');
  const runButton = screen.getByTitle('Run code (until next breakpoint)');
  const dropDownButton = screen.getByTitle('Code Examples');

  const code = `print(1)
print(2)
print(3)
print(4)
print(5)`;

  userEvent.clear(codebox);
  userEvent.type(codebox, code);

  // insert a breakpoint at `print(1)` and `print(3)`
  set_breakpoints([0, 2]);

  userEvent.click(dropDownButton);

  const codeExampleOneButton = screen.getByText('Example 1');

  userEvent.click(codeExampleOneButton);
  await sleep(50);

  expect(codebox.textContent).toEqual('a=[]\nb=a\nb.append(3)\nprint(b)');

  userEvent.click(runButton);
  await sleep(50);

  expect(outputBox.textContent).toEqual('[3]\n');
});
