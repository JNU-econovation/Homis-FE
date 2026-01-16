import { useLocation } from 'react-router-dom';
import './ProductSpecTable.css';

// const dummyData = {
//     type: '대바늘',
//     usedNeedle: '3.5mm',
//     size: '100',
//     gauge: '30 x 30 / 5cm x 5cm',
//     threadUsage: '둥글실 5볼 반, 뚱글실 3볼',
// };

const specList = [
    { key: 'type', label: '유형', },
    { key: 'usedNeedle', label: '사용 바늘', },
    { key: 'size', label: '실측 사이즈', },
    { key: 'gauge', label: '게이지', },
    { key: 'threadUsage', label: '실 소요량', },
];

export default function ProductSpecTable({ productSpecInfo }) {
    const locate = useLocation();

    //const { type, usedNeedle, size, gauge, threadUsage, } = locate.state || { }; // 이건 안 쓸 듯. ProductDetailPage에서 테이블을 컴포넌트로서 쓰니까, props로 넘겨줄 것!

    return (
        <div className='product-spec-table-page-container'>
            <div className='spec-table-page-header'>
                <span className='spec-table-title'>제품 상세 정보</span>
            </div>
            <div className='spec-table-page-body'>
                <table className='spec-table'>
                    <tbody className='spec-table-contents'>
                        {specList.map( (spec) => (
                            <tr className='spec-table-row' key={spec.key}>
                                <th className='spec-table-header'>{spec.label}</th>
                                <td className='spec-table-data'>{productSpecInfo[spec.key]}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}