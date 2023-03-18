import React from 'react';
import {Container} from '../components/Container';
import {Accounts} from '../components/Accounts';

class AccountScreen extends React.Component {
  render() {
    return (
      <Container>
        <Accounts
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default AccountScreen;
