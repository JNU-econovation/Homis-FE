import './AddItemPage.css';
import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';
import ImagePreviewBox from '../../components/Item/ImagePreviewBox/ImagePreviewBox.jsx';
import ImageUploadBox from '../../components/Item/ImageUploadBox/ImageUploadBox.jsx';
import AddItemInput from '../../components/InputGroup/AddItemInput/AddItemInput.jsx';
import Dropdown from '../../components/Dropdown/Dropdown.jsx';
import UploadBtn from '../../components/Button/UploadBtn/UploadBtn.jsx';

import { handleChangeForAddItem, handleClickAddItem } from '../../utils/validators.jsx';
import arrow_right_white from '../../assets/icons/arrow/arrow_right_white.png';

const data = {
    itemName: '',
    itemType: '',
    usedNeedle: '',
    size: '',
    gauge: '',
    threadUsage: '',
    description: '',
    registeredFile: '',
    price: '',
};

// Dropdown Options
const dropdownOptions = [
    '코바늘', '대바늘', '코바늘&대바늘', '아프간',
];

// 미사용 => .map()으로 하면 중간에 상품 유형 등 추가 불가능
// const inputFields = [
//         { name: 'itemName', label: '상품명', placeholder: '상품명을 입력해주세요.' },
//         { name: 'usedNeedle', label: '사용 바늘', placeholder: '대바늘 3.5mm, 코바늘 7호' },
//         { name: 'size', label: '실측 사이즈', placeholder: `총장 : 100cm ${'\n'}둘레 : 50cm`, multiline: true, height: '90px' },
//         { name: 'gauge', label: '게이지', placeholder: '22코 28단', multiline: true, height: '90px' },
//         { name: 'threadUsage', label: '실 소요량', placeholder: '둥근실 5볼 반, 똥글실 오트밀 3볼' },
//         { name: 'description', label: '상품 설명', placeholder: '상품을 간단하게 소개해 주세요', multiline: true, height: '200px' },
//         { name: 'price', label: '가격 설정', placeholder: '가격을 입력해주세요.', width: '30%' },
//     ];

