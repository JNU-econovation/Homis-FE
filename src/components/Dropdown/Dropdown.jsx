import './Dropdown.css';
import React, { useState } from 'react';
import duplex_arrow from '../../assets/icons/arrow/duplex_arrow.png';
import oneway_arrow from '../../assets/icons/arrow/oneway_arrow.png';
/*
selectedValue => 현재 선택된 값(부모로부터 전달됨, 즉 부모가 관리)
options => 보여줄 메뉴 리스트(부모로부터 전달됨)
onSelect => 선택했을 때에 대한 이벤트 핸들러
*/
export default function Dropdown({ selectedValue, options, onSelect, label, error }) {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDropdown = () => setIsOpen(!isOpen);
    const handleOptionClick = (option) => onSelect(option); // 선택된 option을 부모 컴포넌트로 전달함

    return (
        <div className='dropdown-container'>
            <div className='dropdown-label-container'>
                <label className={`dropdown-label ${error ? 'error-case' : ''}`}>
                    {error &&
                        <span className='dropdown-label add-star'>*</span>}
                    {label}
                </label>
            </div>
            <div className={`dropdown-trigger ${isOpen ? 'opened' : 'unopened'}`} onClick={toggleDropdown}>
                <span className='word'>{selectedValue || '유형을 선택해주세요.'}</span>
                {!isOpen ?
                    <img className='dropdown-trigger-img unopened'
                        src={duplex_arrow} alt='dropdown trigger' />
                    :
                    <img className='dropdown-trigger-img opened'
                        src={oneway_arrow} alt='dropdown trigger' />
                }
            </div>
            {isOpen && (
                <ul className='dropdown-menu'>
                    {options.map((option, index) => (
                        <li
                            key={index}
                            className='dropdown-item'
                            onClick={() => handleOptionClick(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}