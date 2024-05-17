import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: "",
  reducers: {
    setNotificationByCreate(state, action) {
      return {
        content: action.payload,
        type: "create",
      };
    },
    setNotificationByUpvote(state, action) {
      return {
        content: action.payload,
        type: "upvote",
      };
    },
    removeNotification() {
      return "";
    },
  },
});

export const {
  setNotificationByCreate,
  setNotificationByUpvote,
  removeNotification,
} = notificationSlice.actions;
export default notificationSlice.reducer;
