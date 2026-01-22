import './DesignPreview.css';
import X_icon from '../../assets/icons/XIcons/X_white.png';

import { useState, useEffect, useRef } from 'react';
import { getAccessToken, handleAuthError, deleteDesignsAPI } from '../../utils/API.jsx';
import { motion, AnimatePresence } from 'framer-motion';

const LONG_PRESS_TIME = 1500; // ms
const MOVE_TOLERANCE = 5; // px; long press 시 용인되는 움직임

export default function DesignPreview({ type, designData, onDesignClick, onDeleteRequest/*executeReRender*/ }) {
    const [isActive, setIsActive] = useState(false);
    const [isLongPressed, setIsLongPressed] = useState(false);

    const timerRef = useRef(null); // 타이머 ref
    const startPositionRef = useRef({ x: 0, y: 0 }); // 시작 좌표 ref
    const isLongPressTriggered = useRef(false); // 지금 누른 게 롱 프레스면, onClick 동작 안 하도록 하기 위한 ref.
    // ref로 써야 함. state로 관리하면 매번 re-rendering 수행되기에.. ref는 렌더링 없이 즉시 반응하자나

    function startPress(e) {
        clear(); // 기존에 타이머 있는 거 다 없애고! (상세 설명은 notion 확인)
        isLongPressTriggered.current = false; // 일단 클릭 시작되면 long press 아니라고 설정
        startPositionRef.current = { x: e.clientX, y: e.clientY, }; // 누른 위치 기록
        timerRef.current = setTimeout(() => { // 시간 측정 시작
            setIsLongPressed(true);
            isLongPressTriggered.current = true; // 일정 시간동안 클릭됐다? => Triggered를 true로! -> 지금 click이 long press니까 onClick은 동작하지 말라! 
        }, LONG_PRESS_TIME); // setTimeout => 첫 번째 인자: callback func, 두 번째 인자: duration. => duration 지난 이후에 callback 수행
    }

    function clear() {
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }

    function onPositionMove(e) {
        const dx = Math.abs(e.clientX - startPositionRef.current.x); // x축 변화량
        const dy = Math.abs(e.clientY - startPositionRef.current.y); // y

        if (dx > MOVE_TOLERANCE || dy > MOVE_TOLERANCE) clear(); // 일정 px 이상 움직이면 타이머 초기화
    }

    const title = designData.madeName
        || designData.title
        || designData.saleName;

    function handleClick() {
        if (isLongPressTriggered.current) return; // 이번 클릭이 long press였다 -> 걍 return
        if (isActive) onDesignClick(); // 오버레이어 활성화 상태인데 클릭됐다? => 부모가 준 함수 실행 -> 상세 페이지로 이동됨
        else setIsActive(true); // 활성화 안 된 상태인데 클릭? => 오버레이어 상태인 isActive를 true로 set
    }

    useEffect(function () {
        if (isActive) // 오버레이어가 활성화 상태면?
            setTimeout(() => setIsActive(false), 2700); // 2.7초 뒤에 setIsActive(false) 수행해서 오버레이어 내림
        // 디졸브in, out 각 600ms, 유지 1500ms => 2700ms
    }, [isActive])

    let editor;
    if (type === 'PURCHASE' || designData.type === 'PURCHASE')
        editor = designData.original_uploader_nickname
            || designData.salerNickname;

    const image = designData.madeImgUrl
        || designData.thumbnailUrl
        || designData.saleThumbnailImgUrl;


    // 실질적인 삭제 로직들은 부모로! 삭제 확인하는 모달창 띄우기 위해
    // async function callAPI(requestHeader, params) {
    //     const apiRes = await deleteDesignsAPI(type, requestHeader, params);
    //     if (apiRes) {
    //         alert('삭제되었습니다.');
    //         executeReRender(); // 삭제한 이후에 부모page(main-page) re-rendering
    //     }
    // }

    // async function handleClickDelete() {
    //     let accessToken;
    //     try { accessToken = getAccessToken(); }
    //     catch (error) { handleAuthError(error, navigate); return; }
    //     const requestHeader = {
    //         'Authorization': `Bearer ${accessToken}`,
    //     };
    //     let params;
    //     if (type === 'MADE') params = { madeDataId: designData.id || designData.madeDataId, }; // currentTab이 all일 경우, id가 madeDataId
    //     else if (type === 'PURCHASE') params = { purchasedPostId: designData.id || designData.purchasedPostId, }; // 얜 id가 purchasedPostId
    //     await callAPI(requestHeader, params);
    // }

    return (
        <div className={`design-preview-container ${isLongPressed ? 'long-pressed' : ''}`} onClick={!isLongPressed ? handleClick : undefined} // x 버튼 안 떴을 때만 onClick 핸들러 지정
            onPointerDown={startPress}
            onPointerMove={onPositionMove}
            onPointerUp={clear} // 떼지면 clear
            onPointerLeave={clear} // 포인터가 해당 div에서 나가도 clear
            onPointerCancel={clear}
        > { /* {...onLongPress()} => 롱 프레스 이벤트 연결 */}
            <AnimatePresence>
                {isLongPressed &&
                    <motion.div
                        className='container-for-x-img'
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ ease: 'easeIn', duration: 0.3, }}
                    >
                        <img className={`design-delete-img`}
                            // onClick={handleClickDelete} // X 버튼 클릭 -> 확인하는 모달창이 띄워져야 함. 즉, onClick에 삭제 로직 수행하는 핸들러 지정 X
                            onClick={onDeleteRequest}
                            src={X_icon} alt='delete img'
                        />
                    </motion.div>
                }
                {isLongPressed && // LongPressed -> X 아이콘 뜸 -> X 아이콘 없애려면 화면 다른 곳 터치해야.. -> 이를 구현하기 위한 투명막을 배치
                    <motion.div className='design-preview-cover'
                        onClick={(e) => {
                            e.stopPropagation(); // 부모에게 이벤트가 전달되지 않도록
                            setIsLongPressed(false); // state를 false로 설정하여 X 사라지게! -> re-rendering 됨
                            isLongPressTriggered.current = false; // ref 초기화 해줌
                        }}
                        initial={{ opacity: 0 }} /* 초기 상태: 초기엔 불투명도 0으로, 아예 안 보이게 */
                        animate={{ opacity: 1 }} /* 등장 후 최종 모습: 애니메이션 끝났을 땐 1로, 완전 보여야 함 */
                        exit={{ opacity: 0 }} /* 사라질 때의 목표 상태: 사라졌을 땐 아예 안 보여야 되니 불투명도 0으로 */
                        transition={{ ease: 'easeIn', duration: 0.3, }} /* 위에서 지정한 opacity 값을 easeIn 방식으로 duration 동안 수행 */
                    />
                }
            </AnimatePresence>
            <div className={`container-for-design-img ${isLongPressed ? 'long-pressed' : ''}`}>
                <img className={`design-preview-img ${type === 'PURCHASE' ? 'purchase' : ''} ${isLongPressed ? 'long-pressed' : ''}`} /* 삭제 api는 여기에다가 붙여라 실제 img에다가 */
                    src={image} alt='design img'
                />
                {isActive &&
                    <div className={`container-for-overlayer ${isActive ? 'active' : ''}`}>
                        <span className='design-preview-title'>{title}</span>
                        {type === 'PURCHASE' ?
                            <span className='design-preview-editor'>edit.{editor}</span>
                            :
                            ''
                        }
                    </div>
                }
            </div>
        </div>
    );
}