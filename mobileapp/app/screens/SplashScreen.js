import React from 'react';
import SplashScreen from 'react-native-splash-screen';
import LocalStorage from '../utils/storage';

import {Splash} from '../components/Splash';

class CSplashScreen extends React.Component {
  state = {
    notficiation: {},
  };

  componentDidMount = async () => {
    this.handleNavigation();

    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.handleNavigation();
      },
    );
  };

  handleNavigation = async () => {
    setTimeout(async () => {
      let user = await new LocalStorage().get();

      if (user.token) {
        if (user.badge === 'explorer')
          return this.props.navigation.navigate('StepOne');
        if (user.badge === 'adventurer')
          return this.props.navigation.navigate('StepTwo');

        this.props.navigation.navigate('Home');

        return;
      }

      this.props.navigation.navigate('OnBoard');

      SplashScreen.hide();
    }, 3000);
  };
  render() {
    return (
      <>
        <Splash />
      </>
    );
  }
}

export default CSplashScreen;
