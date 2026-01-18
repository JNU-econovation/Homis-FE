import './ProductDetailPage.css';

import { useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import ProductSpecTable from '../../components/Table/ProductSpecTable.jsx';
import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';
import ImagePagination from '../../components/ImagePagination/ImagePagination.jsx';
import { getDesignDetailsAPI, getAccessToken, handleAuthError, } from '../../utils/API.jsx';

// const dummyData = {
//     madeId: '1',
//     madeName: '보늬별코바늘나시★',
//     userName: '닉네임 예시',
//     price: 18750,
//     imageUrl: sample_img,
//     productSpecInfo: {
//         type: '대바늘',
//         usedNeedle: '3.5mm',
//         size: '100',
//         gauge: '30 x 30 / 5cm x 5cm',
//         threadUsage: '둥글실 5볼 반, 뚱글실 3볼',
//     },
//     description: '상세 설명 예시',
// };

export default function ProductDetailPage() {
    const locate = useLocation(); // mypage에서 도안 사진 클릭하면 해당 도안에 대한 data를 넘겨주면서 이 페이지로 이동될 거임. 그때 data 받기 위해 location 선언
    const [currentData, setCurrentData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    const { salePostId, isOwner } = locate.state || {};

    /* states for img pagination */
    const [images, setImages] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(function () {
        setIsLoading(true);

        async function fetchData() {
            let accessToken;
            try { accessToken = getAccessToken(); }
            catch (error) { handleAuthError(error, navigate); return; }
            const requestHeader = {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            };
            const requestBody = {
                salePostId: salePostId,
            };

            const apiRes = await getDesignDetailsAPI(requestHeader, requestBody, 'PURCHASE');
            if (apiRes) {
                setCurrentData(apiRes); // currentData.salePostDetailData.salerNickname~
                const mainImg = apiRes.salePostDetailData.saleThumbnailImgUrl;
                const extraImgs = apiRes.salePostDetailData.saleExtraImgUrls || [];
                setImages([mainImg, ...extraImgs]);

                setIsLoading(false);
            }
            else {
                alert('요청에 실패하였습니다. 다시 시도해 주세요.');
                return;
            }
        }
        fetchData();
    }, []);

    let productSpecInfo;
    if (!isLoading) {
        productSpecInfo = {
            type: currentData.salePostDetailData.saleType,
            usedNeedle: currentData.salePostDetailData.usedNeedle,
            size: currentData.salePostDetailData.saleSize,
            gauge: currentData.salePostDetailData.saleGauge,
            threadUsage: currentData.salePostDetailData.yarnUsage,
        };
    }

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
        <div className='product-detail-page-container'>
            <div className='product-detail-page-header'>
                <BackBtn link={isOwner ? '/my-page' : '-1'} /> { /* 뒤로가기 버튼 => 일단은 main 페이지로. 아직 mypage X */}
            </div>
            {!isLoading &&
                <div className='product-detail-page-body'>
                    <div className='product-detail-page-left-elements-wrapper'>
                        <div className='product-detail-img-container'>
                            <img className='product-img' src={images[currentIndex]} alt='design img' />
                            <div className='image-pagination-container-in-uploaded-product-detail-page'>
                                <ImagePagination
                                    totalImgCnt={images.length}
                                    currentIndex={currentIndex}
                                    onPrev={handlePrevClick}
                                    onNext={handleNextClick}
                                />
                            </div>
                        </div>
                        <div className='title-and-price-wrapper'>
                            <span className='product-info title'>{currentData.salePostDetailData.saleName}</span>
                            <span className='product-info price'>{currentData.salePostDetailData.salePrice.toLocaleString()}원</span>
                        </div>
                    </div>
                    <div className='product-detail-page-right-elements-wrapper'>
                        <ProductSpecTable productSpecInfo={productSpecInfo} />
                        <textarea className='product-detail-page-description'
                            value={currentData.salePostDetailData.saleScript}
                            readOnly={true}
                        />
                    </div>
                </div>
            }
        </div>
    );
}