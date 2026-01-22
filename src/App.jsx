import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/signup-page/sign-up.jsx';
import LogIn from './pages/login-page/log-in.jsx';
import MenuBar from './components/Bar/MenuBar/MenuBar.jsx';
import MainPage from './pages/MainPage/MainPage.jsx'
import EraserBtn from './components/Button/EraserBtn/EraserBtn.jsx';
import BrushBtn from './components/Button/BrushBtn/BrushBtn.jsx';
import DesignPage from './pages/DesignPage/DesignPage.jsx'
import DesignSettingModal from './components/Modals/DesignSettingModal/DesignSettingModal.jsx';
import ColorBtn from './components/Button/ColorBtn/ColorBtn.jsx';
import ImageUploadBox from './components/Item/ImageUploadBox/ImageUploadBox.jsx';
import ImagePreviewBox from './components/Item/ImagePreviewBox/ImagePreviewBox.jsx';
import AddItemPage from './pages/AddItemPage/AddItemPage.jsx';
import Dropdown from './components/Dropdown/Dropdown.jsx';
import UploadBtn from './components/Button/UploadBtn/UploadBtn.jsx';
import SaveDetailPage from './pages/SaveDetailPage/SaveDetailPage.jsx';
import LoadingModal from './components/Modals/LoadingModal/LoadingModal.jsx';
import DownloadBtn from './components/Button/DownloadBtn/DownloadBtn.jsx';
import MyDesignDetail from './pages/MyDesignDetail/MyDesignDetail.jsx';
import SingleDownloadBtn from './components/Button/DownloadBtn/SingleDownloadBtn.jsx';
import PurchasedDesignDetailPage from './pages/PurchasedDesignDetailPage/PurchasedDesignDetailPage.jsx';
import ImagePagination from './components/ImagePagination/ImagePagination.jsx';
import MyPage from './pages/MyPage/MyPage.jsx';
import WheelBtn from './components/Button/WheelBtn/WheelBtn.jsx';
import UserSettingModal from './components/Modals/UserSettingModal/UserSettingModal.jsx';
import UserProfile from './components/UserProfile/UserProfile.jsx';
import ProductDetailPage from './pages/ProductDetailPage/ProductDetailPage.jsx';
import ShoppingPage from './pages/ShoppingPage/ShoppingPage.jsx';
import ShoppingDetailPage from './pages/ShoppingDetailPage/ShoppingDetailPage.jsx';
import DeleteConfirmModal from './components/Modals/DeleteConfirmModal/DeleteConfirmModal.jsx';

export default function App() {
  return (
    <BrowserRouter>
        <Routes>
          <Route path='/' element={<LogIn />} />
          <Route path='/signup' element={<SignUp />} />
          <Route path='/login' element={<LogIn />} />
          <Route path='/main' element={<MainPage />} />
          <Route path='/design' element={<DesignPage />} />
          <Route path='/save-detail' element={<SaveDetailPage />} />
          <Route path='/my-design-detail' element={<MyDesignDetail />} />
          <Route path='/purchased-design-detail' element={<PurchasedDesignDetailPage />} />
          <Route path='/add-item' element={<AddItemPage />} />
          <Route path='/my-page' element={<MyPage />} />
          <Route path='/uploaded-product-detail' element={<ProductDetailPage />} />
          <Route path='/shopping-page' element={<ShoppingPage />} />
          <Route path='/shopping-detail' element={<ShoppingDetailPage />} />
        </Routes>

       {/* <ColorBtn /> */}
        {/* <MainPage /> */}
        {/* <EraserBtn /> */}
        {/* <BrushBtn /> */}
        {/* <DesignPage /> */}
        {/* <DesignSettingModal /> */}
        {/* <ImageUploadBox /> */}
        {/* <ImagePreviewBox /> */}
        {/* <AddItemPage /> */}
        {/* <Dropdown 
          options={['코바늘', '대바늘', '코바늘&대바늘', '아프간']}
        /> */}
        {/* <UploadBtn 
          label='파일 등록 (PDF)'
        /> */}
        {/* <SaveDetailPage /> */}
        {/* <LoadingModal text='창작한 도안 저장 중'/> */}
        {/* <DownloadBtn /> */}
        {/* <MyDesignDetail /> */}
        {/* <SingleDownloadBtn /> */}
        {/* <PurchasedDesignDetailPage /> */}
        {/* <ImagePagination /> */}
        {/* <MyPage /> */}
        {/* <WheelBtn /> */}
        {/* <UserSettingModal /> */}
        {/* <UserProfile /> */}
        {/* <DeleteConfirmModal /> */}
    </BrowserRouter>
  );
}