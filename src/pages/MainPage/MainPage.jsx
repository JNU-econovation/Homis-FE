import { useState, useEffect } from 'react';
import MenuBar from '../../components/Bar/MenuBar/MenuBar.jsx';
import FilterBar from '../../components/Bar/FilterBar/FilterBar.jsx';
import DesignSettingModal from '../../components/Modals/DesignSettingModal/DesignSettingModal.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAccessToken, handleAuthError, getDesignsForMainPageAPI, getDesignDetailsAPI, deleteDesignsAPI } from '../../utils/API.jsx';
import './MainPage.css';
import DesignPreview from '../../components/DesignPreview/DesignPreview.jsx';
import DeleteConfirmModal from '../../components/Modals/DeleteConfirmModal/DeleteConfirmModal.jsx';
import { motion, AnimatePresence } from 'framer-motion';

export default function MainPage() {
    const [currentTab, setCurrentTab] = useState('all');
    const [currentData, setCurrentData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState({ type: null, id: null, }); // X 버튼 눌렀을 때 뭘 지울지 저장하기 위한 state. 뭐 지울지에 대한 data는 자식에게 있으니 자식에게 set 넘겨줘야..
    const navigate = useNavigate();
    const locate = useLocation();

    // const dummyData = [
    //     { madeDataId: 1, madeImgUrl: null }, { madeDataId: 2, madeImgUrl: null }, { madeDataId: 3, madeImgUrl: null },
    //     { madeDataId: 4, madeImgUrl: null }, { madeDataId: 5, madeImgUrl: null },
    // ];

    // useEffect() 사용해서 currentTab 바뀔 때마다 다시 렌더링 하도록...
    // useEffect()의 첫 번째 인자: clean-up(or undefiend)을 반환하는 함수여야.. async 함수는 promise 반환하므로, 첫 인자로 async 함수 쓰면 X.
    // 해결책: async 함수를 실행하는 일반 함수를 생성하고, 그걸 인자로 전달

    async function callAPI(requestHeader, currentTab) {
        const apiRes = await getDesignsForMainPageAPI(requestHeader, currentTab);
        if (apiRes) {
            // apiRes.reverse();
            // setCurrentData(apiRes);
            setCurrentData([...apiRes].reverse()); // 원본 보존
        }
        else {
            alert('요청에 실패하였습니다. 다시 시도해 주세요.');
            return;
        }
    }

    async function fetchData() { // props로 넘겨주기 위해 useEffect에서 빼냄
        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }
        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
        };

        switch (currentTab) {
            case 'all':
            case 'created':
            case 'purchased': {
                await callAPI(requestHeader, currentTab);
                break;
            }
        }
        setIsLoading(false);
    }

    useEffect(function () {
        // tab 변경 -> re-rendering -> api 응답 오기 전까지 currentData엔 이전 값이 들어가 있어서, 화면에 잠깐 보임
        // 이를 방지하기 위해 tab 바뀔 때마다 currentData를 초기화
        setIsLoading(true);
        setCurrentData([]);

        fetchData(); // 일반 함수 내에 async 함수를 정의하고, 일반 함수 내에서 async 함수(fetchData())를 실행함
    }, [currentTab]);

    /* 내가 만든 도안을 클릭한 경우 */
    async function onMadeTypeClick(accessToken, dataId) {
        if (!dataId) {
            alert('도안 ID가 존재하지 않습니다.');
            return;
        }
        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
        };
        const requestBody = {
            madeDataId: dataId,
        };
        const apiRes = await getDesignDetailsAPI(requestHeader, requestBody, 'MADE'); // apiRes = { madeDataId: ..., ... }
        if (apiRes) {
            navigate('/my-design-detail', {
                state: {
                    madeDataId: apiRes.madeDataId,
                    madeImgUrl: apiRes.madeImgUrl,
                    madeDetail: apiRes.madeDetail,
                    madeName: apiRes.madeName,
                }
            });
        }
        else {
            alert('요청에 실패하였습니다. 다시 시도해 주세요.');
            return;
        }
    }

    /* 구매한 도안을 클릭한 경우 */
    async function onPurchaseTypeClick(accessToken, salePostId, id) {
        if (!salePostId) {
            alert('판매 게시글이 존재하지 않습니다.');
            return;
        }
        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        const requestBody = {
            salePostId: salePostId,
        };

        const apiRes = await getDesignDetailsAPI(requestHeader, requestBody, 'PURCHASE');
        if (apiRes) {
            navigate('/purchased-design-detail', {
                state: {
                    salePostDetailData: apiRes.salePostDetailData,
                    saleAndUserInfo: apiRes.saleAndUserInfo,
                    id: id,
                }
            });
        }
        else {
            alert('요청에 실패하였습니다. 다시 시도해 주세요.');
            return;
        }
    }

    /* 도안 클릭에 대한 이벤트 핸들러 */
    function handleDesignClick(type, dataId, id) {
        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }

        if (type === 'MADE') {
            onMadeTypeClick(accessToken, dataId);
        }

        else if (type === 'PURCHASE') {
            // console.log(dataId);
            onPurchaseTypeClick(accessToken, dataId, id);
        }
    }

    /* 도안 삭제에 대한 핸들러들 */
    function handleRequestDelete(type, id) {
        setDeleteTarget({ type: type, id: id, });
        setIsConfirmModalOpen(true);
    }

    async function callDeleteAPI(requestHeader, params) {
        const apiRes = await deleteDesignsAPI(deleteTarget.type, requestHeader, params);
        if (apiRes) {
            // alert('삭제되었습니다.');
            // executeReRender(); // 삭제한 이후에 부모page(main-page) re-rendering
            setIsConfirmModalOpen(false);
            fetchData();
        }
    }

    async function handleClickRealDelete() {
        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }
        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
        };
        let params;
        if (deleteTarget.type === 'MADE') params = { madeDataId: deleteTarget.id || deleteTarget.madeDataId, }; // currentTab이 all일 경우, id가 madeDataId
        else if (deleteTarget.type === 'PURCHASE') params = { purchasedPostId: deleteTarget.id || deleteTarget.purchasedPostId, }; // 얜 id가 purchasedPostId
        await callDeleteAPI(requestHeader, params);
    }
    <AnimatePresence>
        {isConfirmModalOpen &&
            <motion.div className='confirm-modal-con'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ ease: 'easeIn', duration: 0.3 }}
            >
                <DeleteConfirmModal
                    onClick={(e) => handleClickRealDelete(e)}
                    onCloseClick={() => setIsConfirmModalOpen(false)}
                />
            </motion.div>
        }
    </AnimatePresence>

    return (
        <div className='mypage-con'>
            <div className='main-page-header'>
                <div className='filter-bar'>
                    <FilterBar
                        currentTab={currentTab}
                        onTabChange={setCurrentTab}
                    />
                </div>
                <div className='edit-con'>
                    <button className='edit-btn' onClick={() => setIsModalOpen(true)}>+Edit</button>
                    <AnimatePresence>
                        {isModalOpen &&
                            <motion.div className='design-setting-modal-con'
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ ease: 'easeIn', duration: 0.3 }}
                            >
                                <DesignSettingModal onClick={() => setIsModalOpen(false)} />
                            </motion.div>
                        }
                    </AnimatePresence>
                </div>
            </div>
            <div className='designs-con'>
                {!isLoading &&
                    <> { /* 
                        isLoading true => currentData에 현재 tab에 대한 data가 저장되지 않음 -> 렌더링X
                        currentData.length가 0 이하 => 현재 tab에 대한 data가 아니거나, 진짜 데이터가 없는 거니까 렌더링X
                        currentData[0].field => 각 tab에 대해 반환되는 data의 field가 없다면 현재 tab에 대한 data가 아니므로 렌더링X
                        */
                    }
                        {currentTab === 'created' && currentData.length > 0 && currentData[0].madeDataId &&
                            currentData.map((item) =>
                                <div key={`MADE-${item.madeDataId}`} className='design-img-con'>
                                    <DesignPreview
                                        type='MADE'
                                        designData={item}
                                        onDesignClick={() => handleDesignClick('MADE', item.madeDataId,)}
                                        // executeReRender={fetchData} // 필요없음 이제. 부모에서 삭제 후 결과 반영 위해 re-rendering 하면 되니까
                                        onDeleteRequest={() => handleRequestDelete('MADE', item.madeDataId,)} // X 버튼 클릭했을 때, 해당 컴포넌트의 TYPE과 madeDataId를 state에 저장
                                    />
                                </div>
                            )
                            // currentData.map((item) => (
                            //     <div key={`MADE-${item.madeDataId}`} className='design-img-con' // 각 타입마다 id: 1~ -> key 중복 가능 -> type - id 구조로 key 설정
                            //         onClick={() => handleDesignClick('MADE', item.madeDataId, )}
                            //     >
                            //         <img className='main-page-img' src={item.madeImgUrl} alt='design img' /> { /* madeName: 도안 이름도 있지만, 아직 쓸 일 X */}
                            //     </div>
                            // ))
                        }
                        {currentTab === 'all' && currentData.length > 0 && currentData[0].type &&
                            currentData.map((item) =>
                                <div key={`${item.type}-${item.id}`} className='design-img-con'>
                                    <DesignPreview
                                        type={item.type === 'MADE' ? 'MADE' : item.type === 'PURCHASE' ? 'PURCHASE' : ''}
                                        designData={item}
                                        onDesignClick={() => {
                                            if (item.type === 'MADE') handleDesignClick(item.type, item.id); // MADE 타입이면 id 넘겨주면 됨
                                            else if (item.type === 'PURCHASE') handleDesignClick(item.type, item.original_post_id, item.id);
                                        }}
                                        // executeReRender={fetchData}
                                        onDeleteRequest={() => {
                                            if (item.type === 'MADE') handleRequestDelete('MADE', item.id);
                                            else if (item.type === 'PURCHASE') handleRequestDelete('PURCHASE', item.id); // id가 purchasedPostId. 이게 삭제에 필요한 data
                                        }}
                                    />
                                </div>
                            )
                            // currentData.map((item) => (
                            //     <div key={`${item.type}-${item.id}`} className='design-img-con'
                            //         onClick={() => {
                            //             if (item.type === 'MADE') handleDesignClick(item.type, item.id); // MADE 타입이면 id 넘겨주면 됨
                            //             else if(item.type === 'PURCHASE') handleDesignClick(item.type, item.original_post_id, item.id); // PURCHASE 타입이면 판매 원본 게시글 id 넘김
                            //         }}
                            //     >
                            //         <img className='main-page-img' src={item.thumbnailUrl} alt='design img' />
                            //     </div>
                            // ))
                        }
                        {currentTab === 'purchased' && currentData.length > 0 && currentData[0].purchasedPostId &&
                            currentData.map((item) =>
                                <div key={`PURCHASE-${item.purchasedPostId}`} className='design-img-con'>
                                    <DesignPreview
                                        type='PURCHASE'
                                        designData={item}
                                        onDesignClick={() => handleDesignClick('PURCHASE', item.salePostId, item.purchasedPostId)}
                                        // executeReRender={fetchData}
                                        onDeleteRequest={() => handleRequestDelete('PURCHASE', item.purchasedPostId)} // 삭제에 필요한 건 purchasedPostId
                                    />
                                </div>
                            )
                            //     currentData.map((item) => (
                            //         <div key={`PURCHASE-${item.purchasedPostId}`} className='design-img-con'
                            //             onClick={() => handleDesignClick('PURCHASE', item.salePostId, item.purchasedPostId)} /* 구매한 도안 미리보기 불러오기 API 참고 */
                            //         >
                            //             <img className='main-page-img' src={item.saleThumbnailImgUrl} alt='design img' />
                            //         </div>
                            //     ))
                        }
                    </>
                }
            </div>
            <div className='menubar-con'>
                <MenuBar />
            </div>
            <AnimatePresence>
                {isConfirmModalOpen &&
                    <motion.div className='confirm-modal-con'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: 'easeIn', duration: 0.3 }}
                    >
                        <DeleteConfirmModal
                            onClick={handleClickRealDelete}
                            onCloseClick={() => setIsConfirmModalOpen(false)}
                        />
                    </motion.div>
                }
            </AnimatePresence>
        </div>
    );
}