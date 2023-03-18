import React from 'react';
import {Container} from '../components/Container';
import {SurveyForm} from '../components/SurveyForm';

class SurveyFormScreen extends React.Component {
  render() {
    return (
      <Container>
        <SurveyForm
          params={this.props.route.params}
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}

export default SurveyFormScreen;
