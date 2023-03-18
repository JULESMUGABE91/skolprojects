import React from 'react';
import {Providers} from '../components/Providers';
import {Container} from '../components/Container';

class ProviderScreen extends React.Component {
  render() {
    return (
      <Container>
        <Providers
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default ProviderScreen;
