import './UploadedProductPreview.css';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import three_dots_icon from '../../assets/icons/Setting/three_dots.png';
import { getAccessToken, handleAuthError, deleteUploadedProductAPI } from '../../utils/API.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function UploadedProductPreview({ product, isOpen, onThreeDotsClick, isOwner, onDeleteRequest/*onDeleteSuccess,*/  }) {
    const navigate = useNavigate();

    // 진짜 삭제할 건지 묻는 모달창 띄우기 위해 전부 다 부모로 이동
    // async function handleClickDelete(event) {
    //     event.stopPropagation(); // 상세페이지 이동X

    //     let accessToken;
    //     try { accessToken = getAccessToken(); }
    //     catch (error) { handleAuthError(error, navigate); return; }
    //     const requestHeader = {
    //         'Authorization': `Bearer ${accessToken}`,
    //     };
    //     const requestBody = {
    //         salePostId: product.salePostId,
    //     };

    //     await callAPI(requestHeader, requestBody);
    // }

    // async function callAPI(requestHeader, requestBody) {
    //     const apiRes = await deleteUploadedProductAPI(requestHeader, requestBody);
    //     if (apiRes)
    //         onDeleteSuccess(); // 부모로부터 전달된 prop 함수 실행시켜 부모 re-rendering함으로써 삭제된 이후의 결과를 띄움
    //     else {
    //         alert('요청에 실패하였습니다. 다시 시도해 주세요.');
    //         return;
    //     }
    // }

    return (
        <div className='uploaded-product-preview' onClick={() => // 사진 누르면 상세페이지로 넘어가는 핸들러
            navigate('/uploaded-product-detail', {
                state: { salePostId: product.salePostId, isOwner: isOwner }
            }
            )}>
            <div className={`three-dots-container ${!isOwner ? 'other-user' : ''}`}>
                <button className='three-dots-btn' onClick={onThreeDotsClick}>
                    <img className='three-dots-img'
                        src={three_dots_icon}
                    />
                    <AnimatePresence>
                        {isOpen &&
                            <motion.div className='uploaded-product-delete-span-container'
                                // onClick={(e) => handleClickDelete(e)} // 삭제하기 클릭 -> 확인하는 모달창이 띄워져야 함. 즉, onClick에 삭제 로직 수행하는 핸들러 지정 X
                                onClick={(e) => {
                                    e.stopPropagation(); // 상세페이지 안 가게
                                    onDeleteRequest();
                                }}
                                initial={{ opacity: 0 }} /* 초기 상태: 초기엔 불투명도 0으로, 아예 안 보이게 */
                                animate={{ opacity: 1 }} /* 등장 후 최종 모습: 애니메이션 끝났을 땐 1로, 완전 보여야 함 */
                                exit={{ opacity: 0 }} /* 사라질 때의 목표 상태: 사라졌을 땐 아예 안 보여야 되니 불투명도 0으로 */
                                transition={{ ease: 'easeIn', duration: 0.3, }} /* 위에서 지정한 opacity 값을 easeIn 방식으로 duration 동안 수행 */
                            >
                                <span className='uploaded-product-delete-span'
                                >삭제하기</span>
                            </motion.div>
                        }
                    </AnimatePresence>
                </button>
            </div>
            <img className='uploaded-product-img'
                src={product.saleThumbnailImgUrl} alt='preview img'
            />
        </div>
    );
}