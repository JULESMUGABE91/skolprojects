import React from 'react';
import {Container} from '../components/Container';
import Setting from '../components/Setting/Setting';

class SettingScreen extends React.Component {
  render() {
    return (
      <Container>
        <Setting navigation={this.props.navigation} />
      </Container>
    );
  }
}

export default SettingScreen;
