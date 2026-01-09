import './CloseBtn.css';
import { useNavigate } from 'react-router-dom';
import close_icon from '../../../assets/icons/XIcons/X.png';

export default function CloseBtn({ link, onClick }) {
    const navigate = useNavigate();

    function handleClickCloseBtn() {
        if (onClick)
            onClick();
        if (link)
            navigate(link);
    }

    return (
        <button className='close-btn' onClick={handleClickCloseBtn}>
            <img src={close_icon} alt='닫기' />
        </button>
    );
}