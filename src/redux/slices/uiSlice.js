import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  offline: false,
  error: null,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setOffline: (state, action) => {
      state.offline = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
});

export const { setLoading, setOffline, setError, clearError } = uiSlice.actions;
export default uiSlice.reducer;
