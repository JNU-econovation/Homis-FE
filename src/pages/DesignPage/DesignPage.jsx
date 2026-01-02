import { useState } from 'react';

export default function DesignPage() {
    const [usingTool, setUsingTool] = useState(''); // brush or eraser
    const [selectedItems, setSelectedItems] = useState({color: '', symbol: ''});
    const [grid, setGrid] = useState(new Array(20).fill(null).map(() => new Array(20)));

    // return (

    // );
}