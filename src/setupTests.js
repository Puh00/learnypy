// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

import fs from 'fs';

const head = document.getElementsByTagName('head')[0];

const skulptMinJs = fs.readFileSync('public/skulpt/skulpt.min.js');
const skulptMinJsScript = document.createElement('script');
skulptMinJsScript.type = 'text/javascript';
skulptMinJsScript.async = false;
skulptMinJsScript.textContent = skulptMinJs;

const skulptStdLib = fs.readFileSync('public/skulpt/skulpt-stdlib.js');
const skulptStdlibScript = document.createElement('script');
skulptStdlibScript.type = 'text/javascript';
skulptStdlibScript.async = false;
skulptStdlibScript.textContent = skulptStdLib;

const skulptDebugger = fs.readFileSync('public/skulpt/debugger.js');
const skulptDebuggerScript = document.createElement('script');
skulptDebuggerScript.type = 'text/javascript';
skulptDebuggerScript.async = false;
skulptDebuggerScript.textContent = skulptDebugger;

head.appendChild(skulptMinJsScript);
head.appendChild(skulptStdlibScript);
head.appendChild(skulptDebuggerScript);

/* global global */
// Util functions for jest testing
global.sleep = (ms) => new Promise((r) => setTimeout(r, ms));

global.getObjectById = (objects, id) => {
  return objects.find((object) => object.id === id);
};

global.getVariableByName = (variables, name) => {
  return variables.find((variable) => variable.name === name);
};

global.getRefs = (visualBox) => {
  return JSON.parse(visualBox.textContent);
};
