import './DesignSettingModal.css';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CloseBtn from '../../Button/CloseBtn/CloseBtn.jsx';
import arrow_right_white from '../../../assets/icons/arrow/arrow_right_white.png';
import X_icon from '../../../assets/icons/XIcons/X.png';

function getKSTDate() {
    const now = new Date();
    const koreaTimeDiff = 9 * 60 * 60 * 1000;
    const kstDate = new Date(now.getTime() + koreaTimeDiff);

    return kstDate.toISOString().split('T')[0];
}

export default function DesignSettingModal({ onClick }) {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [size, setSize] = useState({ pixelSize: '' });

    function handleClickCreateDesign() {
        let finalName = name;

        if (!size.pixelSize) {
            alert('픽셀 크기를 입력해 주세요.');
            return;
        }

        if (!finalName) {
            const today = getKSTDate();
            finalName = `${today} 작성 도안`;
            setName(finalName); /* 화면 업데이트용. 딱히 필요 X */
        }

        navigate('/design', {
            state: {
                title: finalName,
                width: size.pixelSize,
                height: size.pixelSize,
            }
        });
    }

    return (
        <div className='design-modal-overlay'>
            <div className='design-modal-container'>
                <div className='modal-header'>
                    <div className='modal-title-con'>
                        <h2 className='modal-title'>Doa Edit</h2>
                    </div>
                    <div className='modal-close-btn-con'>
                        <CloseBtn link='/main' onClick={onClick} />
                    </div>
                </div>
                <div className='modal-body'>
                    <div className='design-modal-input-group'>
                        <div className='input-name-con'>
                            <span className='input-label'>제목</span>
                            <input
                                type='text'
                                className='modal-input for-title'
                                placeholder='제목을 입력하세요.'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        </div>
                        <div className='input-size-con'>
                            <span className='input-label'>크기</span>
                            <input
                                type='text'
                                className='modal-input for-size'
                                placeholder='10'
                                value={size.pixelSize}
                                onChange={(e) => setSize({ ...size, pixelSize: e.target.value })}
                            />
                            <img className='x-icon-between-pixel-size'
                                src={X_icon}
                            />
                            <input
                                type='text'
                                className='modal-input for-size'
                                placeholder='10'
                                value={size.pixelSize}
                                onChange={(e) => setSize({ ...size, pixelSize: e.target.value })}
                            />
                            <span className='unit-text'>px</span>
                            { /* 가로, 세로 입력X. 크기 하나로 통일 */}
                            {/* <span className='input-label height'>세로</span>
                        <input
                            type='text'
                            className='modal-input for-size'
                            placeholder='123'
                            value={size.height}
                            onChange={(e) => setSize({ ...size, height: e.target.value })}
                        />
                        <span className='unit-text'>px</span> */}
                        </div>
                    </div>
                </div>
                <div className='modal-footer'>
                    <button className='create-design-btn' onClick={handleClickCreateDesign}>
                        도안 만들기 <img className='arrow-btn' src={arrow_right_white} alt='도안 만들기 화살표 버튼' />
                    </button>
                </div>
            </div>
        </div>
    );
}