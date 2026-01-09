import './FilterBar.css';

export default function FilterBar( {currentTab, onTabChange} ) {
    const menus = [
        { id: 'all', label: '전체' },
        { id: 'created', label: '내가 만든 도안' },
        { id: 'purchased', label: '내가 산 도안' },
    ];

    return (
        <div className='filter-bar-con'>
            {menus.map((menu) => (
                <button 
                    key={menu.id}
                    className={`filter-btn ${currentTab === menu.id ? 'active' : ''}`}
                    onClick={() => onTabChange(menu.id)}
                    >
                    {menu.label}
                </button>
            ))}
        </div>
    );
}