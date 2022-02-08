import React from 'react';
import './App.css';
import Code_box from './Components/CodeBox';
import Header from './Components/Header';
import Output_box from './Components/OutputBox';
import Visual_box from './Components/VisualBox';
import Control_panel from './Components/ControlPanel';

function App() {
  return (
    <div className="App">
      <Header />
      <div id="App-body">
          <div id="Left-body">
            <Control_panel />
            <Code_box />
            <Output_box />
          </div>
          <div id="Right-body">
            <Visual_box />
          </div>
      </div>
    </div>
  );
} 

export default App;


// // output functions are configurable.  This one just appends some text
// // to a pre element.
// function outf(text) { 
//   var mypre = document.getElementById("output"); 
//   mypre.innerHTML = mypre.innerHTML + text; 
// } 
// function builtinRead(x) {
//   if (Sk.builtinFiles === undefined || Sk.builtinFiles["files"][x] === undefined)
//           throw "File not found: '" + x + "'";
//   return Sk.builtinFiles["files"][x];
// }

// // Here's everything you need to run a python program in skulpt
// // grab the code from your textarea
// // get a reference to your pre element for output
// // configure the output function
// // call Sk.importMainWithBody()
// function runit() { 
//  var prog = document.getElementById("yourcode").value; 
//  var mypre = document.getElementById("output"); 
//  mypre.innerHTML = ''; 
//  Sk.pre = "output";
//  Sk.configure({output:outf, read:builtinRead}); 
//  (Sk.TurtleGraphics || (Sk.TurtleGraphics = {})).target = 'mycanvas';
//  var myPromise = Sk.misceval.asyncToPromise(function() {
//      return Sk.importMainWithBody("<stdin>", false, prog, true);
//  });
//  myPromise.then(function(mod) {
//      console.log('success');
//  },
//      function(err) {
//      console.log(err.toString());
//  });
// } 
