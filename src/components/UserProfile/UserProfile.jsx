import './UserProfile.css';
import default_profile_img from '../../assets/icons/User/default_profile_img.png';

export default function UserProfile({ profileImg, nickname }) { // 유저 프사, 닉네임 가져오는 api 연동할 것
    return (
        <div className='user-profile-container'>
            <div className='profile-img-frame'>
                <img className='profile-img'
                    src={profileImg || default_profile_img} alt='profile img' // profileImg가 있으면(=null이 아니면) 그거 쓰고, 없으면 기본 프로필사진
                />
            </div>
            <span className='user-nickname'>{nickname}</span>
        </div>
    );
}