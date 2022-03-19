const getObjectByValue = (objects, value) => {
  return objects.filter((object) => JSON.stringify(object.value) === JSON.stringify(value));
};

const getVariableByName = (variables, name) => {
  return variables.find((variable) => variable.name === name);
};

export { getObjectByValue, getVariableByName };
