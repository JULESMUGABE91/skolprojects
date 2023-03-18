import React from 'react';
import {SurveyHistory} from '../components/SurveyHistory';
import {Container} from '../components/Container';

class SurveyHistoryScreen extends React.Component {
  render() {
    return (
      <Container>
        <SurveyHistory
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default SurveyHistoryScreen;
