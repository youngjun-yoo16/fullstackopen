import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterReducer";
import anecdoteReducer from "./anecdoteReducer";

const store = configureStore({
  reducer: {
    filter: filterReducer,
    anecdotes: anecdoteReducer,
  },
});

export default store;
