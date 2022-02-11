
import React from 'react';
import { useState } from "react";

class CodeBox extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      value: "import turtle\nt = turtle.Turtle()\nfor c in ['red', 'green', 'yellow', 'blue']:\n\tt.color(c)\n\tt.forward(75)\n\tt.left(90)",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({value: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();
    runit(this.state.value);
  }

  render() {
    return (
      <form onSubmit={this.handleSubmit}>
        <label>
          <textarea value={this.state.value} onChange={this.handleChange} cols="50" rows="20" />
        </label>
        <input type="submit" value="Run" />
        
      </form>

    );
  }
}

function builtinRead(x) {
  if (window.Sk.builtinFiles === undefined || window.Sk.builtinFiles["files"][x] === undefined)
          throw "File not found: '" + x + "'";
  return window.Sk.builtinFiles["files"][x]
 
}

function outf(text) { 
  var mypre = document.getElementById("output"); 
  mypre.innerHTML = mypre.innerHTML + text; 
} 

function runit(prog, output) { 
  window.Sk.global.console.log("hej");
  window.Sk.pre = "output";
  window.Sk.configure({output:outf, read:builtinRead}); 
  (window.Sk.TurtleGraphics || (window.Sk.TurtleGraphics = {})).target = 'mycanvas';
  var myPromise = window.Sk.misceval.asyncToPromise(function() {
      return window.Sk.importMainWithBody("<stdin>", false, prog, true);
  });
  myPromise.then(function(mod) {
      console.log('success');
  },
      function(err) {
      console.log(err.toString());
  });
}

function App() {
  return (
    <html> 
      <body> 
      <h3>Try This</h3> 
      <CodeBox id="yourcode" ></CodeBox> 
      <pre id="output" ></pre> 

      <div id="mycanvas"></div> 

      </body> 
    </html> 
  );
}

export default App;
