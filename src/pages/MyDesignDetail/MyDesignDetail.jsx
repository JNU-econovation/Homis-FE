import { useState, useEffect } from 'react';
import './MyDesignDetail.css';

import DownloadBtn from '../../components/Button/DownloadBtn/DownloadBtn.jsx';
import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';
import sample_design_img from '../../assets/sample/sample-design-img.png';

export default function MyDesignDetail({ dataId, img = null, title = 'test', description = 'test description' }) {
    const [currentData, setCurrentData] = useState({ img: '', title: '', description: '' });

    useEffect(function () {
        const targetData = { img: img, title: title, description: description };
        setCurrentData(targetData);
    }, [currentData]);

    return (
        <div className='my-design-detail-container'>
            <div className='my-design-detail-header'>
                <BackBtn link='/main' />
            </div>
            <div className='my-design-detail-body'>
                <div className='my-design-title-and-img-container'>
                    <div className='my-design-img-background'>
                        <img className='my-design-img'
                            src={sample_design_img} alt='mydesign img'
                        />
                    </div>
                    <span className='my-design-title'>{title}</span>
                </div>
                <div className='my-design-description-and-download-btn-con'>
                    <textarea className='my-design-description' 
                        value={description}
                        readOnly={true}
                    />
                    <div className='my-design-download-btn'>
                        <DownloadBtn
                            madeDataId={dataId}
                            madeName={title}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}