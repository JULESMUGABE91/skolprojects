import {
  ON_ADD_NOTIFICATION,
  ON_CLEAR_ALL,
  ON_READ_NOTIFICATION,
  ON_ADD_COUNTS,
  ON_CLEAR_COUNT,
  ON_TOGGLE_ALL_NOTIFICATION,
} from "../action/Notification";

const getStorage = (key) => {
  let storage = localStorage.getItem(key);
  return storage !== "undefined" ? JSON.parse(storage) : {};
};

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const local_storage_data = getStorage("notifications")
  ? getStorage("notifications")
  : [];

let user = getStorage("cleankigali") ? getStorage("cleankigali") : {};

const initialState = {
  notifications: local_storage_data,
  counts: {},
  receive_all_notification: user.notification ? user.notification : false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_ADD_NOTIFICATION:
      let notification_ids = [];

      for (let i = 0; i < state.notifications.length; i++) {
        if (!notification_ids.includes(state.notifications[i].id)) {
          notification_ids.push(state.notifications[i].id);
        }
      }

      if (!notification_ids.includes(action.notification.id)) {
        state.notifications.push(action.notification);
      } else {
        console.log("I am here");
      }

      setLocalStorage("notifications", state.notifications);

      return {
        ...state,
        notifications: [...state.notifications],
      };
    case ON_READ_NOTIFICATION:
      for (let i = 0; i < state.notifications.length; i++) {
        if (state.notifications[i]._id === action.notification._id) {
          state.notifications.splice(i, 1);
        }
      }

      setLocalStorage("notifications", state.notifications);

      return {
        ...state,
        notifications: [...state.notifications],
      };
    case ON_CLEAR_ALL:
      setLocalStorage("notifications", []);

      return {
        ...state,
        notifications: [],
      };
    case ON_ADD_COUNTS:
      setLocalStorage("notifications", action.counts);

      return {
        ...state,
        counts: { ...action.counts },
      };
    case ON_CLEAR_COUNT:
      delete state.counts[action.count];

      setLocalStorage("notifications", state.counts);

      return {
        ...state,
        counts: { ...state.counts },
      };
    case ON_TOGGLE_ALL_NOTIFICATION:
      user.notification = action.payload;

      setLocalStorage("cleankigali", user);

      return {
        ...state,
        receive_all_notification: action.payload,
      };
      break;
    default:
      return state;
  }
};
export default reducer;
