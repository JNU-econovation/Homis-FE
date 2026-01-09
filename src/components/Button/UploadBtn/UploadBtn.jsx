import './UploadBtn.css';
import React, { useRef } from 'react';

import upload_icon from '../../../assets/icons/SaveIcons/upload.png';

export default function UploadBtn({ label, error, onFileSelect, selectedFile }) {
    const fileInputRef = useRef(null);

    const handleBoxClick = () => {
        fileInputRef.current.click();
    };

    function handleFileChange(e) {
        const file = e.target.files[0];
        if (file) {
            onFileSelect(file); // 부모에게 파일 전달
        }
    }

    return (
        <div className='upload-btn-container'>
            <label className={`upload-btn-label ${error ? 'error-case' : ''}`}>
                {error &&
                    <span className='upload-btn-label add-star'>*</span>
                }
                {label}
            </label>
            <div className='upload-box-and-filename-con'>
                <div className='upload-box' onClick={handleBoxClick}>
                    <img className='upload-img'
                        src={upload_icon} alt='업로드 이미지'
                    />

                </div>
                {selectedFile ?
                    <span className='file-name'>{selectedFile.name}</span>
                    :
                    ''
                }
            </div>
            <input
                type='file'
                accept='.pdf' /* only pdf file allowed */
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
}