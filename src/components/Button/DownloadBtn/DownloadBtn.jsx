import { useState } from 'react';
import './DownloadBtn.css';

import download_icon from '../../../assets/icons/DownloadIcons/download.png';

export default function DownloadBtn() {
    const [isExpanded, setIsExpanded] = useState(false);

    function handleClickDownload(fileType) {
        // 다운로드 로직
        setIsExpanded(false); // 다운로드 다 끝내고 팔레트 닫음
    }

    return (
        <div className={`download-btn-container ${isExpanded ? 'expanded' : 'unexpanded'}`}>
            <div className={`palette-container ${isExpanded ? 'expanded' : 'unexpanded'}`}>
                <button className='file-type PDF' onClick={() => handleClickDownload('PDF')}>
                    PDF
                </button>
                <button className='file-type IMG' onClick={() => handleClickDownload('IMG')}>
                    PNG
                </button>
            </div>
            <div className='download-btn-img-container'>
                <button className='download-btn' onClick={() => setIsExpanded(!isExpanded)}>
                    <img className='download-img'
                        src={download_icon} alt='download img'
                    />
                </button>
            </div>
        </div>
    );
}