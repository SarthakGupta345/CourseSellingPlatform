import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface tokens {
  access: string,
  refresh: string
}
interface User {
  id: string,
  email: string
  name: string
}
interface AuthState {
  user: User | null;
  token: tokens | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
};


const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setAuth, logout, } = authSlice.actions;
export default authSlice.reducer;
