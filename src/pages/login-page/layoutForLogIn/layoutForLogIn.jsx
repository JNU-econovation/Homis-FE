import React from 'react';
import './layoutForLogin.css';

export default function LayoutForLogIn( { children } ) {
    const childrenArray = React.Children.toArray(children); // [0] = title_Container | [1] = error_C | [2] = inputBar_C | [3] = signup_link_C | [4] = login_btn_C
    return (
        <div className="layout">
            <main className='layout-mainContent'>
                <div className='title'>{childrenArray[0]}</div>
                <div className='error'>{childrenArray[1]}</div>
                <div className='input'>{childrenArray[2]}</div>
                <div className='signup'>{childrenArray[3]}</div>
                <div className='login_btn'>{childrenArray[4]}</div>
            </main>
        </div>
    );
}