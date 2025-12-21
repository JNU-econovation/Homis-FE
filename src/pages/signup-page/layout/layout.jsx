import React from 'react';
import './layout.css';

function Layout ( { children }) {
    const childrenArray = React.Children.toArray(children); // [0] = title_Container | [1] = inputBar_C | [2] = submitBtn_C
    return (
        <div className="layout">
            <main className='layout-mainContent'>
                <div className='title'>{childrenArray[0]}</div>
                <div className='input'>{childrenArray[1]}</div>
                <div className='submit'>{childrenArray[2]}</div>
            </main>
        </div>
    )
}

export default Layout;