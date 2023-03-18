import React from 'react';
import {Container} from '../components/Container';
import {NewProvider} from '../components/Providers';

class NewProviderScreen extends React.Component {
  render() {
    return (
      <Container>
        <NewProvider
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default NewProviderScreen;
