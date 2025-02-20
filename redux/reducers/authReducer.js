import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
  saveUserinput: false,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      const { user, access_token } = action.payload?.data || {};
      state.isLoading = false;
      state.user = user;
      state.token = access_token;
      state.error = null;
      localStorage.setItem("access_token", access_token);
      localStorage.setItem("user", JSON.stringify(user));
    },
    loginFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.reload();
      webengage.user.logout();
      console.log("user-logout-webengage");
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    saveUser: (state, action) => {
      state.saveUserinput = action.payload?.data;
    },
  },
});

export const {
  loginStart,
  loginSuccess,
  loginFailure,
  clearError,
  logout,
  setUser,
  clearUser,
  saveUser,
} = authSlice.actions;

export default authSlice.reducer;
