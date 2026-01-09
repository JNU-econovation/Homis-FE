import './SymbolBtn.css';

export default function SymbolBtn({ src, isSelected, onClick }) {
    return (
        <button 
            className={`sym-btn ${isSelected ? 'selected' : 'unselected'}`}
            onClick={onClick}
        >
            <img
                src={src}
                alt='symbol image'
            />
        </button>
    );
}