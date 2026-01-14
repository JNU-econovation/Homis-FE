import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './DownloadBtn.css';

import { getAccessToken, handleAuthError, downloadDesignIMadeAPI } from '../../../utils/API.jsx';
import download_icon from '../../../assets/icons/DownloadIcons/download.png';

function getFileName(contentDisposition) {
    if (!contentDisposition) return null;

    const fileNameRegex = /filename\*\s*=\s*([^;]+)/i; // filename*= 뒤의 내용만 떼기 위한 정규식
    const match = contentDisposition.match(fileNameRegex);

    if (match) {
        const encodedFileName = match[1].replace(/UTF-\d+''/i, ''); // UTF-8'' 등 제거

        return decodeURIComponent(encodedFileName); // 인코딩 된 이름을 디코딩해서 ret
    }
    return null;
}

function triggerDownload(blob, fileName) {
    const url = URL.createObjectURL(blob); // 임시 url 생성 -> 브라우저가 인식 가능

    const link = document.createElement('a'); // a 태그를 link란 이름으로 생성
    link.href = url; // href는 blob에서 생성한 url 객체
    link.download = fileName; // 파일명 설정

    document.body.appendChild(link); // a 태그(=link)를 DOM에 붙임
    link.click(); // 다운로드 트리거

    // 자원 해제
    link.remove();
    URL.revokeObjectURL(url);
}

/* madeDataId, Name => api requestBody */
export default function DownloadBtn({ madeDataId, madeName }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const navigate = useNavigate();

    function checkParams() {
        if (!madeDataId) {
            alert('도안 ID가 존재하지 않습니다.');
            return false;
        }

        if (!madeName) {
            alert('도안 이름이 존재하지 않습니다.');
            return false;
        }
        return true;
    }

    async function handleClickDownload(fileType) {
        if (!checkParams()) return;

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
            const apiRes = await downloadDesignIMadeAPI(requestHeader, requestBody); // blob 통째로 반환됨

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