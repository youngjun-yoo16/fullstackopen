import { createSlice } from "@reduxjs/toolkit";

const initialState = "Initial Message";

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    displayNotification(state) {
      return state;
    },
  },
});

export const { displayNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
