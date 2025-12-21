import axios from 'axios';

export async function signUpAPI(payload) {
    try {
        const response = await axios.post('-/api/auth/signup', payload); // server not deployed yet
        const res = response.data;

        if (res.success) {
            alert('회원가입이 완료되었습니다.');
            return true;
        }
        else {
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
            return false;
        }
    }
    catch (error) {
        console.error("에러 발생:", error);
        alert("서버와 연결할 수 없습니다.");
        return false;
    }
}