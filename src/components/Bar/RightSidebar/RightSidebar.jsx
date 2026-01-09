import { COLOR_PALETTES } from '../../../assets/constants/colorData.jsx';
import { SYMBOL_DATA } from '../../../assets/constants/symbolData.jsx';
import ColorBtn from '../../Button/ColorBtn/ColorBtn.jsx';
import SymbolBtn from '../../Button/SymbolBtn/SymbolBtn.jsx'
import './RightSidebar.css';

export default function RightSidebar({ selectedColor, onColorChange, selectedSymbol, onSymbolChange, activeTab, onTabChange }) {
    /* 
    activeTab 상태는 부모(DesignPage)로 끌어올릴 것.
    RightSidebar의 형제 GridBoard에게 activeTab 상태 전달해 줘야 함(GridBoard에서 기호가 활성화 된 상태인지 판단하는 로직이 필요하기에).
    이를 위해 이 상태 정보를 두 형제의 공통 부모인 DesignPage에게 맡기는 것!
    */
    // const [activeTab, setActiveTab] = useState(COLOR_PALETTES[0].id); // COLOR_PALETTES[i].id => 'color0i'
    function renderContent() {
        /* 'symbol tab' selected -> rendering SymbolBtn */
        if (activeTab === 'symbol') {
            return SYMBOL_DATA.map((item) => (
                <SymbolBtn
                    key={item.id}
                    src={item.src}
                    isSelected={selectedSymbol === item.src}
                    onClick={() => onSymbolChange(item.src)}
                />
            ));
        }

        /* 'color tab' selected -> rendering ColorBtn */
        const currentPalette = COLOR_PALETTES.find(p => p.id === activeTab);
        if (!currentPalette) return;
        return currentPalette.colors.map((color, index) => (
                    <ColorBtn 
                        key={index}
                        color={color}
                        isSelected={selectedColor === color}
                        onClick={() => onColorChange(color)}
                    />
                ));
    }

    return (
        <div className='right-sidebar-con'>
            <div className='category-tab-area'>
                {COLOR_PALETTES.map((palette) => (
                    <button
                        key={palette.id}
                        className={`tab-btn ${activeTab === palette.id ? 'selected' : 'unselected'}`}
                        onClick={() => onTabChange(palette.id)}
                    >{palette.label}
                    </button>
                ))}
                <button
                    className={`tab-btn ${activeTab === 'symbol' ? 'selected' : 'unselected'}`}
                    onClick={() => onTabChange('symbol')}
                >기호
                </button>
            </div>
            <div className='content-area'>
                {renderContent()}
            </div>
        </div>
    );
}