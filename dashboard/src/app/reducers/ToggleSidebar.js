import { ON_TOGGLE } from "../action/ToggleSidebar";

const initialState = {
  show_sidebar: true,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_TOGGLE:
      return {
        ...state,
        show_sidebar: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
