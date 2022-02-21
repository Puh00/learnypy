import React from 'react';

//TODO

// } else if (this.on_click() == 'dropdown') {
//   return (
//     <div className="Dropdown">
//       <button onClick={this.on_click} className="Control-button">
//         {this.icon}
//       </button>
//       <div className="Dropdown-menu">
//         <a className="Dropdown-item" href="#">
//           Action
//         </a>
//         <a className="Dropdown-item" href="#">
//           Another action
//         </a>
//         <a className="Dropdown-item" href="#">
//           Something else here
//         </a>
//       </div>
//     </div>
//   );

class Dropdown_item {
    constructor(text, tooltip, action = ()=>{}){
        this.text = text;
        this.tooltip = tooltip;
        this.action = action;
    }
}

class Dropdown{
    contents = [];
    constructor(button, contents = this.contents, className = 'Dropdown'){
        this.button = button;
        this.contents = contents;
        this.className = className;
    }

    calc_rows() {
        
    }

    render() {
        return(
        <div className="Dropdown-menu">
            <a className="Dropdown-item" href="#">
            Action
            </a>
            <a className="Dropdown-item" href="#">
            Another action
            </a>
            <a className="Dropdown-item" href="#">
            Something else here
            </a>
        </div>            
        );
    }
}

export default Dropdown;
