import './ImagePreviewBox.css';

import small_x_icon from '../../../assets/icons/XIcons/smallX.png';

/* 
onClick => handler for X button(delete image)
src => image url from parent
*/
export default function ImagePreviewBox({ onClick, src=null }) {
    return (
        <div className='image-preview-box'>
            {src &&
                <img className='preview-img' 
                src={src} 
                alt='업로드 사진' 
            />}
            <div className='image-delete-btn-con' onClick={onClick}>
                <img className='image-delete-btn'
                    src={small_x_icon}
                    alt='삭제 버튼'
                />
            </div>
        </div>
    );
}