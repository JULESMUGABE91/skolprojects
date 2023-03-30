import React from 'react';
import {Container} from '../components/Container';
import {Login} from '../components/Login';
import {withNavigation} from 'react-navigation';
import {StatusBar} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      route: props.route || {},
    };
  }

  UNSAFE_componentWillMount() {
    const {navigation} = this.props;
    this.focusListener = navigation.addListener('focus', () => {
      this.setState({
        route: {
          screen: this.props?.route?.params?.screen || '',
          params: this.props?.route?.params?.params || {},
        },
      });
    });
  }

  render() {
    const accentColor = EStyleSheet.value('$accentColor');
    return (
      <Container>
        <StatusBar
          translucent
          barStyle={'dark-content'}
          backgroundColor={accentColor}
        />
        <Login navigation={this.props.navigation} route={this.state.route} />
      </Container>
    );
  }
}

export default withNavigation(LoginScreen);
