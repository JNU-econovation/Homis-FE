import { useState } from 'react';

import eraser_s from '../../../assets/icons/DesignPageIcons/Eraser/eraser_s.png';
import eraser_uns from '../../../assets/icons/DesignPageIcons/Eraser/eraser_uns.png';

import './EraserBtn.css';

export default function EraserBtn({ isSelected, onClick }) {
    const currentImg = isSelected ? eraser_s : eraser_uns;

    return (
        <button 
            className={`eraser-btn ${isSelected ? 'selected' : 'unselected'}`}
            onClick={onClick}>
            <img src={currentImg} alt='지우개' />
        </button>
    );
}