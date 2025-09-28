import { configureStore } from "@reduxjs/toolkit";
import placesReducer from "./slices/placesSlice";
import uiReducer from "./slices/uiSlice";
import { createEpicMiddleware } from "redux-observable";
import rootEpic from "./epics/searchEpic";

const epicMiddleware = createEpicMiddleware();

const store = configureStore({
  reducer: {
    places: placesReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(epicMiddleware),
});

epicMiddleware.run(rootEpic);

export { store };
