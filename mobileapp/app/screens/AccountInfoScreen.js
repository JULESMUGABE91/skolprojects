import React from 'react';
import {Container} from '../components/Container';
import AccountInfo from '../components/Accounts/AccountInfo';

class AccountInfoScreen extends React.Component {
  render() {
    return (
      <Container>
        <AccountInfo
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default AccountInfoScreen;
