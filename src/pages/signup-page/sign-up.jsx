import { useState } from 'react';
import Layout from './layout/layout.jsx';
import InputBar from '../../components/InputGroup/InputBar.jsx';
import './sign-up.css';
import { validateInputs, validateSubmit } from '../../utils/validators.jsx';

function SignUp() {
    const [inputs, setInputs] = useState({ nickname: '', id: '', pw: '', pwConfirm: '' });
    const [errors, setErrors] = useState({ nickname: '', id: '', pw: '', pwConfirm: '', });

    // event handler for every inputs
    function handleChange(e) {
        const { name, value } = e.target;
        const nextInputs = { ...inputs, [name]: value };
        setInputs(nextInputs);

        const errorValidation = validateInputs(nextInputs); // check error
        setErrors(errorValidation);
    }

    async function handleSubmit() {
        const isSuccess = await validateSubmit(inputs, errors);
        if (isSuccess) {
            // navigate('login');
            return;
        }
    }

    return (
        <Layout>
                <div className='title-container'>
                    <h2 className='page-sub-title'>뜨개에 편안함을 플러스 하다!</h2>
                    <h1 className='page-title'>뜨개 도아 가입하기</h1>
                </div>
                <div className='input-bar-container'>
                    <InputBar
                        label="닉네임" placeholder="6자리 이내"
                        value={inputs.nickname} onChange={handleChange} name="nickname"
                    /* buttonText="중복 확인" onButtonClick={handleCheck} */
                    />
                    <InputBar
                        label="아이디" placeholder="16자리 이내"
                        value={inputs.id} onChange={handleChange} name="id"
                    /* buttonText="중복 확인" onButtonClick={handleCheck} */
                    />
                    <InputBar
                        label="비밀번호" placeholder="특수문자 포함 8자 이상" type="password"
                        value={inputs.pw} onChange={handleChange} name="pw"
                    />
                </div>
                { /*<InputBar
            label="비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해주세요" type="password"
            value={inputs.pwConfirm} onChange={handleChange} name="pwConfirm"
        />*/ }
                <div className='submit-btn-container'>
                    <button className="submit-btn" onClick={handleSubmit}>가입하기</button>
                </div>
        </Layout>
    );
}

export default SignUp;