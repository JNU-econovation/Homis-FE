import './ShoppingPage.css';

import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

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
    const [searchedKeyword, setSearchedKeyword] = useState('');
    const [currentData, setCurrentData] = useState();
    const [isLoading, setIsLoading] = useState(true);
    // const [isSearching, setIsSearching] = useState(false);
    const isSearching = useRef(false);

    async function callAPI(requestHeader) {
        let apiRes;
        if (!isSearching.current) // 검색이 아닌 경우엔 판매글 미리보기 호출
            apiRes = await getProductOnSalePreviewAPI(requestHeader, false/*isSearching 전달*/); // [쇼핑] 판매글 미리보기 내용 전체 불러오기
        else if (isSearching.current)
            apiRes = await getProductOnSalePreviewAPI(requestHeader, true, keyword);

        if (apiRes) setCurrentData(apiRes); // currentData.saleThumbnailImgUrl ~
        else {
            alert('요청에 실패하였습니다. 다시 시도해 주세요.');
            return;
        }
    }

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

    useEffect(function () {
        setIsLoading(true);

        fetchData();
    }, []);

    function handleKeyDown(e) { // e에는 키보드 사건에 대한 이벤트가 전달됨
        if (keyword === '') return; // 아무것도 입력 안 하고 검색 => 아무것도 안 일어남
        if (e.key === 'Enter') // enter 버튼 or 모바일 키보드 ui의 돋보기 모양이 눌렸다면,
            handleSearch();
    }

    function handleSearch() {
        // setIsSearching(true);
        if (keyword === '') return; // 아무것도 입력 안 하고 검색 => 아무것도 안 일어남
        isSearching.current = true;
        setSearchedKeyword(keyword); // keyword state를 저장!
        fetchData(); // 검색 수행됐으면 api 호출해서 데이터 가져와라!
    }
    /*
    isSearching을 state로서 사용 시: setState는 곧장 State값을 변경하지 않음. 해당 함수 끝나고 나서야 값이 변경되도록 '예약'을 걸어두는 것.
    원하는 동작은 곧장 isSearching이 true가 돼서, fetchData 수행 시 검색어에 대한 Preview Data를 가져오는 것..
    하지만, State를 사용 시, 해당 함수가 끝나고 나서야 값을 true로 설정하기에, fetchData() 호출하는 시점의 isSearching 값은 여전히 false임. -> 전체 프리뷰를 가져오는 API 수행해버림
    그래서, 곧장 값 바꿔서 사용할 수 있는 useRef로 변경!
    */

    return (
        <div className='shopping-page-container'>
            <div className='shopping-page-header'>
                <div className='search-bar-contaier'>
                    <div className='search-logo-con'>
                        <span className='search-logo-span'
                            onClick={() => {
                                isSearching.current = false;
                                setKeyword('');
                                setSearchedKeyword('');
                                setIsLoading(true);
                                fetchData();
                            }} // 현재 페이지로는 navigate 불가능. state를 초기값으로 다 reset하면 된다!
                        >Knit Doa</span>
                    </div>
                    <input className='shopping-page-search'
                        type='search'
                        enterKeyHint='search' // 키보드: enter -> 검색 | 모바일: 키보드ui 우측 하단 돋보기로 변경
                        placeholder='검색어를 입력해주세요.'
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                        onKeyDown={handleKeyDown} // 키보드(+모바일) 클릭에 대한 이벤트 핸들러
                    />
                    <div className='search-img-con'>
                        <img className='search-img'
                            src={search_icon} alt='search img'
                            onClick={handleSearch}
                        />
                    </div>
                </div>
            </div>
            <div className='shopping-page-body'>
                <div className='shopping-content'>
                    {isSearching.current &&
                        <div className='search-result-container'>
                            {/* keyword state를 그대로 출력 -> state는 변경될 때마다 re-rendering -> 입력창에 다른 값 입력 -> 검색 결과가 계속 바뀜 => 해결: keyword를 변수에다 넣고, 그 변수를 출력해라 
                            =>searchedKeyword State 추가해서 관리
                        */}
                            <span className='search-keyword'>‘ <span className='keyword-underline'>{searchedKeyword}</span> ’ 검색 결과</span>
                            {/* <div className='search-line' /> */}
                            <div className='search-line' />
                        </div>
                    }
                    {!isLoading &&
                        <div className='product-container'>
                            {[...currentData].reverse().map((item) =>
                                <div key={item.salePostId} className='product-on-sale-info-container'>
                                    <ProductOnSalePreview
                                        title={item.saleName}
                                        editor={item.salerNickname}
                                        price={item.salePrice}
                                        img={item.saleThumbnailImgUrl}
                                        salerNickname={item.salerNickname}
                                        salePostId={item.salePostId}
                                    />
                                </div>
                            )}
                        </div>
                    }
                </div>
            </div>
            <div className='shopping-page-footer'>
                <MenuBar />
            </div>
        </div >
    );
}