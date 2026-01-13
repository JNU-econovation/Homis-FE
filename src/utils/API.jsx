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

export async function SaveDesignAPI(requestBody, requestHeader, setUploadProgress) {
    try {
        const response = await axios.post(`${BASE_URL}/design-make/upload-v2`, requestBody, {
            headers: requestHeader,
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total) {
                    const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                    setUploadProgress(progress);
                }
            }
        });
        const res = response.data;

        if (res.success) {
            setUploadProgress(100); // API 호출 성공 시 progress 퍼센트를 100으로 설정
            return true;
        }
        return false;
    }
    catch (error) {
        if (error.response && error.response.data) {
            const errRes = error.response.data;

            switch (errRes) {
                case '400':
                    alert('Request Error');
                    break;
                case '100_UNKNOWN_AUTH_ERROR':
                    alert('알 수 없는 사용자 인증 오류');
                    break;
                case '101_NOT_BEARER_TOKEN':
                    alert('Bearer 토큰이 없습니다.');
                    break;
                case '102_INVALID_ACCESS':
                    alert('JWT 토큰 오류 발생');
                    break;
                case '103_EXPIRED_ACCESS':
                    alert('액세스 토큰이 만료되었습니다. 재발급 필요');
                    break;
                case '105_NOT_FOUND_USER':
                    alert('존재하지 않는 사용자에 대한 토큰');
                    break;
                case '005_BLOB_FAILED_UPLOAD_FILE':
                    alert('Blob Storage에 파일 업로드 실패');
                    break;
                case '006_UNKNOWN_FAILED_UPLOAD_FILE':
                    alert('알 수 없는 파일 업로드 오류');
                    break;
                case '007_FAILED_LOAD_PDF':
                    alert('PDF byte 배열 로드 실패');
                    break;
                case '008_FAILED_ADD_IMG_TO_PDF':
                    alert('PDF에 도안 이미지 추가 중 오류 발생');
                    break;
                case '009_FAILED_LOAD_FONT':
                    alert('PDF용 폰트 파일 로드 실패');
                    break;
                case '0010_FAILED_SAVE_PDF':
                    alert('PDF 파일 저장 실패');
                    break;
                case '0011_PDFBOX_FAILED_SETTING_STREAM':
                    alert('PDF 파일 작성 stream 세팅 중 오류 발생');
                    break;
                case '0012_PDFBOX_FAILED_NEW_PAGE':
                    alert('PDF 파일 내 새 페이지 추가 중 오류 발생');
                    break;
                case '0013_PDFBOX_FAILED_NEW_LINE':
                    alert('PDF 파일 내 텍스트 작성 중 줄바꿈 시 오류 발생');
                    break;
                case '0014_PDFBOX_FAILED_WRITE_LINE':
                    alert('PDF 파일 내 텍스트 작성 실패');
                    break;
                case '0015_PDFBOX_FAILED_WRAPPING':
                    alert('PDF 폭 너비 맞춰 텍스트 처리 중 오류');
                    break;
                case '0016_PDFBOX_FAILED_CLOSE':
                    alert('텍스트 전용 PDF 파일 작성 stream 닫기 실패');
                    break;
            }
            return false;
        }
        else {
            alert('서버와 연결할 수 없습니다.\n잠시 후 다시 시도해 주세요.');
            return false;
        }
    }
}

export function getAccessToken() {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken;
}

export async function designIMadeAPI(requestHeader) {
    try {
        const response = await axios.get(`${BASE_URL}/design-make/preview`, {
            headers: requestHeader
        });
        const res = response.data;

        if (res.success) {
            return res.data;
        }
        return false;
    }
    catch (error) {
        if (error.response && error.response.data) {
            const  errRes = error.response.data;

            switch (errRes) {
                case '100_UNKNOWN_AUTH_ERROR':
                    alert('알 수 없는 사용자 인증 오류');
                    break;
                case '101_NOT_BEARER_TOKEN':
                    alert('Bearer 토큰이 없습니다.');
                    break;
                case '102_INVALID_ACCESS':
                    alert('JWT 토큰 오류 발생');
                    break;
                case '103_EXPIRED_ACCESS':
                    alert('액세스토큰이 만료되었습니다. 재발급 필요');
                    break;
                default:
                    alert('500 Internal Server Error');
                    break;
                
            }
            return false;
        }
        else {
            alert('서버와 연결할 수 없습니다.\n잠시 후 다시 시도해 주세요.');
            return false;
        }
    }
}