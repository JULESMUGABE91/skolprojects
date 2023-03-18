import { ON_CLEAR_FILTERS, ON_FILTER } from "../action/Filters";

const getStorage = (key) => {
  let storage = localStorage.getItem(key);
  return storage !== "undefined" ? JSON.parse(storage) : {};
};

const setLocalStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
const local_storage_data = getStorage("zawadi_filters")
  ? getStorage("zawadi_filters")
  : {};

console.log({ local_storage_data });

const initialState = {
  filters: local_storage_data,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_FILTER:
      let keys = Object.keys(action.payload);

      for (let i = 0; i < keys.length; i++) {
        state.filters[keys[i]] = action.payload[keys[i]];
      }

      setLocalStorage("zawadi_filters", state.filters);

      return {
        ...state,
        filters: { ...state.filters },
      };
    case ON_CLEAR_FILTERS:
      state.filters = {};

      setLocalStorage("zawadi_filters", state.filters);

      return {
        ...state,
        filters: { ...state.filters },
      };
    default:
      return state;
  }
};
export default reducer;