export default function AddItemPage() {
    const [images, setImages] = useState([]);
    const [inputs, setInputs] = useState(data);
    const [errors, setErrors] = useState(data);
        
    const navigate = useNavigate();

    function handleImageSelect(file) {
        if (images.length >= 4) return; /* 이미지는 4개까지만 등록 */

        const newImage = {
            file: file, /* 서버로 보낼 진짜 파일 */
            previewUrl: URL.createObjectURL(file), /* 화면에 띄울 가짜 URL */
        };
        setImages([...images, newImage]);
    }

    function handleSubmit() {
        // VALIDATE INPUTS
        // API CALL(POST: TITLE, PRICE, etc..)
        return;
    }

    function handleImageDelete(deleteIdx) {
        setImages(images.filter((_, index) => index !== deleteIdx));
    };

    function onChange(e) { handleChangeForAddItem(e, inputs, setInputs, errors); }
    function onChangeDescription(e) { handleChangeForAddItem(e, inputs, setInputs, errors, setErrors); }
    function onClick() {
        handleClickAddItem(inputs, errors, setErrors);
        // navigate('/mypage'); // 마이페이지 상세페이지?로 이동 (등록하기 버튼 누르면)
    }

    /* Dropdown */
    function handleOptionSelect(selectedOption) {
        setInputs({ ...inputs, itemType: selectedOption });
        const newErrors = {...errors, itemType: ''};
        setErrors(newErrors);
    }

    /* UploadBtn */
    function handleFileSelect(file) {
        setInputs({ ...inputs, registeredFile: file});
        const newErrors = {...errors, registeredFile: ''};
        setErrors(newErrors);
    }

    return (
        <div className='add-item-page-overlay'>
            <div className='add-item-page-header'>
                <div className='add-item-page-back-btn'>
                    <BackBtn className='add-item-page-back-btn' /> { /* <BackBtn link='/mypage' /> => mypage 구현 전 */}
                </div>
                <h2 className='add-item-page-title'>도안 판매하기</h2>
            </div>
            <div className='add-item-page-body'>
                <div className='upload-img-con'>
                    <span className='upload-img-title'>이미지 등록 {'(PNG, JPG)'}</span>
                    <div className='boxes-container'>
                        { /* 업로드 버튼은 image가 4개 미만일 때만 출력 */}
                        {images.length < 4 && (
                            <ImageUploadBox onImageSelect={handleImageSelect} />
                        )}
                        {images.map((image, index) => ( /* 배열에 있는 요소 개수만큼 .map() */
                            <ImagePreviewBox
                                key={index}
                                src={image.previewUrl}
                                onClick={() => handleImageDelete(index)} /* 삭제 버튼에 대한 이벤트 핸들러 */
                            />
                        ))}
                    </div>
                </div>
                <div className='add-item-page-input-con'>
                    <AddItemInput
                        name='itemName'
                        label='상품명'
                        placeholder='상품명을 입력해주세요.'
                        value={inputs.itemName}
                        onChange={onChange}
                        errorMessage={errors.itemName}
                    />

                    <Dropdown
                        options={dropdownOptions}
                        label='상품 유형'
                        selectedValue={inputs.itemType} /* 현재 선택된 값 전달 */
                        onSelect={handleOptionSelect}
                        error={errors.itemType}
                    />

                    <AddItemInput
                        name='usedNeedle'
                        label='사용 바늘'
                        placeholder='대바늘 3.5mm, 코바늘 7호'
                        value={inputs.usedNeedle}
                        onChange={onChange}
                        errorMessage={errors.usedNeedle}
                    />

                    <AddItemInput
                        name='size'
                        label='실측 사이즈'
                        placeholder={`총장 : 100cm ${'\n'}둘레 : 50cm`}
                        multiline={true}
                        value={inputs.size}
                        onChange={onChange}
                        errorMessage={errors.size}
                        height='40px'
                    />

                    <AddItemInput
                        name='gauge'
                        label='게이지'
                        placeholder='22코 28단'
                        multiline={true}
                        value={inputs.gauge}
                        onChange={onChange}
                        errorMessage={errors.gauge}
                        height='40px'
                    />

                    <AddItemInput
                        name='threadUsage'
                        label='실 소요량'
                        placeholder='둥근실 5볼 반, 똥글실 오트밀 3볼'
                        value={inputs.threadUsage}
                        onChange={onChange}
                        errorMessage={errors.threadUsage}
                    />
                    <div className='description-container'>
                        <AddItemInput
                            name='description'
                            label='상품 설명'
                            placeholder='상품을 간단하게 소개해 주세요.'
                            multiline={true}
                            value={inputs.description}
                            onChange={onChangeDescription}
                            errorMessage={errors.description}
                            height='200px'
                        />
                        {!errors.description &&
                            <span className='description-length'>{`(${inputs.description.length}/1000)`}</span>
                        }
                    </div>

                    <UploadBtn
                        label='파일 등록 (PDF)'
                        selectedFile={inputs.registeredFile}
                        onFileSelect={handleFileSelect}
                        error={errors.registeredFile}
                    />

                    <div className='price-container'>
                        <AddItemInput
                            name='price'
                            label='가격 설정'
                            placeholder='가격을 입력해주세요.'
                            value={inputs.price}
                            onChange={onChange}
                            errorMessage={errors.price}
                            width='15vw'
                        />
                        <span className='currency'>원</span>
                    </div>
                </div>
            </div>
            <div className='add-item-page-footer'>
                <button className='item-register-btn' onClick={onClick}>
                    등록하기 <img className='register-btn-right-arrow' src={arrow_right_white} alt='화살표 버튼' />
                </button>
            </div>
        </div>
    );
}