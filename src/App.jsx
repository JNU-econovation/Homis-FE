import { useState, useEffect } from 'react';
import SignUp from '../signup-page/sign-up.jsx';

export default function App() {
    const [inputs, setInputs] = useState( { nickname: '', id: '', pw: '', pwConfirm: ''});

    function handleBack() { // Layout LeftArrow Button EventHandler. <Layout onBack={handleBack}>
      alert('로그인 페이지로 이동');
      // 로그인 페이지 만들면 해당 페이지로 이동...
  }

    return (
      <SignUp />
    )
}