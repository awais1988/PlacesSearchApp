import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  results: [],
  history: [],
  selectedPlace: null,
  modalVisible: false,
  searchQuery: "",
};

const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    setResults: (state, action) => {
      state.results = action.payload;
    },
    addToHistory: (state, action) => {
      const existingIndex = state.history.findIndex(
        (item) => item.id === action.payload.id
      );

      if (existingIndex >= 0) {
        state.history.splice(existingIndex, 1);
      }

      state.history.unshift({
        ...action.payload,
        searchDate: new Date().toISOString(),
      });

      if (state.history.length > 20) {
        state.history = state.history.slice(0, 20);
      }
    },
    clearHistory: (state) => {
      state.history = [];
    },
    selectPlace: (state, action) => {
      state.selectedPlace = action.payload;
    },
    showModal: (state, action) => {
      state.modalVisible = true;
      state.selectedPlace = action.payload;
    },
    hideModal: (state) => {
      state.modalVisible = false;
      state.selectedPlace = null;
    },
    removeFromHistory: (state, action) => {
      state.history = state.history.filter(
        (item) => item.id !== action.payload
      );
    },
    loadHistoryFromStorage: (state, action) => {
      state.history = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setResults,
  addToHistory,
  clearHistory,
  selectPlace,
  showModal,
  hideModal,
  removeFromHistory,
  loadHistoryFromStorage,
  setSearchQuery,
} = placesSlice.actions;

export default placesSlice.reducer;
