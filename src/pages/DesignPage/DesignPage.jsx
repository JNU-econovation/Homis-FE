import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import EraserBtn from '../../components/Button/EraserBtn/EraserBtn.jsx';
import BrushBtn from '../../components/Button/BrushBtn/BrushBtn.jsx';
import CloseBtn from '../../components/Button/CloseBtn/CloseBtn.jsx';
import SaveBtn from '../../components/Button/SaveBtn/SaveBtn.jsx';
import RightSidebar from '../../components/Bar/RightSidebar/RightSidebar.jsx';
import { COLOR_PALETTES } from '../../assets/constants/colorData.jsx';
import GridBoard from '../../components/Grid/GridBoard.jsx';

import './DesignPage.css';

export default function DesignPage() {
    const navigate = useNavigate();
    const locate = useLocation();

    const { title, width, height } = locate.state || {};
    
    const [usingTool, setUsingTool] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState('');
    const [activeTab, setActiveTab] = useState(COLOR_PALETTES[0].id); // COLOR_PALETTES[i].id => 'color0i'

    return (
        <div className='design-page-overlay'>
            <div className='design-page-header'>
                <div className='close-btn-con'>
                    <CloseBtn link='/main' />
                </div>
                <div className='name-input-con'>
                    <span className='design-title'>{title}</span>
                </div>
                <div className='save-btn-con'>
                    <SaveBtn /> { /* ex: <SaveBtn onClick={(currentDesign) => CALL_SAVE_API(currentDesign); navigate('/main')}.... API 호출 후 메인(상세페이지)로 ROUTING 할 것 */}
                </div>
            </div>
            <div className='design-page-body'>
                <div className='tool-con'>
                    <EraserBtn className='eraser-btn'
                        isSelected={usingTool === 'eraser'}
                        onClick={() => setUsingTool('eraser')}
                    />
                    <BrushBtn className='brush-btn'
                        isSelected={usingTool === 'brush'}
                        onClick={() => setUsingTool('brush')}
                    />
                </div>
                <div className='grid-board-con'>
                    <GridBoard
                        width={width}
                        height={height}
                        usingTool={usingTool}
                        selectedColor={selectedColor}
                        selectedSymbol={selectedSymbol}
                        activeTab={activeTab}
                    />
                </div>
                <div className='right-sidebar-con'>
                    <RightSidebar className='right-sidebar'
                        selectedColor={selectedColor}
                        onColorChange={(color) => setSelectedColor(color)}
                        selectedSymbol={selectedSymbol}
                        onSymbolChange={(symbol) => setSelectedSymbol(symbol)}
                        activeTab={activeTab}
                        onTabChange={setActiveTab}
                    />
                </div>
            </div>
        </div>
    );
}