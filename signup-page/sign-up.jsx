import { useState } from 'react';
import Layout from './layout/layout.jsx';
import InputBar from './InputGroup/InputBar.jsx';
import './sign-up.css';

function SignUp() {
    const [inputs, setInputs] = useState( { nickname: '', id: '', pw: '', pwConfirm: ''});

    function handleBack() { // Layout LeftArrow Button EventHandler. <Layout onBack={handleBack}>
      alert('로그인 페이지로 이동');
      // 로그인 페이지 만들면 해당 페이지로 이동...
    }
    function handleChange(e) {
        const { name, value } = e.target;
        setInputs(prev => ({ ...prev, [name]: value }));
    }

    function handleCheck() {
        alert('중복 확인');
    }

    function handleSubmit() {
        alert('가입 시작');
        console.log(inputs); // 입력값 확인용
    }
    return (
      <Layout onBack={handleBack}>
          <div className='page-title-area'>
              <h1 className='page-title'>뜨개 도아 가입하기</h1>
              <p className='sub-title'>뜨개 도안을 편하게 제작해 보세요</p>
            </div>
        <InputBar 
            label="닉네임" placeholder="6자리 이내의 별명"
            value={inputs.nickname} onChange={handleChange} name="nickname"
            buttonText="중복 확인" onButtonClick={handleCheck}
        />
        <InputBar 
            label="아이디" placeholder="영문, 숫자 포함 16자리 이내"
            value={inputs.id} onChange={handleChange} name="id"
            buttonText="중복 확인" onButtonClick={handleCheck}
        />
        <InputBar 
            label="비밀번호" placeholder="특수문자 포함 8자 이상" type="password"
            value={inputs.pw} onChange={handleChange} name="pw"
        />
        <InputBar
            label="비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해주세요" type="password"
            value={inputs.pwConfirm} onChange={handleChange} name="pwConfirm"
        />

        <button className="submit-btn" onClick={handleSubmit}>가입하기</button>
        </Layout>
    );
}

export default SignUp;