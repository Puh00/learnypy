const getObjectById = (objects, id) => {
  return objects.find((object) => object.id === id);
};

const getVariableByName = (variables, name) => {
  return variables.find((variable) => variable.name === name);
};

const getRefs = (visualBox) => {
  return JSON.parse(visualBox.textContent);
};

export { getObjectById, getRefs, getVariableByName };
