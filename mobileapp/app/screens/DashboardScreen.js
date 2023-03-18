import React from 'react';
import {connect} from 'react-redux';
import {Container} from '../components/Container';
import {Navbar} from '../components/Navbar';
import {languages} from '../constants/localization';
import Dashboard from '../components/Dashboard/Dashboard';

class DashboardScreen extends React.Component {
  render() {
    const {language} = this.props;
    const {dashboard} = languages[language];

    return (
      <Container>
        <Navbar
          back
          title={dashboard}
          navigation={this.props.navigation}
          filter
        />

        <Dashboard
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  return {
    language,
  };
};

export default connect(mapPropsToState)(DashboardScreen);
