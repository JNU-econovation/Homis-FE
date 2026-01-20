import { useState, useEffect } from 'react';
import './GridBoard.css';

//import UndoRedoBtn from '../Button/UndoRedoBtn/UndoRedoBtn.jsx';

const BOARD_SIZE = 560;

/* 부모(DesignPage)에서 관리하는 픽셀의 크기(width, height), 사용 도구(usingTool), 색상 및 기호, activeTab State를 전달 */
export default function GridBoard({ width, height, gridData, onCellClick, /* usingTool, selectedColor, selectedSymbol, activeTab */ }) {
    // const [gridData, setGridData] = useState([]); // 배열의 각 요소엔 { color: 색상코드, symbol: img url } 객체를 저장
    // const [history, setHistory] = useState([]);
    // const [future, setFuture] = useState([]);

    // 입력된 픽셀 크기로 쪼개기 위한 repeat()를 사용 시에 col, row Cnt 사용되니 남겨둠
    //const totalPixels = colCnt * rowCnt;
    //const colCnt = Math.floor(BOARD_SIZE / parseInt(width || 10)); // || 10 => 입력값 없거나 0이면 10(default)으로
    //const rowCnt = Math.floor(BOARD_SIZE / parseInt(height || 10));
    // 기존: 고정된 크기의 정사각형을 사용자가 입력한 값을 가로, 세로 값으로서 하나의 픽셀 크기를 정의. 해당 픽셀로 고정된 크기의 정사각형을 균등 분할하여 도안 구성
    // 변경: 사용자가 입력한 값만큼 가로, 세로 픽셀이 존재할 것. ex: 10 입력 -> 가로10개, 세로10개, 총 10*10개의 픽셀이 존재
    const colCnt = parseInt(width || 10); // default: 10개
    const rowCnt = parseInt(height || 10); 

    /* Array.from() 예시
    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    상세 설명은 Notion 확인
    */
    // useEffect(function () {
    //     const initialData = Array.from({ length: totalPixels }, function () {
    //         return { color: null, symbol: null };
    //     });

    //     setGridData(initialData);
    // }, [width, height, totalPixels]);

    // 도안 제작 grid의 각 cell 클릭에 대한 핸들러
    // function handleCellClick(index) {
    //     // const newGridData = [...gridData]; 
    //     // const currentCell = { ...newGridData[index] }; // index 내 요소의 key: value 쌍을 꺼내고(원랜 객체 들어있지만, ... 써서 key: value 쌍만 빼냄), 이를 다시 {}로 묶어 객체로서 사용 -> 상세 설명 Notion
    //     if (!usingTool) return; // 지우개 or 브러시 선택 안 했으면 그대로 return => 선택 안 한 상태에서 클릭 시 history 변경 방지(undo 활성화 안 되게)

    //     const currentCell = gridData[index]; // 현재 클릭한 cell의 정보를 가져옴
    //     let nextColor = currentCell.color; // next..는 클릭한 cell에 입혀질 정보를 저장할 변수들임. 이는 현재 클릭한 cell에 입혀질 정보가 기존의 정보와 동일한지 판단하기 위함임
    //     let nextSymbol = currentCell.symbol; // 기존과 동일하게 변경된다면, history를 추가하지 않도록 하기 위해. (똑같은 색을 똑같은 셀에 클릭하면 history 기록 안 되도록..)

    //     if (usingTool === 'eraser') {
    //         // 지우개: 색상이건 기호건 모두 삭제
    //         nextColor = null;
    //         nextSymbol = null;
    //     }
    //     else if (usingTool === 'brush') {
    //         if (activeTab === 'symbol') { // 기호 탭이 열려있고,
    //             if (selectedSymbol) { // 선택된 심볼이 있다면, 기호만 찍음(기존 배경색 유지)
    //                 nextSymbol = selectedSymbol;
    //             }
    //         }
    //         else { // symbol tab이 아니면(=color tab이면),
    //             if (selectedColor) {
    //                 nextColor = selectedColor; // 색상만 넣음 (기존 기호는 유지)
    //             }
    //         }
    //     }
    //     // 기존 cell 정보와 바뀔 상태가 완전히 동일하다면? => 변화가 전혀 없으니 함수 종료하여 history 저장 X.
    //     if (currentCell.color === nextColor && currentCell.symbol === nextSymbol) return;

    //     // 여기는 기존 cell의 정보에서 변화가 있는 경우에 수행됨 => 현재 상태를 history에 저장해야 함
    //     setHistory((prev) => [...prev, gridData]); // 현재까지의 상태를 history state에 저장
    //     setFuture([]); // 새 그림 그리면? -> 새 history가 작성되었으니 future를 초기화

    //     const newGridData = [...gridData]; // 기존 gridData 내용으로 배열을 메모리(heap)상에 그대로 복사 후, 해당 배열의 시작주소를 newGridData에 저장
    //     newGridData[index] = { color: nextColor, symbol: nextSymbol }; // 복제본에 변경 사항 반영하고,
    //     setGridData(newGridData); // 변경 사항 반영된 복제본을 실질적으로 적용함
    // }

    // function handleUndo() {
    //     if (history.length === 0) return; // 과거가 없다면 undo 할 state가 없으므로 return

    //     setFuture((prev) => [...prev, gridData]); // 현재까지의 상태를 future에 저장(Redo 할 수 있도록)

    //     const previousHistory = history[history.length - 1]; // history에 기록된 가장 마지막 변경 사항을 가져옴
    //     setGridData(previousHistory); // history에서 꺼내온 과거 상태를 적용

    //     setHistory((prev) => prev.slice(0, -1)); // array를 슬라이싱 해서 history에서 꺼낸 요소를 실질적으로 삭제
    //     // stack top을 이용해 stack을 구현한 게 아니니 이렇게 실질적으로 메모리에 저장된 내용을 슬라이싱 해줘야 함
    // }

    // function handleRedo() {
    //     if (future.length === 0) return;

    //     setHistory((prev) => [...prev, gridData]); // 현재 상태를 history에 push

    //     const nextFuture = future[future.length - 1]; // future의 최상단 요소(가장 최근에 redo 된 state)를 가져옴
    //     setGridData(nextFuture); // 상태 적용

    //     setFuture((prev) => prev.slice(0, -1)); // 마찬가지로 실제 stack처럼 동작할 수 있도록 pop 한 요소 제거
    // }

    return (
        <div className='board-wrapper'>
            {
            /* 지금 undo/redo btn이 GridBoard.jsx에 위치해 있어서, css 입혀서 화면 우상단에 배치하기 곤란함.. css로 억지로 위치 끼워맞춰야;; 
            깔끔하게 우상단에 배치하려면 UndoRedoBtn이 모든 Components의 배치를 관장하는 DesignPage로 올라가야 하는데, 이를 위해선 GridBoard가 관리하는 모~든 State를 끌어올려야 함.
            */}
            {/* <div className='undo-redo-btn-container-in-grid-board'> 
                <UndoRedoBtn
                    onUndo={handleUndo}
                    onRedo={handleRedo}
                    canUndo={history.length >= 1} // history에 아무 state도 없다? => undo 할 게 없음
                    canRedo={future.length >= 1} // future에 아무 state도 없다? => redo 할 게 없음
                />
            </div> */}
            <div className='grid-board-container'
                style={
                    { // .css에서 적용하려면 데이터 다 넘겨줘야 되니, 그냥 jsx(tag) 내에서 Escape하여 js 문법 쓰면서 style 적용함
                        width: `${BOARD_SIZE}px`,
                        height: `${BOARD_SIZE}px`,
                        gridTemplateColumns: `repeat(${colCnt},  1fr)`, // 열을 colCnt개 만들고, 각 사이즈는 width px
                        gridTemplateRows: `repeat(${rowCnt},  1fr)`,
                    }
                }
            >
                {gridData.map(function (cell, index) { // 배열 gridData엔 각 셀에 대한 정보(color, symbol)이 저장됨. 해당 정보들을 하나씩 순차적으로 빼서 cell에 저장하고, 아래 함수를 수행
                    return (
                        <div // button 쓰면 기본적으로 입혀진 게 많아 불편하니 div 사용
                            key={index}
                            className="grid-cell"
                            style={{ backgroundColor: cell.color }}
                            onClick={() => onCellClick(index)} // cell 클릭되면 호출되는 이벤트 핸들러. 클릭된 cell의 index값을 전달.
                        >
                            {/* 기호가 있을 때만 이미지 렌더링 */}
                            {cell.symbol && <img src={cell.symbol} alt="symbol" />}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}