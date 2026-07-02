import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../store/store';
import { signIn, signOut } from '../store/auth-slice';

export function useAuth() {
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector((s: RootState) => s.auth.token);

  const login = (email: string, _password: string) => {
    const nextToken = btoa(`${email}:${Date.now()}`);
    dispatch(signIn(nextToken));
  };

  const logout = () => dispatch(signOut());

  return { token, isLoggedIn: !!token, login, logout };
}
