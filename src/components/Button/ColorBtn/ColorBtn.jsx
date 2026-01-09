import './ColorBtn.css';

export default function ColorBtn({ color, isSelected, onClick }) {
    return (
        <button 
            className={`color-btn ${isSelected ? 'selected' : 'unselected'}`}
            onClick={onClick}
            style={{backgroundColor: color}}
        />
    );
}