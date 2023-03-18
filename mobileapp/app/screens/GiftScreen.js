import React from 'react';
import {Gifts} from '../components/Gifts';
import {Container} from '../components/Container';

class GiftScreen extends React.Component {
  render() {
    return (
      <Container>
        <Gifts navigation={this.props.navigation} />
      </Container>
    );
  }
}

export default GiftScreen;
