import React from 'react';
import { NavLink } from 'react-router-dom';
import './MenuBar.css';

import iconHome_s from '../../assets/icons/selected/home_s.png';
import iconHome_uns from '../../assets/icons/unselected/home_uns.png';

import iconShopping_s from '../../assets/icons/selected/shopping_s.png';
import iconShopping_uns from '../../assets/icons/unselected/shopping_uns.png';

import iconMyPage_s from '../../assets/icons/selected/mypage_s.png';
import iconMyPage_uns from '../../assets/icons/unselected/mypage_uns.png';

export default function MenuBar() {
    function renderIcon(isActive, activeIcon, inactiveIcon, alt) {
        return (
            <img
                src={isActive ? activeIcon : inactiveIcon}
                alt={alt}
                className='menu-icon'
            />
        );
    }
    return (
        <nav className='menu-bar'>
            { /* 쇼핑 */ }
            <NavLink to='#' className='shopping'>
                { ({isActive}) => renderIcon(isActive, iconShopping_s, iconShopping_uns, '쇼핑') }
            </NavLink>
            { /* 홈 */ }
            <NavLink to='#' className='home'>
                { ({isActive}) => renderIcon(isActive, iconHome_s, iconHome_uns, '홈') }
            </NavLink>
            { /* 마이페이지 */ }
            <NavLink to='#' className='mypage'>
                { ({isActive}) => renderIcon(isActive, iconMyPage_s, iconMyPage_uns, '마이페이지') }
            </NavLink>
        </nav>
    );
}