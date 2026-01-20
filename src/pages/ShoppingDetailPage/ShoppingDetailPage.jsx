import { useState, useEffect } from 'react';
import './ShoppingDetailPage.css';

import { useLocation, useNavigate } from 'react-router-dom';
import { getAccessToken, handleAuthError, getDesignsForMainPageAPI, } from '../../utils/API.jsx';
import ProductSpecTable from '../../components/Table/ProductSpecTable.jsx';
import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';
import SingleDownloadBtn from '../../components/Button/DownloadBtn/SingleDownloadBtn.jsx';
import ImagePagination from '../../components/ImagePagination/ImagePagination.jsx';
import PurchasedBtn from '../../components/Button/PurchaseBtn/PurchaseBtn.jsx';

export default function ShoppingDetailPage() {
    const locate = useLocation();
    const navigate = useNavigate();
    const [purchasedPostId, setPurchasedPostId] = useState();

    const { salePostDetailData, saleAndUserInfo } = locate.state || {}; // salePostDetailData.salerNickname~ saleAndUserInfo.uploader~ => [쇼핑]판매 등록 상세 내용 불러오기 그대로
    const specTableData = {
        type: salePostDetailData.saleType,
        usedNeedle: salePostDetailData.usedNeedle,
        size: salePostDetailData.saleSize,
        gauge: salePostDetailData.saleGauge,
        threadUsage: salePostDetailData.yarnUsage,
    };

    const [isOwner, setIsOwner] = useState(saleAndUserInfo.owner);

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

    useEffect(function () {
        async function findPurchasedPostId() {
            let accessToken;
            try { accessToken = getAccessToken(); }
            catch (error) { handleAuthError(error, navigate); return; }
            const requestHeader = {
                'Authorization': `Bearer ${accessToken}`,
            };
            const apiRes = await getDesignsForMainPageAPI(requestHeader, 'purchased'); // 인자 purchased 줘야 구매한 도안 미리보기 데이터 가져옴
            if (apiRes) {
                // apiRes.map((item) => { // .find 사용이 더 바람직
                //     if (item.salePostId === salePostId) setPurchasedPostId(apiRes.purchasedPostId);
                // });
                const foundItem = apiRes.find((item) => item.salePostId === salePostDetailData.salePostId);

                if (foundItem) setPurchasedPostId(foundItem.purchasedPostId);
                else alert('No purchasedPostId Exists');
            }
        }
        if (isOwner) findPurchasedPostId();
    }, [salePostDetailData, saleAndUserInfo, isOwner]);

    return (
        <div className='shopping-detail-container'>
            <div className='shopping-detail-page-header'>
                <BackBtn link='/shopping-page' />
            </div>
            <div className='shopping-detail-page-body'>
                <div className='shopping-detail-page-left-elements-wrapper'>
                    <div className='shopping-detail-page-img-container'>
                        <img className='listed-product-img' src={images[currentIndex]} alt='design img' />
                        <div className='image-pagination-container-in-shopping-detail-page'>
                            <ImagePagination
                                totalImgCnt={images.length}
                                currentIndex={currentIndex}
                                onPrev={handlePrevClick}
                                onNext={handleNextClick}
                            />
                        </div>
                    </div>
                    <div className='shopping-detail-page-span-container'>
                        <span className='listed-product-info title'>{salePostDetailData.saleName}</span>
                        <div className='shopping-detail-page-price-editor-wrapper'>
                            <span className='listed-product-info price'>{salePostDetailData.salePrice}원</span>
                            <span className='listed-product-info editor'
                                onClick={() => navigate('/my-page', {
                                    state: {
                                        isOwner: false,
                                        salerNickname: salePostDetailData.salerNickname,
                                    }
                                })}
                            >edit.{salePostDetailData.salerNickname}</span>
                        </div>
                    </div>
                </div>
                <div className='shopping-detail-page-right-elements-wrapper'>
                    <ProductSpecTable productSpecInfo={specTableData} />
                    <textarea className='shopping-detail-page-description'
                        value={salePostDetailData.saleScript}
                        readOnly={true}
                    />
                    <div className='shopping-detail-page-purchase-btn-container'>
                        {/* 
                            owner=>true: 구매자면 다운로드 버튼 띄움. 구매자 아닌데, 판매 등록자거나 삭제된 게시물이면 구매하기 버튼x
                            즉, 구매자면 무조건 다운로드 버튼. 구매자 아님&&(판매 등록자||삭제된 게시물) => PurchaseBtn disabled
                            구매자도, 판매 등록자도, 삭제된 게시물도 아니라면 => PurchaseBtn Enabled

                            owner라면(상품 구매했다면, 즉 saleAndUserInfo.owner), [메인] 구매한 도안 미리보기 불러오기 호출해서, salePostDetailData.salePostId 가지고 purchasedPostId 찾아야 함..
                            그래야 SingleDownloadBtn 사용 가능
                            */}
                        {isOwner ? /* owner field는 따로 state로 관리하니 saleAndUserInfo에서 가져오면 안 됨 */
                            purchasedPostId ? 
                            <SingleDownloadBtn
                                salePostId={salePostDetailData.salePostId}
                                saleName={salePostDetailData.saleName}
                                id={purchasedPostId}
                            />
                            :
                            ''
                            :
                            (saleAndUserInfo.uploader || saleAndUserInfo.deleted) ?
                                <PurchasedBtn
                                    isEnabled={false}
                                    salePostId={salePostDetailData.salePostId}
                                    executeParentReRender={() => setIsOwner(true)}
                                    /* 구매하기 버튼 누르면, 부모parent의 isOwner state를 변경시켜 부모Parent를 re-rendering 시킴으로써 구매하기 버튼 -> 저장 버튼으로 변경되게끔 */
                                />
                                :
                                <PurchasedBtn
                                    isEnabled={true}
                                    salePostId={salePostDetailData.salePostId}
                                    executeParentReRender={() => setIsOwner(true)}
                                />
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}