import './AddItemInput.css';

export default function AddItemInput({ label, placeholder, type = 'text', value, errorMessage, onChange, multiline = false, width = '100%', height = '42px', name }) {
    return (
        <div className='add-item-input-con'>
            <div className='add-item-input-label-and-error-wrapper'>
                <label className={`add-item-input-label ${errorMessage ? 'error-case' : ''}`}>
                    {errorMessage &&
                        <label className='add-star'>*</label>}
                    {label}
                </label>
                {errorMessage &&
                    <span className='add-item-input-error-message'>
                        {errorMessage}
                    </span>}
            </div>
            <div className='add-item-input-components-wrapper'>
                {multiline ? /* multiline true => textarea를 출력 | false => input 출력 */
                    <textarea
                        name={name}
                        className='add-item-input textarea'
                        placeholder={placeholder}
                        value={value}
                        onChange={onChange}
                        style={{ height: height }}
                    />
                    :
                    <input
                        name={name}
                        className={`add-item-input ${name === 'price' ? 'price' : ''}`}
                        placeholder={placeholder}
                        type={type}
                        value={value}
                        onChange={onChange}
                        style={{ width: width }}
                    />
                }
            </div>
        </div>
    );
}