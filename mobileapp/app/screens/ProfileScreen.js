import React from 'react';
import {Container} from '../components/Container';
import Profile from '../components/Profile/Profile';

class ProfileScreen extends React.Component {
  render() {
    return (
      <Container>
        <Profile navigation={this.props.navigation} />
      </Container>
    );
  }
}

export default ProfileScreen;
