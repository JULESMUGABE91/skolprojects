import React from 'react';
import {Container} from '../components/Container';
import {withNavigation} from 'react-navigation';
import {OTPVerify} from '../components/OTPVerify';

class OTPCodeScreen extends React.Component {
  render() {
    return (
      <Container>
        <OTPVerify
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default withNavigation(OTPCodeScreen);
