import { useState, useEffect } from 'react';
import './GridBoard.css';

const BOARD_SIZE = 560;

/* 부모(DesignPage)에서 관리하는 픽셀의 크기(width, height), 사용 도구(usingTool), 색상 및 기호, activeTab State를 전달 */
export default function GridBoard({ width, height, usingTool, selectedColor, selectedSymbol, activeTab }) {
    const [gridData, setGridData] = useState([]); // 배열의 각 요소엔 { color: 색상코드, symbol: img url } 객체를 저장

    const colCnt = Math.floor(BOARD_SIZE / parseInt(width || 20)); // || 20 => 입력값 0으로 주면 그냥 20 정도로 나눔(default)
    const rowCnt = Math.floor(BOARD_SIZE / parseInt(height || 20));
    const totalPixels = colCnt * rowCnt;

    /* Array.from() 예시
    const alphabet = Array.from({ length: 26 }, (_, i) => String.fromCharCode(97 + i));
    상세 설명은 Notion 확인
    */
    useEffect(function () {
        const initialData = Array.from({ length: totalPixels }, function () {
            return { color: null, symbol: null };
        });

        setGridData(initialData);
    }, [width, height, totalPixels]);

    // 도안 제작 grid의 각 cell 클릭에 대한 핸들러
    function handleCellClick(index) {
        const newGridData = [...gridData]; // 기존 gridData 내용으로 배열을 메모리(heap)상에 그대로 복사 후, 해당 배열의 시작주소를 newGridData에 저장
        const currentCell = { ...newGridData[index] }; // index 내 요소의 key: value 쌍을 꺼내고(원랜 객체 들어있지만, ... 써서 key: value 쌍만 빼냄), 이를 다시 {}로 묶어 객체로서 사용 -> 상세 설명 Notion

        if (usingTool === 'eraser') {
            // 지우개: 색상이건 기호건 모두 삭제
            currentCell.color = null;
            currentCell.symbol = null;
        }
        else if (usingTool === 'brush') {
            if (activeTab === 'symbol') { // 기호 탭이 열려있고,
                if (selectedSymbol) { // 선택된 심볼이 있다면, 기호만 찍음(기존 배경색 유지)
                    currentCell.symbol = selectedSymbol;
                }
            }
            else { // symbol tab이 아니면(=color tab이면),
                if (selectedColor) {
                    currentCell.color = selectedColor; // 색상만 넣음 (기존 기호는 유지)
                }
            }
        }

        newGridData[index] = currentCell; // 변경사항 다 적용된 결과를 GridData 복제본에 넣고,
        setGridData(newGridData); // 실질적으로 적용함
    }

    return (
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
                        onClick={() => handleCellClick(index)} // cell 클릭되면 호출되는 이벤트 핸들러. 클릭된 cell의 index값을 전달.
                    >
                        {/* 기호가 있을 때만 이미지 렌더링 */}
                        {cell.symbol && <img src={cell.symbol} alt="symbol" />}
                    </div>
                );
            })}
        </div>
    );
}