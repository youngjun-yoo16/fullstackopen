import { createContext, useReducer, useContext } from "react";

const notificationReducer = (state, action) => {
  switch (action.type) {
    case "SET_NOTIFICATION":
      return action.data.notification;
    case "REMOVE_NOTIFICATION":
      return "";
    default:
      return state;
  }
};

const NotificationContext = createContext();

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(
    notificationReducer,
    ""
  );

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {/* eslint-disable react/prop-types */}
      {props.children}
    </NotificationContext.Provider>
  );
};

export const useNotificationValue = () => {
  const NotificationAndDispatch = useContext(NotificationContext);
  return NotificationAndDispatch[0];
};

export const useNotificationDispatch = () => {
  const NotificationAndDispatch = useContext(NotificationContext);
  return NotificationAndDispatch[1];
};

export default NotificationContext;
