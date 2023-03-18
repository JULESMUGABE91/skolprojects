import {ON_SET_LOCATION} from '../actions/MyLocation';

//initiate state
const initialState = {
  my_location: {
    latitude: 0,
    longitude: 0,
  },
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ON_SET_LOCATION:
      return {
        ...state,
        my_location: action.payload,
      };
    default:
      return state;
  }
};
export default reducer;
