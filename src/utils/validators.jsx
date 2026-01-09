import { signUpAPI, LogInAPI } from './API.jsx';

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

export function handleClickAddItem(inputs, errors, setErrors) {
    const errorValidation = validateInputsForAddItem(inputs, errors);
    setErrors(errorValidation);

    const hasError = Object.values(errors).some(value => value !== ''); // 빈 문자열 아닌 것이 하나라도 있다면 true 반환. 즉, 에러가 있다는 의미
    if (!hasError) {
        // REGISTER ITEM ACI CALL
        return;
    }
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