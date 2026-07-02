import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { setLocalStorage, removeLocalStorage } from '../utils/local-storage';

interface AuthState {
  token: string | null;
}

function readInitialToken(): string | null {
  try {
    return localStorage.getItem('retirement_token');
  } catch {
    return null;
  }
}

const initialState: AuthState = { token: readInitialToken() };

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    signIn(state, action: PayloadAction<string>) {
      state.token = action.payload;
      setLocalStorage('retirement_token', action.payload);
    },
    signOut(state) {
      state.token = null;
      removeLocalStorage('retirement_token');
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export default authSlice.reducer;
