import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    showNotification(state, action) {
      return action.payload;
    },
    removeNotification() {
      return "";
    },
  },
});

export const { showNotification, removeNotification } =
  notificationSlice.actions;

export const setNotification = (text, timeout) => {
  return async (dispatch) => {
    dispatch(showNotification(text));
    const timer = setTimeout(() => {
      dispatch(removeNotification());
    }, timeout * 1000);

    // Cleans up the timer if the component unmounts or if the notification changes before the timer finishes
    return () => {
      clearTimeout(timer);
    };
  };
};

export default notificationSlice.reducer;
