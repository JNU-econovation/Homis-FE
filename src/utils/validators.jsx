import { signUpAPI } from './API.jsx';

export function validateInputs(input) {
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

    /*
    // pwConfirm
    if (input.pwConfirm.length > 0)
        if (input.pw !== input.pwConfirm)
            newErrors.pwConfirm = '비밀번호가 일치하지 않습니다.';
    */
    return newErrors;
}

export async function validateSubmit(inputs, errors) {
    if (!inputs.nickname || !inputs.id || !inputs.pw) { // '' => falsy -> false in if()
        alert('모든 정보를 입력해 주세요!');
        return false;
    }

    if (errors.nickname || errors.id || errors.pw) {
        alert('입력 조건이 올바르지 않습니다. 다시 입력해 주세요.');
        return false;
    }

    const payload = {
        userName: inputs.id,
        userPassword: inputs.pw,
        userNickname: inputs.nickname,
    };

    return await signUpAPI(payload);
}