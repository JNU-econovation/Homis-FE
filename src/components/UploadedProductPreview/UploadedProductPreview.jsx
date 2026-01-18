import './UploadedProductPreview.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import three_dots_icon from '../../assets/icons/Setting/three_dots.png';
import { getAccessToken, handleAuthError, deleteUploadedProductAPI } from '../../utils/API.jsx';

export default function UploadedProductPreview({ product, isOpen, onThreeDotsClick, onDeleteSuccess }) {
    const navigate = useNavigate();

    async function handleClickDelete(event) {
        event.stopPropagation(); // 상세페이지 이동X

        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }
        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
        };
        const requestBody = {
            salePostId: product.salePostId,
        };

        await callAPI(requestHeader, requestBody);
    }

    async function callAPI(requestHeader, requestBody) {
        const apiRes = await deleteUploadedProductAPI(requestHeader, requestBody);
        if (apiRes)
            onDeleteSuccess(); // 부모로부터 전달된 prop 함수 실행시켜 부모 re-rendering함으로써 삭제된 이후의 결과를 띄움
        else {
            alert('요청에 실패하였습니다. 다시 시도해 주세요.');
            return;
        }
    }

    return (
        <div className='uploaded-product-preview' onClick={() => // 사진 누르면 상세페이지로 넘어가는 핸들러
            navigate('/uploaded-product-detail', {
                state: { salePostId: product.salePostId }
            }
            )}>
            <div className='three-dots-container'>
                <button className='three-dots-btn' onClick={onThreeDotsClick}>
                    <img className='three-dots-img'
                        src={three_dots_icon}
                    />
                    {isOpen &&
                        <div className='uploaded-product-delete-span-container'>
                            <span className='uploaded-product-delete-span'
                                onClick={(e) => handleClickDelete(e)}
                            >삭제하기</span>
                        </div>
                    }
                </button>
            </div>
            <img className='uploaded-product-img'
                src={product.saleThumbnailImgUrl} alt='preview img'
            />
        </div>
    );
}