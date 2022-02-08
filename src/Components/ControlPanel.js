import React, {Component} from 'react';
import {ReactComponent as Play_logo} from './Icons/play.svg';
import {ReactComponent as Next_logo} from './Icons/arrow-right.svg';
import {ReactComponent as Pause_logo} from './Icons/pause.svg';
import {ReactComponent as Repeat_logo} from './Icons/repeat.svg';
import {ReactComponent as Menu_logo} from './Icons/repeat.svg'; /*Find correct logo*/

function Control_panel(props) {
    return(
        <div className='Control-panel'>
            <Control_button type={play_button}/>
            <Control_button type={next_button}/>
            <Control_button type={pause_button}/>
            <Control_button type={repeat_button}/>
            <Control_button type={menu_button}/>
        </div>
    );
}

function Control_button (props){
      return(
        <div className='Control-button'>
            <button onClick={props.type.on_click} className = 'Control-button2'>
                {props.type.component}
            </button>
        </div>
      );
    }

const play_button =  {
    component: <Play_logo />,
    on_click: () => temp_click()
}

const next_button = {
    component: <Next_logo />,
    on_click: () => temp_click()
}

const pause_button = {
    component: <Pause_logo/>,
    on_click: () => temp_click()
}

const repeat_button = {
    component: <Repeat_logo/>,
    on_click: () => temp_click()
}

const menu_button = {
    component: <Menu_logo/>,
    on_click: () => temp_click()
}

function temp_click(){
    return;
}

export default Control_panel;