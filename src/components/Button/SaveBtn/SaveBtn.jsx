import save_icon from '../../../assets/icons/SaveIcons/save.png';
import './SaveBtn.css';

export default function SaveBtn() {
    function handleSaveClick() { return; } /* 임시 핸들러 */
    return (
        /* 이벤트 핸들러는 DesignPage에서 SaveBtn 사용할 때 ArrowFunc으로 전달할 것 */
        <button className='save-btn' onClick={handleSaveClick}>
            <img src={save_icon} alt='저장' />
        </button>
    );
}