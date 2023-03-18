import {combineReducers} from 'redux';

import Theme from './Theme';
import Language from './Language';
import Survey from './Survey';
import MyLocation from './MyLocation';

const appReducer = combineReducers({
  Theme,
  Language,
  Survey,
  MyLocation,
});

const rootReducer = (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    return appReducer(undefined, action);
  }

  return appReducer(state, action);
};

export default rootReducer;
