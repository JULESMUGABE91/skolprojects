import React from 'react';
import {Container} from '../components/Container';
import Success from '../components/Success/Success';

class SuccessScreen extends React.Component {
  render() {
    return (
      <Container>
        <Success
          params={this.props.route.params}
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}

export default SuccessScreen;
