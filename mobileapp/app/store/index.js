import AsyncStorage from '@react-native-async-storage/async-storage';
import {createStore, applyMiddleware} from 'redux';
import logger from 'redux-logger';
import {persistStore, persistReducer} from 'redux-persist';

import reducers from '../reducers';

const middleware = [];

if (process.env.NODE_ENV === 'development') {
  middleware.push(logger);
}

const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
};

const persistedReducer = persistReducer(persistConfig, reducers);

export const store = createStore(
  persistedReducer,
  applyMiddleware(...middleware),
);

export const persistor = persistStore(store);
