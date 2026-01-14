import './ProductDetailPage.css';

import { useLocation } from 'react-router-dom';
import ProductSpecTable from '../../components/Table/ProductSpecTable.jsx';
import BackBtn from '../../components/Button/BackBtn/BackBtn.jsx';
import sample_img from '../../assets/sample/sample-img-2.png';

const dummyData = {
    madeId: '1',
    madeName: '보늬별코바늘나시★',
    userName: '닉네임 예시',
    price: 18750,
    imageUrl: sample_img,
    productSpecInfo: {
        type: '대바늘',
        usedNeedle: '3.5mm',
        size: '100',
        gauge: '30 x 30 / 5cm x 5cm',
        threadUsage: '둥글실 5볼 반, 뚱글실 3볼',
    },
    description: '상세 설명 예시',
};

export default function ProductDetailPage() {
    const locate = useLocation(); // mypage에서 도안 사진 클릭하면 해당 도안에 대한 data를 넘겨주면서 이 페이지로 이동될 거임. 그때 data 받기 위해 location 선언

    // const { madeId, madeName, price, userName, productDetailInfo, description, } = locate.state || { };

    return (
        <div className='product-detail-page-container'>
            <div className='product-detail-page-header'>
                <BackBtn link='/main' /> { /* 뒤로가기 버튼 => 일단은 main 페이지로. 아직 mypage X */}
            </div>
            <div className='product-detail-page-body'>
                <div className='product-detail-page-left-elements-wrapper'>
                    <img className='product-img' src={dummyData.imageUrl} alt='design img' />
                    <div className='title-and-price-wrapper'>
                        <span className='product-info title'>{dummyData.madeName}</span>
                        <span className='product-info price'>{dummyData.price.toLocaleString()}원</span>
                    </div>
                </div>
                <div className='product-detail-page-right-elements-wrapper'>
                    <ProductSpecTable productSpecInfo={dummyData.productSpecInfo} />
                    <textarea className='product-detail-page-description'
                        value={dummyData.description}
                        readOnly={true}
                    />
                </div>
            </div>
        </div>
    );
}