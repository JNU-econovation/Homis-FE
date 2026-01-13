import { useState, useEffect } from 'react';
import './MyDesignDetail.css';

import DownloadBtn from '../../components/Button/DownloadBtn/DownloadBtn.jsx';
import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';

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
                            src={img} alt='mydesign img'
                        />
                    </div>
                    <span className='my-design-title'>{title}</span>
                </div>
                <div className='my-design-description-con'>
                    <textarea className='my-design-description' 
                        value={description}
                        readOnly={true}
                    />
                </div>
            </div>
            <div className='my-design-detail-footer'>
                <DownloadBtn 
                    madeDataId={dataId}
                    madeName={title}
                />
            </div>
        </div >
    );
}