import './UserSettingModal.css';

import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import logout_icon from '../../../assets/icons/Setting/logout_icon.png';
import logout_arrow_icon from '../../../assets/icons/Setting/logout_arrow_icon.png';
import { logoutAPI } from '../../../utils/API.jsx';

export default function UserSettingModal({ isOpen, onBackgroundClick }) {
    const navigate = useNavigate();
    const [hasOpened, setHasOpened] = useState(false);

    useEffect(function () { // isOpen이 true로 변경이 되는 순간, hasOpened를 true로 설정!
        if (isOpen) setHasOpened(true);
    }, [isOpen]);

    async function handleClickLogout() {
        const apiRes = await logoutAPI();
        // if (apiRes) {
        //     alert('로그아웃되었습니다.');
        //     localStorage.removeItem('accessToken');
        //     navigate('/login');
        // }
        alert('로그아웃되었습니다.');
        localStorage.removeItem('accessToken');
        navigate('/login');
        // 버튼 눌렸으면 성공하건 말건 그냥 무조건 로컬에 있는 토큰 지우고 로그인창으로 보내면 되는 거 아닌가..? => dd 마즘
    }

    return (
        <div className={`user-setting-modal-overlay ${isOpen ? 'open fade-in': (hasOpened ? 'fade-out':'')}`} onClick={onBackgroundClick}> { /* 모달 화면의 배경 누르면 -> 모달 내려감 */}
            { /*
         div overlay 내에 modal container도 포함돼 있어서, 이거 눌러도 모달 내려감
        => 클릭 이벤트는 e로 전달되는데, 해당 클릭 이벤트에 대해 stopPropagation() 수행하여 modal container에 대한 클릭을 무시함(정확하겐 부모에게 전달되는 걸 막음)
        자식(modal) 클릭 -> 부모(overlay)에게도 클릭됐음이 전달(자식을 누르는 게 곧 부모 누르는 것과 같기에)되는데, 이걸 막는 게 stopPropagation()
        */ }
        {/*
        <div className={`user-setting-modal-overlay ${isOpen ? 'open fade-in':'fade-out'}` 이대로 className 지정하면,
        최초 렌더링 시 isOpen: false이므로, fade-out className이 붙고, fade-out에 대한 동작이 수행되기에 마이페이지 켜면 fade-out이 바로 수행돼버림. slide-out도 같은 맥락..
        처음 페이지 열었을 때 fade-out 안 붙도록 조건을 줘야 함.
        과거에 모달창이 open된 적이 있는지를 관리하는 hasOpened state를 통해 구현.
        열렸던 전적이 있을 때만 fade-out을 붙임으로써, mypage 처음 들어왔을 때 fade-out, slide-out 발동되는 걸 억제시킴!
        */}
            <div className={`user-setting-modal-container ${isOpen ? 'slide-in': (hasOpened ? 'slide-out':'')}`} onClick={(e) => e.stopPropagation()}>
                <div className='user-setting-modal-horizontal-bar'></div>
                <div className='user-setting-modal-options'> { /* options div -> 확장 고려  */}
                    <div className='logout-option'>
                        <img className='logout-img'
                            src={logout_icon} alt='logout img'
                        />
                        <span className='logout-span' onClick={handleClickLogout}>로그아웃하기</span>
                        <button className='logout-arrow-img-btn'>
                            <img className='logout-arrow-img' onClick={handleClickLogout}
                                src={logout_arrow_icon} alt='logout img'
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}