// import save_icon from '../../../assets/icons/SaveIcons/save.png'; // icon 안 쓰는 거로 변경
import './SaveBtn.css';

export default function SaveBtn({ onSaveClick }) {
    return (
        /* 이벤트 핸들러는 DesignPage에서 SaveBtn 사용할 때 ArrowFunc으로 전달할 것 */
        <button className='save-btn' onClick={onSaveClick}>
            완료{/* <img src={save_icon} alt='저장' /> */}
        </button>
    );
}