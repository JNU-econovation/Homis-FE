import { useState, useEffect } from 'react';
import MenuBar from '../../components/Bar/MenuBar/MenuBar.jsx';
import FilterBar from '../../components/Bar/FilterBar/FilterBar.jsx';
import DesignSettingModal from '../../components/Modals/DesignSettingModal/DesignSettingModal.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import { getAccessToken, handleAuthError, designIMadeAPI, getDesignIMadeDetailAPI } from '../../utils/API.jsx';
import './MainPage.css';

export default function MainPage() {
    const [currentTab, setCurrentTab] = useState('all');
    const [currentData, setCurrentData] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();
    const locate = useLocation();

    const dummyData = [
        { madeDataId: 1, madeImgUrl: null }, { madeDataId: 2, madeImgUrl: null }, { madeDataId: 3, madeImgUrl: null },
        { madeDataId: 4, madeImgUrl: null }, { madeDataId: 5, madeImgUrl: null },
    ];

    // useEffect() 사용해서 currentTab 바뀔 때마다 다시 렌더링 하도록...
    // useEffect()의 첫 번째 인자: clean-up(or undefiend)을 반환하는 함수여야.. async 함수는 promise 반환하므로, 첫 인자로 async 함수 쓰면 X.
    // 해결책: async 함수를 실행하는 일반 함수를 생성하고, 그걸 인자로 전달
    useEffect(function () {
        async function fetchData() {
            let accessToken;
            try { accessToken = getAccessToken(); }
            catch (error) { handleAuthError(error, navigate); return; }
            const requestHeader = {
                'Authorization': `Bearer ${accessToken}`,
            };

            switch (currentTab) {
                case 'created':
                    const apiRes = await designIMadeAPI(requestHeader, setCurrentData);
                    // console.log('apiRes: ', apiRes);
                    // console.log('isArray?: ', Array.isArray(apiRes));
                    if (apiRes) {
                        apiRes.reverse(); // 최신순으로 보이기 위해 배열 뒤집음
                        setCurrentData(apiRes);
                    }
                    else {
                        alert('요청에 실패하였습니다. 다시 시도해 주세요.');
                        return;
                    }
                    break;

                case 'purchased':
                    setCurrentData(dummyData);
                    break;

                default:
                    setCurrentData(dummyData);
                    break;
            }
        }
        fetchData(); // 일반 함수 내에 async 함수를 정의하고, 일반 함수 내에서 async 함수(fetchData())를 실행함
    }, [currentTab]);

    /* 도안 클릭에 대한 이벤트 핸들러 */
    async function handleDesignClick(dataId) {
        if (!dataId) {
            alert('도안 ID가 존재하지 않습니다.');
            return;
        }

        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }
        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
        };
        const requestBody = {
            madeDataId: dataId,
        };

        switch (currentTab) {
            case 'all':
                break;
            case 'created':
                const apiRes = await getDesignIMadeDetailAPI(requestHeader, requestBody); // apiRes = { madeDataId: ..., ... }
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
                break;
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
                {currentData.map((item) => (
                    <div key={item.madeDataId} className='design-img-con'
                        onClick={() => handleDesignClick(item.madeDataId)}
                    >
                        <img className='main-page-img' src={item.madeImgUrl} alt='design img' /> { /* madeName: 도안 이름도 있지만, 아직 쓸 일 X */}
                    </div>
                ))}
            </div>
            <div className='menubar-con'>
                <MenuBar />
            </div>
        </div>
    );
}