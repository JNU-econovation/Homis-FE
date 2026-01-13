import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import loading_gif from '../../../assets/gif/loading/loading.gif';
import V_icon from '../../../assets/icons/VIcons/V.png';
import './LoadingModal.css';

export default function LoadingModal({ text, progress = 0 }) {
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [isFading, setIsFading] = useState(false);
    const navigate = useNavigate();

    useEffect(function () {
        if (progress === 100) {
            // setTimeout() -> Notion
            setTimeout(() => {
                setShowSuccessModal(true); // 1.5초 동안 100% 화면 보여줬다가, 저장 완료 화면 띄움
                setTimeout(() => {
                    setIsFading(true); // 1.2초 동안 저장 완료 화면 보여줬다가, fade-out 발동
                    setTimeout(() => {
                        // navigate('/main'); // fade-out 시간인 0.2s 기다렸다가 추가로 0.3s 기다리고 main으로 이동 -> 여기서 main으로 이동하면 실패해도 이동되니 주석 처리
                        return;
                    }, 500)
                }, 1200)
            }, 1500)
        }
    }, [progress]);

    return (
        <div className='loading-modal-overlay'>
            <div className={`loading-modal-container ${isFading ? 'fade-out' : ''}`}>
                {showSuccessModal ?
                    /* progress가 100일 때 (저장 완료) */
                    <div className='complete-container'>
                        <img className='success-img'
                            src={V_icon} alt='success img' />
                        <span className='success-text'>저장 완료!</span>
                    </div>
                    :
                    /* progress가 0이 아닐 때 (저장 중) */
                    <div className='loading-container'>
                        <div className='img-and-percentage-wrapper'>
                            <img className='loading-gif'
                                src={loading_gif} alt='로딩' />
                            <span className='progress-percentage'>{progress}%</span>
                        </div>
                        <div className='loading-modal-text-container'>
                            <span className='doing-what'>{text}</span>
                            <span className='please-wait'>잠시만 기다려주세요!</span>
                        </div>
                    </div>
                }
            </div>
        </div>
    );
}