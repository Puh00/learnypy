import React, { useState } from 'react';
import CodeBox from './Components/CodeBox';
import Header from './Components/Header';

import Control_panel from './Components/ControlPanel';
import VisualBox from './Components/VisualBox';

function builtinRead(x) {
  if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles['files'][x] === undefined)
    throw "File not found: '" + x + "'";
  return window.Sk.builtinFiles['files'][x];
}

function outf(text) {
  var mypre = document.getElementById('output');
  mypre.innerHTML = mypre.innerHTML + text;
}

function runit(prog) {
  window.Sk.global.console.log('hej');
  window.Sk.pre = 'output';
  window.Sk.configure({ output: outf, read: builtinRead });
  (window.Sk.TurtleGraphics || (window.Sk.TurtleGraphics = {})).target = 'mycanvas';
  var myPromise = window.Sk.misceval.asyncToPromise(function () {
    return window.Sk.importMainWithBody('<stdin>', false, prog, true);
  });
  myPromise.then(
    function () {
      console.log('success');
    },
    function (err) {
      console.log(err.toString());
    }
  );
}

function App() {
  // eslint-disable-next-line no-unused-vars
  const [refs, setRefs] = useState({});

  return (
    <div className="App">
      <Header />
      <div id="App-body">
        <div id="Left-body">
          <Control_panel />
          <h3>Try This</h3>
          <CodeBox id="yourcode" runit={runit}></CodeBox>
          <pre id="output"></pre>

          <div id="mycanvas"></div>
        </div>
        <div id="Right-body">
          <VisualBox data={refs} />
        </div>
      </div>
    </div>
  );
}
export default App;
