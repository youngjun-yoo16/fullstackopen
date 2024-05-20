import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { removeNotification } from "../reducers/notificationReducer";

const Notification = () => {
  const dispatch = useDispatch();
  const notification = useSelector(({ notification }) => {
    return notification;
  });

  const style = {
    border: "solid",
    padding: 10,
    borderWidth: 1,
    marginBottom: 20,
  };

  useEffect(() => {
    if (notification && notification !== "") {
      const timer = setTimeout(() => {
        dispatch(removeNotification());
      }, 5000);

      // Cleans up the timer if the component unmounts or if the notification changes before the timer finishes
      return () => clearTimeout(timer);
    }
  }, [dispatch, notification]);

  // When we remove the notification after the timer finishes, the notification is set to "" and hence returns null
  if (!notification || notification === "") {
    return null; // This will render nothing if notification is an empty string or undefined/null
  }

  return (
    <div style={style}>
      {notification.type === "create"
        ? "You created '" + notification.content + "'"
        : "You voted '" + notification.content + "'"}
    </div>
  );
};

export default Notification;
