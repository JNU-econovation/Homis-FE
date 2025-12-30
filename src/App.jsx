import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/signup-page/sign-up.jsx';
import LogIn from './pages/login-page/log-in.jsx';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<LogIn />} /> { /* basic addr: '/'} */}
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<LogIn />} />
        </Routes>
    </BrowserRouter>
  );
}