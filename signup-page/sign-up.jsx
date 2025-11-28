import { useState } from 'react';
import axios from 'axios';
import Layout from './layout/layout.jsx';
import InputBar from './InputGroup/InputBar.jsx';
import './sign-up.css';

function SignUp() {
    const [inputs, setInputs] = useState( { nickname: '', id: '', pw: '', pwConfirm: '', } );
    const [errors, setErrors] = useState( { nickname: '', id: '', pw: '', pwConfirm: '', } );

    function handleBack() { // Layout LeftArrow Button EventHandler. <Layout onBack={handleBack}>
      alert('로그인 페이지로 이동');
      // no lon-in page yet //navigate('login');
    }

    // event handler for every inputs
    function handleChange(e) {
        const { name, value } = e.target;
        const nextInputs = { ...inputs, [name]:value };
        setInputs(nextInputs);

        const errorValidation = validateInputs(nextInputs); // check error
        setErrors(errorValidation);
    }

    function validateInputs(input) {
        const newErrors = { nickname: '', id: '', pw: '', pwConfirm: '' };
        const idRegex = /^[a-zA-Z0-9]*$/; // only a~z, A~Z, 0~9 -> no korean, special char

        // nickname: 1~10
        if (input.nickname.length > 0)
            if (input.nickname.length < 1 || input.nickname.length > 10)
                newErrors.nickname = '닉네임은 1자 이상 10자 이내여야 합니다.';

        // id: 4~12 and only eng&number 
        if (input.id.length > 0) {
            if (input.id.length < 4 || input.id.length > 12)
                newErrors.id = 'ID는 4자 이상 12자 이내여야 합니다.';
            else if (!idRegex.test(input.id))
                newErrors.id = 'ID는 영문과 숫자 조합만 가능합니다.';
        }

        // pw
        if (input.pw.length > 0) {
            if (input.pw.length < 8)
                newErrors.pw = '비밀번호는 8자 이상이어야 합니다.';
            else if (input.pw === input.id)
                newErrors.pw = 'ID와 동일한 비밀번호는 사용할 수 없습니다.';
        }

        // pwConfirm
        if (input.pwConfirm.length > 0)
            if (input.pw !== input.pwConfirm)
                newErrors.pwConfirm = '비밀번호가 일치하지 않습니다.';
        
        return newErrors;
    }

    async function handleSubmit() {
        if (!inputs.nickname || !inputs.id || !inputs.pw || !inputs.pwConfirm) { // '' => falsy -> false in if()
            alert('모든 정보를 입력해 주세요!');
            return;
        }

        if (errors.nickname || errors.id || errors.pw || errors.pwConfirm) {
            alert('입력 조건이 올바르지 않습니다. 다시 입력해 주세요.');
            return;
        }

        const payload = {
            userName: inputs.id,
            userPassword: inputs.pw,
            userNickname: inputs.nickname,
        };

        try {
            const response = await axios.post('-/api/auth/signup', payload); // server not deployed yet
            const res = response.data;
            
            if (res.success) {
                alert('회원가입이 완료되었습니다.');
                // navigate('login');
            }
            else
                switch (res.code) {
                    case "901_DUPLICATED_USER_NAME":
                        alert("이미 등록된 아이디입니다.\n다시 입력해 주세요.");
                        break;
                    case "902_DUPLICATED_USER_NICKNAME":
                        alert("이미 등록된 닉네임입니다.\n다시 입력해 주세요.");
                        break;
                    default:
                        alert(res.message + "\n가입 실패");
                        break;
                }
        }
        catch (error) {
                console.error("에러 발생:", error);
                alert("서버와 연결할 수 없습니다.");
            }
    }
    return (
      <Layout onBack={handleBack}>
          <div className='page-title-area'>
              <h1 className='page-title'>뜨개 도아 가입하기</h1>
              <p className='sub-title'>뜨개 도안을 편하게 제작해 보세요</p>
            </div>
        <InputBar 
            label="닉네임" placeholder="10자리 이내의 별명"
            value={inputs.nickname} onChange={handleChange} name="nickname"
            errorMessage={errors.nickname}
        />
        <InputBar 
            label="아이디" placeholder="영문, 숫자 포함 4자리 이상, 12자리 이내"
            value={inputs.id} onChange={handleChange} name="id"
            errorMessage={errors.id}
        />
        <InputBar 
            label="비밀번호" placeholder="8자 이상(영문, 숫자, 특수문자 모두 허용)" type="password"
            value={inputs.pw} onChange={handleChange} name="pw"
            errorMessage={errors.pw}
        />
        <InputBar
            label="비밀번호 확인" placeholder="비밀번호를 한 번 더 입력해 주세요" type="password"
            value={inputs.pwConfirm} onChange={handleChange} name="pwConfirm"
            errorMessage={errors.pwConfirm}
        />

        <button className="submit-btn" onClick={handleSubmit}>가입하기</button>
        </Layout>
    );
}

export default SignUp;