import React from 'react';
import {Provider} from 'react-redux';
import AppEntry from './app/index';
import {store, persistor} from './app/store';
import {PersistGate} from 'redux-persist/integration/react';
import {Splash} from './app/components/Splash';
import {GestureHandlerRootView} from 'react-native-gesture-handler';

class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={<Splash />} persistor={persistor}>
          <GestureHandlerRootView style={{flex: 1}}>
            <AppEntry />
          </GestureHandlerRootView>
        </PersistGate>
      </Provider>
    );
  }
}

export default App;
