import './WheelBtn.css';

import { useState } from 'react';
import cogwheel_icon from '../../../assets/icons/Setting/cogwheel.png';

export default function WheelBtn({ onClick }) {
    return (
        <div className='wheel-btn-container'>
            <button className='wheel-btn' onClick={onClick}>
                <img className='wheel-btn-img' 
                    src={cogwheel_icon} alt='wheel img'
                />
            </button>
        </div>
    );
}