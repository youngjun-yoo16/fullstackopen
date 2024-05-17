import { configureStore } from "@reduxjs/toolkit";
import filterReducer from "./filterReducer";
import anecdoteReducer from "./anecdoteReducer";
import notificationReducer from "./notificationReducer";

const store = configureStore({
  reducer: {
    filter: filterReducer,
    anecdotes: anecdoteReducer,
    notification: notificationReducer,
  },
});

export default store;
