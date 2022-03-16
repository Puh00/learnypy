/* test('reference 1', async () => {
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
}); */
