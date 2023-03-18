import React from 'react';
import {QRProfile} from '../components/Profile';
import {Container} from '../components/Container';

class QRProfileScreen extends React.Component {
  render() {
    return (
      <Container>
        <QRProfile
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default QRProfileScreen;
