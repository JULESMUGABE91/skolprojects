import {ON_SWITCHING_LANGUAGE} from '../actions/Language';

//initiate state
const initialState = {
  language: 'english',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_SWITCHING_LANGUAGE:
      return {
        ...state,
        language: action.language,
      };
    default:
      return state;
  }
};
export default reducer;
