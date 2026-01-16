import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DownloadBtn.css';

import { getFileName, triggerDownload, checkParams } from '../../../utils/downloadUtils.jsx';
import { getAccessToken, handleAuthError, fileDownloadStreamAPI } from '../../../utils/API.jsx';
import download_icon from '../../../assets/icons/DownloadIcons/download.png';

/* madeDataId, Name => api requestBody */
export default function DownloadBtn({ madeDataId, madeName }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    async function handleClickDownload(fileType) {
        if (!checkParams(madeDataId, madeName)) return;

        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }

        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        const requestBody = {
            madeDataId: madeDataId,
            madeName: madeName,
            fileType: fileType,
        };

        try {
            const apiRes = await fileDownloadStreamAPI(requestHeader, requestBody, false); // blob 통째로 반환됨

            // 파일명 파싱
            let fileName = getFileName(apiRes.headers['content-disposition']);
            if (!fileName) {
                const actualFileType = fileType === 'PDF' ? 'pdf' : 'png';
                fileName = `knit-doa-design.${actualFileType}`; // 파일명 파싱 안 됐을 때 디폴트로 이름 설정
            }

            triggerDownload(apiRes.data, fileName); // blob data와 파일명 넘겨줘서 다운로드 트리거

            setIsExpanded(false); // 다운로드 다 끝내고 팔레트 닫음
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className={`download-btn-container ${isExpanded ? 'expanded' : 'unexpanded'}`}>
            <div className={`palette-container ${isExpanded ? 'expanded' : 'unexpanded'}`}>
                <button className='file-type PDF' onClick={() => handleClickDownload('PDF')}>
                    PDF
                </button>
                <button className='file-type IMG' onClick={() => handleClickDownload('IMG')}>
                    PNG
                </button>
            </div>
            <div className='download-btn-img-container'>
                <button className='download-btn' onClick={() => setIsExpanded(!isExpanded)}>
                    <img className='download-img'
                        src={download_icon} alt='download img'
                    />
                </button>
            </div>
        </div>
    );
}