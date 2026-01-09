import { useState } from 'react';
import MenuBar from '../../components/Bar/MenuBar/MenuBar.jsx';
import FilterBar from '../../components/Bar/FilterBar/FilterBar.jsx';
import DesignSettingModal from '../../components/Modals/DesignSettingModal/DesignSettingModal.jsx';
import { useNavigate } from 'react-router-dom';
import './MainPage.css';

export default function MainPage() {
    const [currentTab, setCurrentTab] = useState('all');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const dummyData = [
        { id: 1 }, { id: 2 }, { id: 3 },
        { id: 4 }, { id: 5 }, { id: 6 },
        { id: 7 }, { id: 8 }, { id: 9 }, 
    ];

    function getDisplayData() {
        switch (currentTab) {
            case 'created':
                // CALL API: '내가 만든 도안'(Access Token or userID required to identify users)
                // ex: return await callAPI(userID); => axios.get(~~~, userID) in callAPI func
                // const data = res.data;
                break;
            case 'purchased':
                // CALL API: '내가 산 도안'
                break;
            default: // '전체'
                // CALL API: '전체'
                break;
        }
    }
    //const displayData = getDisplayData();

    return (
        <div className='mypage-con'>
            <div className='upper-shelf-con-mainpage'>
                <div className='filter-bar'>
                    <FilterBar
                        currentTab={currentTab}
                        onTabChange={setCurrentTab}
                    />
                </div>
                <div className='edit-con'>
                    <button className='edit-btn' onClick={() => setIsModalOpen(true)}>+Edit</button>
                    {isModalOpen && 
                        <DesignSettingModal onClick={() => setIsModalOpen(false)} /> }
                </div>
            </div>
            <div className='designs-con'>
                {dummyData.map( (item) => (
                    <div key={item.id} className='design-picture'>
                        <div className='img'></div>
                    </div>
                ))}
            </div>
            <div className='menubar-con'>
                <MenuBar />
            </div>
        </div>
    );
}