import React from 'react';
import {Container} from '../components/Container';
import {QuestionForm} from '../components/SurveyForm';

class QuestionFormScreen extends React.Component {
  render() {
    return (
      <Container>
        <QuestionForm
          params={this.props.route.params}
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}

export default QuestionFormScreen;
