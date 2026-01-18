import './PurchasedDesignDetailPage.css';
import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import ProductSpecTable from '../../components/Table/ProductSpecTable.jsx';
import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';
import SingleDownloadBtn from '../../components/Button/DownloadBtn/SingleDownloadBtn.jsx';
import ImagePagination from '../../components/ImagePagination/ImagePagination.jsx';

export default function PurchasedDesignDetailPage() {
    const locate = useLocation();
    const navigate = useNavigate();

    const { salePostDetailData, saleAndUserInfo, id } = locate.state || {};
    const specTableData = {
        type: salePostDetailData.saleType,
        usedNeedle: salePostDetailData.usedNeedle,
        size: salePostDetailData.saleSize,
        gauge: salePostDetailData.saleGauge,
        threadUsage: salePostDetailData.yarnUsage,
    };
    // console.log(salePostDetailData.saleExtraImgUrls);

    // const dummyData = {
    //     type: '대바늘',
    //     usedNeedle: '3.5mm',
    //     size: '100',
    //     gauge: '30 x 30 / 5cm x 5cm',
    //     threadUsage: '둥글실 5볼 반, 뚱글실 3볼',
    // }; SpecTable Component에는 위 구조로 된 obj 넘겨줘야 함

    const [images, setImages] = useState(() => {
        const mainImg = salePostDetailData.saleThumbnailImgUrl;
        const extraImgs = salePostDetailData.saleExtraImgUrls || []; // 추가 이미지 있다면 해당 이미지들 담긴 배열 반환함. 없으면 그냥 빈 배열 [] 반환
        return [mainImg, ...extraImgs];
    });
    const [currentIndex, setCurrentIndex] = useState(0);

    /* ImagePagination Handlers*/
    const handlePrevClick = () => {
        if (currentIndex > 0) // idx > 0 => 첫 번째 사진이 아님
            setCurrentIndex(prev => prev - 1); // 기존 state값을 prev로 받아서 prev - 1 수행한 결과값으로 set..
    }
    const handleNextClick = () => {
        if (currentIndex < images.length - 1) // 마지막 idx값보다 작다? => 현재 idx가 마지막 요소 idx가 아니니 > 클릭 가능
            setCurrentIndex(prev => prev + 1);
    }

    return (
        <div className='purchased-design-detail-container'>
            <div className='purchased-detail-page-header'>
                <BackBtn link='/main' />
            </div>
            <div className='purchased-detail-page-body'>
                <div className='purchased-detail-page-left-elements-wrapper'>
                    <div className='purchased-product-img-container'>
                        <img className='purchased-product-img' src={images[currentIndex]} alt='design img' />
                        <div className='image-pagination-container-in-detail-page'>
                            <ImagePagination
                                totalImgCnt={images.length}
                                currentIndex={currentIndex}
                                onPrev={handlePrevClick}
                                onNext={handleNextClick}
                            />
                        </div>
                    </div>
                    <div className='purchased-detail-page-title-and-editor-wrapper'>
                        <span className='purchased-product-info title'>{salePostDetailData.saleName}</span>
                        <span className='purchased-product-info editor'
                            onClick={() => navigate('/my-page', {
                                state: {
                                    isOwner: false,
                                    salerNickname: salePostDetailData.salerNickname,
                                }
                            })}
                        >edit.{salePostDetailData.salerNickname}</span>
                    </div>
                </div>
                <div className='purchased-detail-page-right-elements-wrapper'>
                    <ProductSpecTable productSpecInfo={specTableData} />
                    <textarea className='purchased-detail-page-description'
                        value={salePostDetailData.saleScript}
                        readOnly={true}
                    />
                    <div className='purchased-detail-page-download-btn-container'>
                        <SingleDownloadBtn
                            salePostId={salePostDetailData.salePostId}
                            saleName={salePostDetailData.saleName}
                            id={id}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}