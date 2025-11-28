import React from 'react';
import './layout.css';

function ArrowLeftIcon() {
    return (
        <svg 
            width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='currentColor'
            strokeWidth='2.5' strokeLinecap='round' strokeLinejoin='round'>
                <path d='M15 18l-6-6 6-6' />
        </svg>
    )
}

function Layout( { children, onBack } ) {
    return (
        <div className="layout">
            {/* 모든 컴포넌트 담을 공간(container) */}
            <div className='container'> 
                {/* 헤더 */}
                <header className='layout-header'>
                    <button className='header-back-btn' onClick={onBack}>
                        <ArrowLeftIcon />
                    </button>
                </header>
            {/* 본문(타이틀 및 입력) */}
            <main className='layout-mainContent'>
                <div className='content-inner'>
                    {children}
                </div>
            </main>
            <footer className='layout-footer'>
                &copy; 2025 Knitting-Doa. All rights reserved.
            </footer>
            </div>
        </div>
    );
}

export default Layout;