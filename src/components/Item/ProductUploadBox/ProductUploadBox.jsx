import './ProductUploadBox.css';
import { useNavigate } from 'react-router-dom';

import plus_icon from '../../../assets/icons/XIcons/plus.png';

export default function ProductUploadBox() {
    const navigate = useNavigate();

    return (
        <div className='product-upload-box' onClick={() => navigate('/add-item')}>
            <img className='product-upload-img' 
                src={plus_icon} alt='product upload img'
            />
            <span className='product-upload-span'>도안 등록하기</span>
        </div>
    );
}