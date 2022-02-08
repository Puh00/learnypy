import React from 'react';

function Code_box(props) {
    return(
            <form>
            <input type="text" name="name" className='Code-box' />
            <input type="submit" value="Run" />
            </form>
    );
}

export default Code_box;