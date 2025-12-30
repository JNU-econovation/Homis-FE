import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LayoutForLogIn from './layoutForLogIn/layoutForLogIn.jsx';
import InputBar from '../../components/InputGroup/InputBar';
import { handleChange, validateLogIn } from '../../utils/validators.jsx';
import './log-in.css';

export default function LogIn() {
    const [inputs, setInputs] = useState( { id: '', pw: '', } );
    const [error, setError] = useState('')
    const navigate = useNavigate();

    async function handleLogIn() {
        const isSuccess = await validateLogIn(inputs, setError);
        if (isSuccess) {
            // navigate('main-page');
            return;
        }
    }
    function handleGoSignUp() { navigate('/signup'); }

    return (
        <LayoutForLogIn>
            <div className='title-con'>
                <h1 className='page-title'>Knit Doa</h1>
            </div>
            <div className='error-con'>
                {error && 
                (<p className='error-message'>{error}</p>)}
            </div>
            <div className='input-bar-con'>
                <InputBar
                    label='아이디'
                    value={inputs.id} onChange={(e) => handleChange(e, inputs, setInputs)} name='id'
                />
                <InputBar
                    label='비밀번호' type='password'
                    value={inputs.pw} onChange={(e) => handleChange(e, inputs, setInputs)} name='pw'
                />
            </div>
            <div className='signup-link'>
                <span>아직 회원이 아니신가요?</span>
                <span className='underline' onClick={handleGoSignUp}> 회원가입하기 {'>'}</span>
            </div>
            <div className='login-btn-con'>
                <button className='login-btn' onClick={handleLogIn}>로그인하기</button>
            </div>
        </LayoutForLogIn>
    );
}