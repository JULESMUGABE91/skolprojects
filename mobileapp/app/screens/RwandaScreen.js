import React from 'react';
import {Rwanda} from '../components/Rwanda';
import {Container} from '../components/Container';

class RwandaScreen extends React.Component {
  render() {
    return (
      <Container>
        <Rwanda
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default RwandaScreen;
