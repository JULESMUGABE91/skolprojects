export const ON_ADD_NOTIFICATION = "ON_ADD_NOTIFICATION";
export const ON_READ_NOTIFICATION = "ON_READ_NOTIFICATION";
export const ON_CLEAR_ALL = "ON_CLEAR_ALL";
export const ON_ADD_COUNTS = "ON_ADD_COUNTS";
export const ON_CLEAR_COUNT = "ON_CLEAR_COUNT";
export const ON_TOGGLE_ALL_NOTIFICATION = "ON_TOGGLE_ALL_NOTIFICATION";

export const onAddCounts = (counts) => {
  return {
    type: ON_ADD_COUNTS,
    counts,
  };
};

export const onClearCount = (count) => {
  return {
    type: ON_CLEAR_COUNT,
    count,
  };
};

export const onAddNotification = (notification) => {
  return {
    type: ON_ADD_NOTIFICATION,
    notification,
  };
};

export const onReadNotification = (notification) => {
  return {
    type: ON_READ_NOTIFICATION,
    notification,
  };
};

export const onClearAll = () => {
  return {
    type: ON_CLEAR_ALL,
  };
};

export const onToggleAllNotification = (payload) => {
  return {
    type: ON_TOGGLE_ALL_NOTIFICATION,
    payload,
  };
};
