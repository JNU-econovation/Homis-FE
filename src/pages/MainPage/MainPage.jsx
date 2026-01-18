import { useState, useEffect } from 'react';
import MenuBar from '../../components/Bar/MenuBar/MenuBar.jsx';
import FilterBar from '../../components/Bar/FilterBar/FilterBar.jsx';
import DesignSettingModal from '../../components/Modals/DesignSettingModal/DesignSettingModal.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAccessToken, handleAuthError, getDesignsForMainPageAPI, getDesignDetailsAPI } from '../../utils/API.jsx';
import './MainPage.css';
import DesignPreview from '../../components/DesignPreview/DesignPreview.jsx';

export default function MainPage() {
    const [currentTab, setCurrentTab] = useState('all');
    const [currentData, setCurrentData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

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
                    {isModalOpen &&
                        <DesignSettingModal onClick={() => setIsModalOpen(false)} />}
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
                                        executeReRender={fetchData}
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
                                        executeReRender={fetchData}
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
                                        executeReRender={fetchData}
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
        </div>
    );
}