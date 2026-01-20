import './ProductOnSalePreview.css';

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAccessToken, handleAuthError, getDesignDetailsAPI } from '../../utils/API.jsx';

export default function ProductOnSalePreview({ title, editor, price, img, salerNickname, salePostId }) {
    const [detailData, setDetailData] = useState([]);
    const navigate = useNavigate();

    async function callAPI() {
        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }
        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        const requestBody = { salePostId: salePostId, };

        const apiRes = await getDesignDetailsAPI(requestHeader, requestBody, 'PURCHASE'); // [쇼핑] 판매 등록 상세 내용 불러오기 (인자로 'PURCHASE' 줘야 함)
        console.log('api 결과: ', apiRes);
        if (apiRes) return apiRes; 

        else {
            alert('요청에 실패하였습니다. 다시 시도해 주세요.');
            return;
        }
    }

    async function handleProductOnSaleClick() {
        const data = await callAPI(); // data.salePostDetailData.salePostId~, data.saleAndUserInfo.uploader~
        navigate('/shopping-detail', {
            state: {
                salePostDetailData: data.salePostDetailData,
                saleAndUserInfo: data.saleAndUserInfo,
            }
        });
    }

    return (
        <div className='product-on-sale-preview-container'>
            <img className='product-on-sale-preview-img'
                onClick={handleProductOnSaleClick}
                src={img} alt='preview img'
            />
            <div className='product-on-sale-detail-info-wrapper'>
                <span className='product-on-sale-title'>{title}</span>
                <div className='product-on-sale-editor-and-price-wrapper'>
                    <span className='product-on-sale-editor'
                        onClick={() => navigate('/my-page', {
                            state: {
                                isOwner: false,
                                salerNickname: salerNickname,
                            }
                        })}
                    >edit.{editor}</span>
                    <span className='product-on-sale-price'>{Number(price).toLocaleString()}원</span>
                </div>
            </div>
        </div>
    );
}