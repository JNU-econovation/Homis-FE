import { signUpAPI, LogInAPI, addItemAPI } from './API.jsx';

export function validateInputs(input) {
    const newErrors = { nickname: '', id: '', pw: '', pwConfirm: '' };
    const idRegex = /^[a-zA-Z0-9]*$/; // only a~z, A~Z, 0~9 -> no korean, special char

    // nickname: 1~10
    if (input.nickname.length > 0)
        if (input.nickname.length < 1 || input.nickname.length > 10)
            newErrors.nickname = '닉네임을 10자 이내로 입력해주세요.';

    // id: 4~12 and only eng&number 
    if (input.id.length > 0) {
        if (input.id.length < 4 || input.id.length > 12)
            newErrors.id = 'ID를 4~12자로 입력해주세요.';
        else if (!idRegex.test(input.id))
            newErrors.id = 'ID는 영문과 숫자 조합만 가능합니다.';
    }

    // pw
    if (input.pw.length > 0) {
        if (input.pw.length < 8)
            newErrors.pw = '비밀번호를 8자 이상 입력해주세요.';
        else if (input.pw === input.id)
            newErrors.pw = 'ID와 동일한 비밀번호는 사용할 수 없습니다.';
    }

    // pwConfirm
    if (input.pwConfirm.length > 0)
        if (input.pw !== input.pwConfirm)
            newErrors.pwConfirm = '비밀번호가 일치하지 않습니다.';

    return newErrors;
}

export function validateAddItemDescription(input, errors) {
    if (input.description.length <= 0) {
        errors.description = '*값을 입력해 주세요.';
    }
    if (input.description.length > 1000)
        errors.description = `*입력할 수 있는 글자 수를 초과했습니다.${`(${input.description.length}/1000자)`}`;

    return errors;
}

export function validateInputsForAddItem(input, errors) {
    const newErrors = {
        mainImg: '',
        itemName: '',
        itemType: '',
        usedNeedle: '',
        size: '',
        gauge: '',
        description: '',
        threadUsage: '',
        price: '',
    };
    newErrors.description = errors.description; // 이거 없으면 버튼 클릭 시 description 에러 문구가 날라가서, backup 해두는 것
    const within_30 = '*30자 내로 입력해주세요.';

    /* Object.entries() => object -> array로 변환 */
    Object.entries(input).forEach(([key, value]) => {
        if (value.length <= 0)
            newErrors[key] = '*값을 입력해 주세요.';
    });
    /*
    if (value.length <= 0) => input 객체 안에는 String 요소만 있어야 함 -> .length 속성 없는 요소도 존재? -> 해당 요소들의 .length 접근 -> error
    아무런 값도 입력되지 않았다면, inputs를 초기화한 대로 ''일 것
    ''.length => 0 반환 -> 아무런 값도 입력되지 않았음을 의미하므로, error를 입력
    이 로직은 inputs에 String 값만 존재할 때만 동작할 수 있음.
    null값 등을 넣는다면, null.length 구조가 되어 런타임 중 뻗음. !! null값 안 들어가는 것을 보장해야 함!

    length 필드가 존재할 때만 검사하도록 조건 추가
    length field가 없는 요소라면, short circuit rule에 의해 value.length <= 0는 수행하지도 않음 -> 틀린 해석. inputs의 초기 상태('')가 보장되는 이상, 불필요한 조건
    대표 이미지를 지울 때 inputs.mainImg를 null로 초기화해서 발생했던 문제였고, inputs.mainImg=''가 보장되는 지금으로썬 문제될 게 없음.
    */

    if (!input.mainImg)
        newErrors.mainImg = '대표 이미지 등록 안 됨';

    if (input.itemName.length > 16)
        newErrors.itemName = '*상품명을 16자 이내로 입력해주세요.';

    if (input.usedNeedle.length > 30)
        newErrors.usedNeedle = within_30;

    if (input.size.length > 30)
        newErrors.size = within_30;

    if (!input.itemType)
        newErrors.itemType = '타입 선택 안 됨';

    if (input.gauge.length > 30)
        newErrors.gauge = within_30;

    if (!input.registeredFile)
        newErrors.registeredFile = '파일 업로드 안 됨';

    if (input.threadUsage.length > 30)
        newErrors.threadUsage = within_30;
    return newErrors;
}

export async function validateSubmit(inputs, errors) {
    if (!inputs.nickname || !inputs.id || !inputs.pw || !inputs.pwConfirm) { // '' => falsy -> false in if()
        alert('모든 정보를 입력해 주세요!');
        return false;
    }

    if (errors.nickname || errors.id || errors.pw || errors.pwConfirm) {
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

// event handler for all inputs in InputBar component
export function handleChange(e, inputs, setInputs, setErrors = null) {
    const { name, value } = e.target;
    const nextInputs = { ...inputs, [name]: value };
    setInputs(nextInputs);

    if (setErrors != null) {
        const errorValidation = validateInputs(nextInputs);
        setErrors(errorValidation);
    }
}

export function handleChangeForAddItem(e, inputs, setInputs, errors, setErrors = null) {
    const { name, value } = e.target;
    const nextInputs = { ...inputs, [name]: value };
    setInputs(nextInputs);

    /*
    Description에 대한 change는 setErrors에 함수가 넘어와서 해당 명령을 수행함.
    즉, Description일 때만 true가 추가로 전달돼서, 이때에는 Description에 대한 error만 검사하도록 흐름 제어
    */
    if (setErrors != null) {
        if (errors.description.length <= 1000) {
            errors.description = '';
            setErrors(errors);
        }
        const errorValidation = validateAddItemDescription(nextInputs, errors);
        setErrors(errorValidation);
    }
}

export async function handleClickAddItem(inputs, subImages, errors, setErrors, navigate) {
    const errorValidation = validateInputsForAddItem(inputs, errors);
    setErrors(errorValidation);

    const hasError = Object.values(errorValidation).some(value => value !== ''); // 빈 문자열 아닌 것이 하나라도 있다면 true 반환. 즉, 에러가 있다는 의미
    if (!hasError) {
        const apiRes = await addItemAPI(inputs, subImages, navigate);
        if (apiRes) {
            alert('판매 등록 완료');
            return true;
        }
        else {
            alert('판매 등록 실패. 다시 시도해 주세요.');
            return false;
        }
    }
    // console.log('api 호출안됨');
}

export async function validateLogIn(inputs, setError) {
    if (!inputs.id || !inputs.pw) {
        setError('아이디와 비밀번호 모두 입력해 주세요.');
        return false;
    }

    const payload = {
        userName: inputs.id,
        userPassword: inputs.pw,
    };

    return await LogInAPI(payload, setError);
}