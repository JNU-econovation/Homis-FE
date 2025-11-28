import './InputBar.css';

export default function InputBar( { label, placeholder, type = 'text', value, onChange, name, buttonText, onButtonClick } ) {
    return (
        <div className='input-bar'>
            <label className='input-label'>{label}</label>
            <div className='input-wrapper'>
                <input
                    className='custom-input'
                    type={type}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    name={name}
                    style={buttonText ? { paddingRight: '90px' } : { }} // buttonText(중복 확인) 넘어오면 오른쪽 패딩...
                />
                {/* using short circuit rule */}
                {/* buttonText false -> doing nothing */}
                {buttonText && (
                    <button className='check-btn' onClick={onButtonClick} type='button'>
                        {buttonText}
                    </button>)
                }
            </div>
        </div>
    );
}

