import './UndoRedoBtn.css';
import undo_icon from '../../../assets/icons/arrow/undo.png';
import redo_icon from '../../../assets/icons/arrow/redo.png';

import React, { useState } from 'react';

// GridBoard.jsx에서 모든 State를 관리하므로, 여기서 Undo, Redo가 가능한지 판단하여 true/false값을 Undo..Btn.jsx에게 Prop으로 넘겨주는 게 훨씬 간단함 
export default function UndoRedoBtn({ onUndo, onRedo, canUndo, canRedo }) {
    return (
        <div className='redo-undo-container'>
            <button className='undo-btn'
                onClick={() => onUndo()}
                disabled={!canUndo}>
                <img className='undo-btn-img'
                    src={undo_icon} alt='undo img' />
            </button>
            <button className='redo-btn'
                onClick={() => onRedo()}
                disabled={!canRedo}>
                <img className='redo-btn-img'
                    src={redo_icon} alt='redo img' />
            </button>
        </div>
    );
}