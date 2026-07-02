import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useAuth } from './hooks/useAuth';
import Toast from './components/Toast';
import { showToast } from './store/toast-slice';
import type { AppDispatch } from './store/store';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoggedIn, logout } = useAuth();
  const dispatch = useDispatch<AppDispatch>();

  const handleAuthClick = () => {
    if (isLoggedIn) {
      logout();
      dispatch(showToast('로그아웃되었어요'));
    } else {
      navigate('/signin', { state: { from: location.pathname } });
    }
  };

  const handleTitleClick = () => navigate('/');

  return (
    <div className="screen">
      <header className="app-header">
        <button className="header-link" onClick={handleTitleClick}>
          은퇴현금 설계센터
        </button>
        <div className="app-header-actions">
          <button className="header-link" onClick={handleAuthClick}>
            {isLoggedIn ? '로그아웃' : '로그인'}
          </button>
        </div>
      </header>
      <Outlet />
      <footer className="app-footer">
        © 2026 은퇴현금 설계센터 · 진단은 참고용 예측입니다.
      </footer>
      <Toast />
    </div>
  );
}
