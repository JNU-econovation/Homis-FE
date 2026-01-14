import './SaveDetailPage.css';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';
import { getAccessToken, handleAuthError, SaveDesignAPI } from '../../utils/API.jsx';
import LoadingModal from '../../components/Modals/LoadingModal/LoadingModal.jsx';

export default function SaveDetailPage() {
    const [description, setDescription] = useState('');
    const locate = useLocation();
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);

    const { designImg, designImgForAPI, title, gridData, width, height, history, future } = locate.state || {}; // navigate 하면서 전달된 값들

    function handleGoBackWithData() {
        navigate('/design', {
            state: {
                gridData: gridData,
                width: width,
                height: height,
                title: title,
                history: history,
                future: future,
            }
        });
    }

    async function handleSaveClick() {
        if (!description) {
            alert('상세 설명을 작성해 주세요.');
            return;
        }

        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }

        const requestBody = {
            madeName: title,
            size: parseInt(width),
            designImg: designImgForAPI,
            script: description,
        }
        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };

        // console.log(requestBody);
        // console.log(requestHeader);

        setIsLoading(true); // 로딩 모달 띄우기

        const apiRes = await SaveDesignAPI(requestBody, requestHeader, setUploadProgress);
        if (apiRes) navigate('/main');
        else setIsLoading(false); // 저장 실패 => 로딩 모달 내림
    }

    return (
        <div className={`save-detail-page-container`}>
            <div className='save-detail-page-header'>
                <BackBtn link='-1'
                    onClick={handleGoBackWithData}
                /> { /* navigate(-1) => 이전 페이지로 이동 */}
            </div>
            <div className='save-detail-page-body'>
                <div className='design-image-background'>
                    <div className='design-image-con'>
                        <img className='design-image'
                            src={designImg} alt='도안 이미지'
                        />
                    </div>
                </div>
                <div className='design-title-name-con'>
                    <span className='save-detail-page-title'>
                        {title}
                    </span>
                    <textarea className='design-detail-textarea'
                        placeholder='상세설명을 입력해 주세요.'
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
            </div>
            <div className='save-detail-page-footer'>
                <button className='save-detail-page-upload-btn' onClick={handleSaveClick}>
                    저장하기
                </button>
            </div>
            {isLoading &&
                <LoadingModal
                    text='창작한 도안 저장 중'
                    progress={uploadProgress}
                />
            }
        </div>
    )
}