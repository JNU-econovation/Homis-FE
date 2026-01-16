import { useState } from 'react';
import './ImagePagination.css';

import arrow_right from '../../assets/icons/arrow/page_arrow_right.png';
import arrow_left from '../../assets/icons/arrow/page_arrow_left.png';

export default function ImagePagination({ totalImgCnt, currentIndex, onPrev, onNext }) {
    // const [currentIndex, setCurrentIndex] = useState(0); // 상태 끌어올리기

    // const images = [1, 2, 3, 4];

    // const totalImgCnt = images.length; // 부모에서 넘겨줄 값
    const displayCnt = 1 + currentIndex;
    const isFirst = currentIndex === 0;
    const isLast = currentIndex === totalImgCnt - 1;

    // 해당 컴포넌트에서 images의 idx를 안다고 해서 이 컴포넌트를 쓰는 부모 페이지에서 그에 맞는 사진을 띄울 수 없음
    // 부모 페이지에서 어떤 idx인지 알면 되니까, currentIndex를 부모 컴포넌트로 끌어올리면 됨
    // 따라서, 아래 핸들러들은 부모에서 정의하고, props로서 넘어올 것
    // const handlePrevClick = () => {
    //     if (!isFirst) setCurrentIndex(currentIndex - 1);
    // }
    // const handleNextClick = () => {
    //     if (!isLast) setCurrentIndex(currentIndex + 1);
    // }

    return (
        <div className='image-pagination-container'>
            <div className='img-pagination-wrapper'>
                <button className='img-pagination-btn left'
                    onClick={onPrev}
                    disabled={isFirst}
                >
                    <img className='pagination-btn-img left'
                        src={arrow_left} alt='prev btn'
                    />
                </button>
                <span className='page-count'>{displayCnt} / {totalImgCnt}</span>
                <button className='img-pagination-btn right'
                    onClick={onNext}
                    disabled={isLast}
                >
                    <img className='pagination-btn-img right'
                        src={arrow_right} alt='next btn'
                    />
                </button>
            </div>
        </div>
    );
}