import {ON_ANSWERING_SURVEY} from '../actions/Survey';

//initiate state
const initialState = {
  surveys: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_ANSWERING_SURVEY:
      if (state.surveys.length > 0) {
        for (let [i, survey] of state.surveys.entries()) {
          if (survey._id === action.payload._id) {
            state.surveys[i] = action.payload;
          }
        }
      } else {
        state.surveys.unshift(action.payload);
      }
      return {
        ...state,
        surveys: [...state.surveys],
      };
    default:
      return state;
  }
};
export default reducer;
