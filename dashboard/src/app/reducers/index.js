import { combineReducers } from "redux";

import Filters from "./Filters";
import Notification from "./Notification";
import ToggleSidebar from "./ToggleSidebar";

const appReducer = combineReducers({
  Filters,
  Notification,
  ToggleSidebar,
});

const rootReducer = (state, action) => {
  if (action.type === "ON_USER_LOGOUT") {
    state = undefined;
  }
  // console.log(state);
  return appReducer(state, action);
};

export default rootReducer;
