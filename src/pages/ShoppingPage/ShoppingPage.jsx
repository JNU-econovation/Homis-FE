import './ShoppingPage.css';

import { useState, useEffect } from 'react';

import search_icon from '../../assets/icons/shopping/search_icon.png';
// import sample_icon_1 from '../../assets/sample/sample_1.png';
// import sample_icon_2 from '../../assets/sample/sample_2.png';

import { getAccessToken, handleAuthError, getProductOnSalePreviewAPI } from '../../utils/API.jsx';
import MenuBar from '../../components/Bar/MenuBar/MenuBar.jsx';
import ProductOnSalePreview from '../../components/ProductOnSalePreview/ProductOnSalePreview.jsx';

// const dummyData = [
//     {
//         title: '버터 플럼 스웨터',
//         editor: '호호수',
//         price: 0,
//         img: sample_icon_1,
//     },
//     {
//         title: '뽀글이 플립백',
//         editor: 'homisBE',
//         price: 17530,
//         img: sample_icon_2,
//     },
// ];

export default function ShoppingPage() {
    const [keyword, setKeyword] = useState('');
    const [currentData, setCurrentData] = useState();
    const [isLoading, setIsLoading] = useState(true);

    async function callAPI(requestHeader) {
        const apiRes = await getProductOnSalePreviewAPI(requestHeader); // [쇼핑] 판매글 미리보기 내용 전체 불러오기
        if (apiRes) setCurrentData(apiRes); // currentData.saleThumbnailImgUrl ~
        else {
            alert('요청에 실패하였습니다. 다시 시도해 주세요.');
            return;
        }
    }

    useEffect(function () {
        setIsLoading(true);
        async function fetchData() {
            let accessToken;
            try { accessToken = getAccessToken(); }
            catch (error) { handleAuthError(error, navigate); return; }
            const requestHeader = {
                'Authorization': `Bearer ${accessToken}`,
            };
            await callAPI(requestHeader);
            setIsLoading(false);
        }
        fetchData();
    }, []);

    return (
        <div className='shopping-page-container'>
            <div className='shopping-page-header'>
                <div className='search-bar-contaier'>
                    <input className='shopping-page-search'
                        type='search'
                        enterKeyHint='search' // 키보드: enter -> 검색 | 모바일: 키보드ui 우측 하단 돋보기로 변경
                        placeholder='Doa'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                    <div className='searcv-img-con'>
                        <img className='search-img'
                            src={search_icon} alt='search img'
                        />
                    </div>
                </div>
            </div>
            <div className='shopping-page-body'>
                {!isLoading &&
                    <div className='product-container'>
                        {[...currentData].reverse().map((item) =>
                            <div key={item.salePostId} className='product-on-sale-info-container'>
                                <ProductOnSalePreview
                                    title={item.saleName}
                                    editor={item.salerNickname}
                                    price={item.salePrice}
                                    img={item.saleThumbnailImgUrl}
                                />
                            </div>
                        )}
                    </div>
                }
            </div>
            <div className='shopping-page-footer'>
                <MenuBar />
            </div>
        </div >
    );
}