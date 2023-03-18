import React from 'react';
import {Appearance} from '../components/Appearance';
import {Container} from '../components/Container';

class AppearanceScreen extends React.Component {
  render() {
    return (
      <Container>
        <Appearance navigation={this.props.navigation} />
      </Container>
    );
  }
}

export default AppearanceScreen;
