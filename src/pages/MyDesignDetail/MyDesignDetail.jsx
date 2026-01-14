import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import './MyDesignDetail.css';

import DownloadBtn from '../../components/Button/DownloadBtn/DownloadBtn.jsx';
import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';
// import sample_design_img from '../../assets/sample/sample-design-img.png';

export default function MyDesignDetail() {
    const [currentData, setCurrentData] = useState({ dataId: '', img: '', title: '', description: '' });

    const locate = useLocation();

    const { madeDataId, madeImgUrl, madeDetail, madeName } = locate.state || { };

    /*
    useEffect() 내에서 setCurrentData(targetData); 호출 -> currentData가 변경됨 -> useEffect의 Dependency 배열인 currentData가 변경되니 다시 useEffect() 수행되고 setCurrentData(..); 호출 -> 무한반복
    절대 이렇게 짜지 말자! 바보같은 코드,,,
    */
    // useEffect(function () {
    //     const targetData = { dataId: madeDataId, img: madeImgUrl, title: madeName, description: madeDetail };
    //     setCurrentData(targetData);
    // }, [currentData]);

    // locate로 데이터 받아왔는데, 굳이 useState, useEffect를 왜 씀???? 그냥 바로 쓰면 됨.

    return (
        <div className='my-design-detail-container'>
            <div className='my-design-detail-header'>
                <BackBtn link='/main' />
            </div>
            <div className='my-design-detail-body'>
                <div className='my-design-title-and-img-container'>
                    <div className='my-design-img-background'>
                        <img className='my-design-img'
                            src={madeImgUrl} alt='mydesign img'
                        />
                    </div>
                    <span className='my-design-title'>{madeName}</span>
                </div>
                <div className='my-design-description-and-download-btn-con'>
                    <textarea className='my-design-description' 
                        value={madeDetail}
                        readOnly={true}
                    />
                    <div className='my-design-download-btn'>
                        <DownloadBtn
                            madeDataId={madeDataId}
                            madeName={madeName}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}