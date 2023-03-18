import {
  ON_SWITCHING_THEME,
  ON_SET_ACCENT_COLOR,
  ON_SET_PRIMARY_COLOR,
} from '../actions/Theme';

//initiate state
const initialState = {
  theme: 'light',
  primary_color: '#D7232C',
  accent_color: '#FDD100',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_SWITCHING_THEME:
      return {
        ...state,
        theme: action.theme,
      };
    case ON_SET_ACCENT_COLOR:
      return {
        ...state,
        accent_color: action.payload,
      };
    case ON_SET_PRIMARY_COLOR:
      return {
        ...state,
        primary_color: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
