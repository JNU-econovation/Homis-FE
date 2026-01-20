import './PurchaseBtn.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getAccessToken, handleAuthError, purchaseDesignAPI } from '../../../utils/API.jsx';
import LoadingModal from '../../Modals/LoadingModal/LoadingModal.jsx';

// isEnabled True: btn activated |  False: btn inactivated
export default function PurchaseBtn({ isEnabled, salePostId, executeParentReRender }) {
    const navigate = useNavigate();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [purchaseProgress, setPurchaseProgress] = useState(0);

    console.log('isEnabled: ', isEnabled, 'salePostId: ', salePostId);

    async function callAPI(requestHeader, requestBody) {
        const apiRes = await purchaseDesignAPI(requestHeader, requestBody, setPurchaseProgress);
        if (apiRes) setIsModalOpen(true);
    }

    async function handleClick() {
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
        await callAPI(requestHeader, requestBody);
    }
    return (
        <div className='purchase-btn-container'>
            <button className={isEnabled ? 'purchase-btn activated' : 'purchase-btn inactivated'}
                disabled={!isEnabled}
                onClick={handleClick}
            >구매하기</button>

            {isModalOpen &&
                <LoadingModal
                    text={'도안 구매 중'}
                    progress={purchaseProgress}
                    isPurchase={true}
                    completeText={'구매 완료!'}
                    onClose={() => {
                        setIsModalOpen(false); // 모달 닫고,
                        executeParentReRender(); // 구매하기 버튼 눌렀으니, 부모parent의 isOwner state를 변경시켜 부모Parent를 re-rendering 시킴으로써 구매하기 버튼 -> 저장 버튼으로 변경되게끔
                    }}
                />
            }
        </div>
    );
}