import React from 'react';
import {Container} from '../components/Container';
import {ScanQR} from '../components/ScanQR';

class ScanQRScreen extends React.Component {
  render() {
    return (
      <Container>
        <ScanQR
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default ScanQRScreen;
