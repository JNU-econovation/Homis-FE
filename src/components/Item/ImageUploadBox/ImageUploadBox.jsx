import React, { useRef, } from 'react';
import './ImageUploadBox.css';

import plus_icon from '../../../assets/icons/XIcons/plus.png';

export default function ImageUploadBox({ onImageSelect }) { // onImageSelect => sends file to parent(AddItemPage)
    const fileInputRef = useRef(null);

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            onImageSelect(file);
        }
        e.target.value = '';
    }

    return (
        <div className='image-upload-box'
            onClick={() => {
                fileInputRef.current.click();
            }}>
            <img className='plus-btn-img'
                src={plus_icon}
                alt='추가 버튼'
            />
            <input
                className='input-file'
                type='file'
                accept='image/*'
                ref={fileInputRef}
                onChange={handleFileChange}
            />
        </div>
    );
}