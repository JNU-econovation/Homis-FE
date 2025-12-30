import './InputBar.css';

export default function InputBar({ label, placeholder, type = 'text', value, onChange, name, errorMessage/* onButtonClick buttonText*/ }) {
    return (
        <div className='input-bar-container'>
            <div className='input-bar'>
                <div className='labelAndErrorWrapper'>
                    <label className='input-label'>{label}</label>
                    {errorMessage && (
                        <span className='error-message'>{errorMessage}</span>
                    )}
                </div>
                <div className='input-wrapper'>
                    <input
                        className={`custom-input ${errorMessage ? 'error' : ''}`}
                        type={type}
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        name={name}
                    /*style={buttonText ? { paddingRight: '90px' } : { }}*/
                    />
                    {/* using short circuit rule */}
                    {/* buttonText false -> doing nothing */}
                    {/*
                {buttonText && (
                    <button className='check-btn' onClick={onButtonClick} type='button'>
                        {buttonText}
                    </button>)}
                */}
                </div>
            </div>
        </div>
    );
}