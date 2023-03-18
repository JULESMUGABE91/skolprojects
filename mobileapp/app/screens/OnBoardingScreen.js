import React from 'react';
import {Container} from '../components/Container';
import {Onboard} from '../components/Onboard';

class OnBoardingScreen extends React.Component {
  render() {
    return (
      <Container>
        <Onboard navigation={this.props.navigation} />
      </Container>
    );
  }
}

export default OnBoardingScreen;
