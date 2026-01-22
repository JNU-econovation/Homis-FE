import './DeleteConfirmModal.css';

import CloseBtn from '../../Button/CloseBtn/CloseBtn.jsx';


// onClick에 실질적으로 삭제하는 로직이 수행되는 함수가 prop으로 전달됨
// onCloseClick에는 부모에서 isModalOpen을 false로 바꿔주는 함수가 전달됨
export default function DeleteConfirmModal({ onClick, onCloseClick }) {
    return (
        <div className='delete-confirm-modal-overlay'>
            <div className='delete-confirm-modal-container'>
                <div className='delete-confirm-modal-header'>
                    <CloseBtn onClick={onCloseClick}/>
                    <div className='line-in-confirm-modal' />
                </div>
                <div className='delete-confirm-modal-body'>
                    <span className='delete-confirm-external-span'>
                        정말 <span className='delete-confirm-internal-span'>삭제</span>하시겠습니까?
                    </span>
                </div>
                <div className='delete-confirm-modal-footer'>
                    <button className='agree-to-delete-btn'
                        onClick={onClick}
                    >도안 삭제하기</button>
                </div>
            </div>
        </div>
    );
}