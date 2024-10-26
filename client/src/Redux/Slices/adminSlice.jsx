import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  admin: null,
  token: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    addAdmin: (state, action) => {
      state.admin = action.payload.admin;
      state.token = action.payload.token;
    },
    updateAdmin: (state, action) => {
      state.admin = { ...state.admin, ...action.payload };
    },
    logoutAdmin: (state) => {
      state.admin = null;
      state.token = null;
    },
  },
});

export const { addAdmin, updateAdmin, logoutAdmin } = adminSlice.actions;
export default adminSlice.reducer;
