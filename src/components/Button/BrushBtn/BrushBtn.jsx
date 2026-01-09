import { useState } from 'react';

import brush_s from '../../../assets/icons/DesignPageIcons/Brush/brush_s.png';
import brush_uns from '../../../assets/icons/DesignPageIcons/Brush/brush_uns.png';

import './BrushBtn.css';

export default function BrushBtn({ isSelected, onClick }) {
    const currentImg = isSelected ? brush_s : brush_uns;

    return (
        <button 
            className={`brush-btn ${isSelected ? 'selected' : 'unselected'}`}
            onClick={onClick}>
            <img src={currentImg} alt='브러시' />
        </button>
    );
}