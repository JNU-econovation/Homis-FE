import './DesignPreview.css';

import { useState, useEffect } from 'react';

export default function DesignPreview({ type, designData, onDesignClick }) {
    const [isActive, setIsActive] = useState(false);

    const title = designData.madeName
        || designData.title
        || designData.saleName;

    function handleClick() {
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

    return (
        <div className='design-preview-container' onClick={handleClick}>
            <div className='container-for-design-img'>
                <img className={`design-preview-img ${type === 'PURCHASE' ? 'purchase' : ''}`}
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