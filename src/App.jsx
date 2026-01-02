import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/signup-page/sign-up.jsx';
import LogIn from './pages/login-page/log-in.jsx';
import MenuBar from './components/MenuBar/MenuBar.jsx';
import MainPage from './pages/MainPage/MainPage.jsx'

export default function App() {
  return (
    <BrowserRouter>
        {/* <Routes>
          <Route path='/' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<LogIn />} />
        </Routes> */}
       

        <MainPage />
    </BrowserRouter>
  );
}