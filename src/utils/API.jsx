import axios from 'axios';

const BASE_URL = 'https://homis-be-hsb0d6bzh8fnafap.koreacentral-01.azurewebsites.net/api';

export async function signUpAPI(payload) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/signup`, payload);
        const res = response.data;

        if (res.success) {
            alert('회원가입이 완료되었습니다.');
            return true;
        }
        return false; // res.success가 false인 2xx 응답 => undefined 반환 방지
    }
    catch (error) {
        if (error.response && error.response.data) { // .response => 서버 응답 && .response.data => .data 필드가 없을 수도 있음(5xx 등의 경우)
            const errRes = error.response.data;

            switch (errRes.code) {
                case "901_DUPLICATED_USER_NAME":
                    alert("이미 등록된 아이디입니다.\n다시 입력해 주세요.");
                    break;
                case "902_DUPLICATED_USER_NICKNAME":
                    alert("이미 등록된 닉네임입니다.\n다시 입력해 주세요.");
                    break;
                default:
                    alert(errRes.message);
                    break;
            }
        }
        else
            alert("서버와 연결할 수 없습니다.")
        return false;
    }
}

export async function LogInAPI(payload, setError) {
    try {
        const response = await axios.post(`${BASE_URL}/auth/login`, payload);
        const res = response.data;

        if (res.success) { // login success
            alert(`${res.data.userNickname}님 환영합니다!`);
            localStorage.setItem('accessToken', res.data.accessToken);
            //console.log(res.data.accessToken); // for test
            return true;
        }
        return false;
    }
    catch (error) {
        if (error.response && error.response.data) {
            const errRes = error.response.data;

            switch (errRes.code) {
                case "002_NOT_USER":
                    setError("존재하지 않는 ID입니다.");
                    break;
                case "903_WRONG_PWD":
                    setError("비밀번호를 다시 입력해 주세요.");
                    break;
                case "500":
                    setError("서버 오류가 발생했습니다.\n잠시 후 다시 시도해 주세요.");
                    break;
            }
            return false;
        }
        else {
            setError("서버와 연결할 수 없습니다.\n잠시 후 다시 시도해 주세요.");
            return false;
        }
    }
}