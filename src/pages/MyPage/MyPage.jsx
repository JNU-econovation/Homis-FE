import './MyPage.css';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getAccessToken, handleAuthError, getMyStorePreviewAPI } from '../../utils/API.jsx';
import UserSettingModal from '../../components/Modals/UserSettingModal/UserSettingModal.jsx';
import WheelBtn from '../../components/Button/WheelBtn/WheelBtn.jsx';
import sample_profile_img from '../../assets/sample/sample-design-img.png';
import MenuBar from '../../components/Bar/MenuBar/MenuBar.jsx';
import UserProfile from '../../components/UserProfile/UserProfile.jsx';
import ProductUploadBox from '../../components/Item/ProductUploadBox/ProductUploadBox.jsx';
import UploadedProductPreview from '../../components/UploadedProductPreview/UploadedProductPreview.jsx';
import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';

export default function MyPage() {
    const locate = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentData, setCurrentData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    const [deleteOpenedId, setDeleteOpenedId] = useState(null); /* 어느 상품에서 삭제하기 버튼이 열려 있는지 관리하기 위한 state */

    const { isOwner = true, salerNickname = null } = locate.state || {};

    async function callAPI(requestHeader) {
        const apiRes = await getMyStorePreviewAPI(isOwner, requestHeader, salerNickname);
        if (apiRes) setCurrentData(apiRes); // isOwner: currentData.userStoreItems[i].saleThumbnailImgUrl | currentData.userProfile.userNickname ~
        else {
            alert('요청에 실패하였습니다. 다시 시도해 주세요.');
            return;
        }
    }

    /* isOwner에 따라 반환되는 데이터의 key값이 달라서 일반화시키기 위한 변수. currentData 변경 -> 매번 렌더링 -> 그에 따라 finalData 값도 초기화 됨 */
    const finalData = currentData ? (
        isOwner ? { items: currentData.userStoreItems, profile: currentData.userProfile, }
            :
            { items: currentData.salerStoreItems, profile: currentData.salerProfile, })
        :
        null;

    async function fetchData() { // UploadedProductPreview의 props로 전달해야 하니 useEffect 내부에서 정의X
        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }
        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
        };

        await callAPI(requestHeader);
        setIsLoading(false);
    }

    useEffect(function () {
        setIsLoading(true);
        fetchData();
    }, []); // dependency array 없어도 됨. 그냥 화면 초기에만 실행하면 되니까

    return (
        <div className='my-page-container'> { /* 다른 곳 클릭하면 삭제하기 버튼은 사라지게! */}
            {deleteOpenedId && (
                <div className='my-page-cover' /* 삭제하기 버튼 띄웠을 때 모든 페이지를 커버하는 얘. 즉, 투명막. 페이지 어떤 곳을 클릭하더라도 삭제하기 없앨 수 있도록 */
                    onClick={() => setDeleteOpenedId(null)}
                />
            )}
            <div className='my-page-header'>
                {/* <div className='my-page-backbtn-container'>
                    <BackBtn />
                </div> */}
                {!isOwner && // 타인 스토어일 때만 뒤로가기 버튼 있음 
                    <div className='my-page-backbtn-container'>
                        <BackBtn link='-1' />
                    </div>
                }
                <div className={`wheel-btn-container ${!isOwner ? 'other-user' : ''}`}>
                    <WheelBtn
                        onClick={() => setIsModalOpen(true)}
                    />
                </div>
                { /* 
                fade-in-out 적용하려면 isModalOpen: true or false값으로 컴포넌트 렌더링 해선 안 됨. 이 true, false값을 modal component에 넘겨주고, 
                해당 true, false에 맞게 opacity 적절하게 주면 됨 
                */ }
                {/* {isModalOpen && 
                    <UserSettingModal
                        onBackgroundClick={() => setIsModalOpen(false)}
                    />
                } */}
                <UserSettingModal
                    isOpen={isModalOpen}
                    onBackgroundClick={() => setIsModalOpen(false)}
                />
            </div>
            <div className='my-page-body'>
                {!isLoading &&
                    <>
                        <div className='profile-and-nickname-wrapper'>
                            <UserProfile
                                profileImg={finalData.profile.userProfileImgUrl}
                                nickname={finalData.profile.userNickname}
                            />
                        </div>
                        <div className='product-preview-container'>
                            {isOwner && <ProductUploadBox />}
                            {[...finalData.items].reverse().map((item) =>
                                <div key={item.salePostId} className={`upload-product-img-con ${deleteOpenedId === item.salePostId ? 'active' : ''}`}>
                                    <UploadedProductPreview
                                        product={item}
                                        onThreeDotsClick={(e) => {
                                            e.stopPropagation(); // 점3개 누름 -> 부모에게도 이벤트 전달이 됨 -> 상세페이지로 이동됨.. 즉, 부모에게 이벤트 전달 막음
                                            setDeleteOpenedId(deleteOpenedId === item.salePostId ? null : item.salePostId);
                                            // 점3 클릭돼 있는 게 또 눌렸다? 즉, 누른 디자인 사진에서 이미 열려있었다면? => null 넣어서 삭제하기 내림
                                            // 점3 클릭 안 된 거 눌렀다? => 삭제하기 열린 건 이제 해당 컴포넌트가 됨
                                        }}
                                        isOpen={deleteOpenedId === item.salePostId} // true: 삭제하기 열려있음을 의미. 이걸 이용해서 자식 컴포넌트에서 삭제하기 버튼을 렌더링 함
                                        onDeleteSuccess={fetchData} // 삭제api 호출 성공?: 삭제한 디자인은 더 이상 띄우면 안 됨. -> fetchData 다시 수행해서, api 다시 호출하고 삭제 적용된 data를 가져와서 렌더링
                                        isOwner={isOwner}
                                    />
                                </div>
                            )}
                        </div>
                    </>
                }
            </div>
            {isOwner &&
                <div className='my-page-footer'>
                    {!isModalOpen &&
                        <MenuBar />
                    }
                </div>
            }
        </div>
    );
}