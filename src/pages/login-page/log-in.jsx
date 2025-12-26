import { useState } from 'react';
import LayoutForLogIn from './layoutForLogIn/layoutForLogIn.jsx';
import InputBar from '../../components/InputGroup/InputBar';
import { handleChange, validateLogIn } from '../../utils/validators.jsx';


export default function LogIn() {
    const [inputs, setInputs] = useState({ id: '', pw: '', });

    async function handleLogIn() {
        const isSuccess = await validateLogIn(inputs);
        // working...
    }
    return (
        <LayoutForLogIn>
            <div className='title-con'>
                <h1 className='page-title'>뜨개 도아 로그인</h1>
            </div>
            <div className='input-bar-con'>
                <InputBar
                    label='아이디' placeholder='ID를 입력해 주세요'
                    value={inputs.id} onChange={(e) => handleChange(e, inputs, setInputs)} name='id'
                />
                <InputBar
                    label='비밀번호' placeholder='비밀번호를 입력해 주세요' type='password'
                    value={inputs.pw} onChange={(e) => handleChange(e, inputs, setInputs)} name='pw'
                />
            </div>
            <div className='login-btn-con'>
                <button className='login-btn' onClick={handleLogIn}>로그인</button>
            </div>
        </LayoutForLogIn>
    );
}