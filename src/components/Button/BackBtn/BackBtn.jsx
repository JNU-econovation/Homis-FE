import './BackBtn.css';
import arrow_left from '../../../assets/icons/arrow/arrow_left.png';
import { useNavigate } from 'react-router-dom';

export default function BackBtn({ link, onClick=null }) {
    const navigate = useNavigate();

    // navigate() 시에 추가적인 동작 있다면 BackBtn 사용할 때 onClick에다가 별도의 이벤트 핸들러 함수를 전달
    return (
        <button className='back-btn' onClick={() => (onClick === null) ? (link === '-1' ? navigate(-1) : navigate(link)) : onClick()}>
            <img src={arrow_left} alt='뒤로가기' />
        </button>
    );
}