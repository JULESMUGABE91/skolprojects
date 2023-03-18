import React from 'react';
import {connect} from 'react-redux';
import {Container} from '../components/Container';
import {Navbar} from '../components/Navbar';
import {languages} from '../constants/localization';
import Reward from '../components/Reward/Reward';

class RewardScreen extends React.Component {
  render() {
    const {language} = this.props;
    const {rewards, no_survey_title, no_survey_description} =
      languages[language];

    return (
      <Container>
        <Navbar title={rewards} navigation={this.props.navigation} scan />

        <Reward navigation={this.props.navigation} params={this.props.params} />
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

export default connect(mapPropsToState)(RewardScreen);
