import React from 'react';
import {Container} from '../components/Container';
import {MyAccount} from '../components/MyAccount';

class MyAccountScreen extends React.Component {
  render() {
    return (
      <Container>
        <MyAccount navigation={this.props.navigation} />
      </Container>
    );
  }
}

export default MyAccountScreen;
