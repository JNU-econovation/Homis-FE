import './BackBtn.css';
import arrow_left from '../../../assets/icons/arrow/arrow_left.png';
import { useNavigate } from 'react-router-dom';

export default function BackBtn({ link }) {
    const navigate = useNavigate();

    return (
        <button className='back-btn' onClick={() => navigate(link)}>
            <img src={arrow_left} alt='뒤로가기' />
        </button>
    );
}