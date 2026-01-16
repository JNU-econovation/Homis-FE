import './SingleDownloadBtn.css';
// import { useState } from 'react';
import { getFileName, triggerDownload, checkParams } from '../../../utils/downloadUtils.jsx';
import { getAccessToken, handleAuthError, fileDownloadStreamAPI } from '../../../utils/API.jsx';
import download_icon from '../../../assets/icons/DownloadIcons/download.png';
import download_icon_white from '../../../assets/icons/DownloadIcons/download_white.png';

export default function SingleDownloadBtn({ salePostId, saleName, id }) {
    async function handleClickDownload(fileType) {
        if (!checkParams(salePostId, saleName)) return;

        let accessToken;
        try { accessToken = getAccessToken(); }
        catch (error) { handleAuthError(error, navigate); return; }

        const requestHeader = {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        };
        const requestBody = {
            purchasedPostId: id,
        };
        // console.log(requestBody);

        try {
            const apiRes = await fileDownloadStreamAPI(requestHeader, requestBody, true); // blob 통째로 반환됨

            // 파일명 파싱
            let fileName = getFileName(apiRes.headers['content-disposition']);
            if (!fileName) {
                const actualFileType = fileType === 'PDF' ? 'pdf' : 'png';
                fileName = `knit-doa-design.${actualFileType}`; // 파일명 파싱 안 됐을 때 디폴트로 이름 설정
            }

            triggerDownload(apiRes.data, fileName); // blob data와 파일명 넘겨줘서 다운로드 트리거
        }
        catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='single-download-btn-container'>
            <button className='single-download-btn' onClick={() => handleClickDownload('PDF')}> { /* 구매한 도안은 PDF로만 다운로드 가능 */ }
                {/* 안 눌렀을 때의 이미지 */}
                <img className='single-download-btn-img normal'
                    src={download_icon} alt='download img'
                />
                {/* 눌렀을 때의 이미지(미리 렌더링) */}
                <img className='single-download-btn-img pressed'
                    src={download_icon_white} alt='download img'
                />
            </button>
        </div>
    );
}
        /* 
        버튼 누름 -> isPressed가 true가 되고, 그제서야 이미지를 불러옴. 브라우저가 이미지 로딩하는 시간이 꽤 걸려서 0.1s동안 아이콘이 사라져버림..
        => 동작이 굉장히 부자연스러우니, 이미지를 미리 렌더링 해두고, css로만 처리하자
        */
    // const [isPressed, setIsPressed] = useState(false);
    // const handlePressStart = () => setIsPressed(true);
    // const handlePressEnd = () => setIsPressed(false);
    // return (
    //     <div className='single-download-btn-container'>
    //         <button className='single-download-btn'
    //             onTouchStart={handlePressStart}
    //             onTouchEnd={handlePressEnd}
    //         >
    //             <img className='single-download-btn-img' 
    //                 src={!isPressed ? download_icon : download_icon_white} alt='download img'
    //             />
    //         </button>
    //     </div>
    // );