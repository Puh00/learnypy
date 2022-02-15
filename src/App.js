import React from 'react';
import './App.css';
import CodeBox from './Components/CodeBox';
import Header from './Components/Header';
import Control_panel from './Components/ControlPanel';
import Visual_box from './Components/VisualBox';

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
  return (
    <div className="App">
      <Header />
      <div id="App-body">
        <div id="Left-body">
          <Control_panel />
          <CodeBox runit={runit}></CodeBox>
          <pre id="output"></pre>
          {/* <div id="mycanvas"></div>*/} {/*Should we have this???}*/}
        </div>
        <div id="Right-body">
          <Visual_box />
        </div>
      </div>
    </div>
  );
}
export default App;
