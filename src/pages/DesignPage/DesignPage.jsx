import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import html2canvas from 'html2canvas';

import EraserBtn from '../../components/Button/EraserBtn/EraserBtn.jsx';
import BrushBtn from '../../components/Button/BrushBtn/BrushBtn.jsx';
import CloseBtn from '../../components/Button/CloseBtn/CloseBtn.jsx';
import SaveBtn from '../../components/Button/SaveBtn/SaveBtn.jsx';
import RightSidebar from '../../components/Bar/RightSidebar/RightSidebar.jsx';
import { COLOR_PALETTES } from '../../assets/constants/colorData.jsx';
import GridBoard from '../../components/Grid/GridBoard.jsx';
import UndoRedoBtn from '../../components/Button/UndoRedoBtn/UndoRedoBtn.jsx';

import './DesignPage.css';

const BOARD_SIZE = 560;

export default function DesignPage() {
    const navigate = useNavigate();
    const locate = useLocation();

    const captureTarget = useRef(null); // 캡처할 영역을 지정하기 위한 ref

    const { title, width, height } = locate.state || {};
    const [editTitle, setEditTitle] = useState(title);

    // 도안 제작 State
    const [usingTool, setUsingTool] = useState('brush');
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSymbol, setSelectedSymbol] = useState('');
    const [activeTab, setActiveTab] = useState(COLOR_PALETTES[0].id); // COLOR_PALETTES[i].id => 'color0i'

    // ---------------------- Undo/Redo 위한 State를 GridBoard.jsx로부터 끌어올림 ---------------------------------
    const [gridData, setGridData] = useState([]); // 배열의 각 요소엔 { color: 색상코드, symbol: img url } 객체를 저장
    const [history, setHistory] = useState([]); // redo/undo 로직 다 여기에 있으니 history, future는 딱히 넘겨줄 필요 X. gridData는 넘겨줘야 함. gridData.map() 사용 중..
    const [future, setFuture] = useState([]);

    //const colCnt = Math.floor(BOARD_SIZE / parseInt(width || 10)); // || 10 => 입력값 없거나 0이면 10(default)으로
    //const rowCnt = Math.floor(BOARD_SIZE / parseInt(height || 10));
    // 기존: 고정된 크기의 정사각형을 사용자가 입력한 값을 가로, 세로 값으로서 하나의 픽셀 크기를 정의. 해당 픽셀로 고정된 크기의 정사각형을 균등 분할하여 도안 구성
    // 변경: 사용자가 입력한 값만큼 가로, 세로 픽셀이 존재할 것. ex: 10 입력 -> 가로10개, 세로10개, 총 10*10개의 픽셀이 존재
    const colCnt = parseInt(width || 10); // default: 10개
    const rowCnt = parseInt(height || 10); 
    const totalPixels = colCnt * rowCnt;

    useEffect(function () {
        // 1. SaveDetailPage에서 다시 DesignPage로 돌아올 때 전달하는 state엔 gridData가 포함되어 있음
        // 2. Modal에서 픽셀 크기 설정하고 DesignPage로 왔을 땐 state에 gridData가 없음
        // 이 정보로 도안을 어떻게 초기화할지 결정함
        // 1 => SaveDetail..로 넘어갈 때 가져갔던 gridData(기존의 도안 상태)로 setGridData -> 기존의 도안 렌더링
        // 2 => 처음 도안 제작 페이지 온 거니까, 백지로 렌더링
        if (locate.state && locate.state.gridData) {
            setGridData(locate.state.gridData);
            setHistory(locate.state.history);
            setFuture(locate.state.future);
            return;
        }

        const initialData = Array.from({ length: totalPixels }, function () {
            return { color: null, symbol: null };
        });

        setGridData(initialData);
    }, [width, height, totalPixels, locate.state]); // 의존성 배열: locate.state 추가 => locate.state가 바뀔 때도 체크해서 useEffect 수행

    function handleCellClick(index) {  // GridBoard에게 각 cell 클릭에 대한 이벤트 핸들러로 넘겨줘야 함. cell은 GridBoard에서 만드니까..
        // const newGridData = [...gridData]; 
        // const currentCell = { ...newGridData[index] }; // index 내 요소의 key: value 쌍을 꺼내고(원랜 객체 들어있지만, ... 써서 key: value 쌍만 빼냄), 이를 다시 {}로 묶어 객체로서 사용 -> 상세 설명 Notion
        if (!usingTool) return; // 지우개 or 브러시 선택 안 했으면 그대로 return => 선택 안 한 상태에서 클릭 시 history 변경 방지(undo 활성화 안 되게)

        const currentCell = gridData[index]; // 현재 클릭한 cell의 정보를 가져옴
        let nextColor = currentCell.color; // next..는 클릭한 cell에 입혀질 정보를 저장할 변수들임. 이는 현재 클릭한 cell에 입혀질 정보가 기존의 정보와 동일한지 판단하기 위함임
        let nextSymbol = currentCell.symbol; // 기존과 동일하게 변경된다면, history를 추가하지 않도록 하기 위해. (똑같은 색을 똑같은 셀에 클릭하면 history 기록 안 되도록..)

        if (usingTool === 'eraser') {
            // 지우개: 색상이건 기호건 모두 삭제
            nextColor = null;
            nextSymbol = null;
        }
        else if (usingTool === 'brush') {
            if (activeTab === 'symbol') { // 기호 탭이 열려있고,
                if (selectedSymbol) { // 선택된 심볼이 있다면, 기호만 찍음(기존 배경색 유지)
                    nextSymbol = selectedSymbol;
                }
            }
            else { // symbol tab이 아니면(=color tab이면),
                if (selectedColor) {
                    nextColor = selectedColor; // 색상만 넣음 (기존 기호는 유지)
                }
            }
        }
        // 기존 cell 정보와 바뀔 상태가 완전히 동일하다면? => 변화가 전혀 없으니 함수 종료하여 history 저장 X.
        if (currentCell.color === nextColor && currentCell.symbol === nextSymbol) return;

        // 여기는 기존 cell의 정보에서 변화가 있는 경우에 수행됨 => 현재 상태를 history에 저장해야 함
        setHistory((prev) => [...prev, gridData]); // 현재까지의 상태를 history state에 저장
        setFuture([]); // 새 그림 그리면? -> 새 history가 작성되었으니 future를 초기화

        const newGridData = [...gridData]; // 기존 gridData 내용으로 배열을 메모리(heap)상에 그대로 복사 후, 해당 배열의 시작주소를 newGridData에 저장
        newGridData[index] = { color: nextColor, symbol: nextSymbol }; // 복제본에 변경 사항 반영하고,
        setGridData(newGridData); // 변경 사항 반영된 복제본을 실질적으로 적용함
    }

    function handleUndo() {
        if (history.length === 0) return; // 과거가 없다면 undo 할 state가 없으므로 return

        setFuture((prev) => [...prev, gridData]); // 현재까지의 상태를 future에 저장(Redo 할 수 있도록)

        const previousHistory = history[history.length - 1]; // history에 기록된 가장 마지막 변경 사항을 가져옴
        setGridData(previousHistory); // history에서 꺼내온 과거 상태를 적용

        setHistory((prev) => prev.slice(0, -1)); // array를 슬라이싱 해서 history에서 꺼낸 요소를 실질적으로 삭제
        // stack top을 이용해 stack을 구현한 게 아니니 이렇게 실질적으로 메모리에 저장된 내용을 슬라이싱 해줘야 함
    }

    function handleRedo() {
        if (future.length === 0) return;

        setHistory((prev) => [...prev, gridData]); // 현재 상태를 history에 push

        const nextFuture = future[future.length - 1]; // future의 최상단 요소(가장 최근에 redo 된 state)를 가져옴
        setGridData(nextFuture); // 상태 적용

        setFuture((prev) => prev.slice(0, -1)); // 마찬가지로 실제 stack처럼 동작할 수 있도록 pop 한 요소 제거
    }
    // -----------------------------------------------------------------------------------------------------

    async function handleSaveClick() {
        if (!captureTarget.current) return;

        try {
            const img = await html2canvas(captureTarget.current); // 화면 캡처

            const captureRes = img.toDataURL('image/png');
            const base64 = captureRes.split(',')[1]; // 불필요한 header(data:image/png;base64,) 제거. 안 없애면 500 Internal Server Error
            console.log(`base64: ${base64}`);

            navigate('/save-detail', {
                state: {
                    designImg: captureRes,
                    designImgForAPI: base64,
                    title: editTitle,
                    gridData: gridData,
                    // SaveDetail..에서 돌아왔을 때 cell 칸 수 그대로 유지하려면 width, height도 그대로 가져와야 하니, 이들도 전달해 줘야...
                    // 그래야만 colCnt, rowCnt가 옳게 계산됨
                    width: width,
                    height: height,
                    // history, future도 그대로 복구하기 위해 넘겨줌
                    history: history,
                    future: future,
                }
            });
        }
        catch (error) {
            console.log('capture failed');
        }
    }

    return (
        <div className='design-page-overlay'>
            <div className='design-page-header'>
                <div className='close-btn-con'>
                    <CloseBtn link='/main' />
                </div>
                <div className='design-page-name-con'>
                    <input className='design-title' 
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                    />
                </div>
                <div className='undo-redo-btn-container-in-design-page'>
                    <UndoRedoBtn
                        onUndo={handleUndo}
                        onRedo={handleRedo}
                        canUndo={history.length >= 1} // history에 아무 state도 없다? => undo 할 게 없음
                        canRedo={future.length >= 1} // future에 아무 state도 없다? => redo 할 게 없음
                    />
                </div>
                <div className='save-btn-con'>
                    <SaveBtn 
                        onSaveClick={handleSaveClick}    
                    /> { /* ex: <SaveBtn onClick={(currentDesign) => CALL_SAVE_API(currentDesign); navigate('/main')}.... API 호출 후 메인(상세페이지)로 ROUTING 할 것 */}
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
                { /* ref={...} => 캡처할 영역(div)을 지정 */}
                <div className='grid-board-con' ref={captureTarget}>
                    <GridBoard
                        width={width}
                        height={height}
                        // usingTool={usingTool} 
                        // selectedColor={selectedColor}
                        // selectedSymbol={selectedSymbol}
                        // activeTab={activeTab}
                        gridData={gridData}
                        onCellClick={handleCellClick}
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