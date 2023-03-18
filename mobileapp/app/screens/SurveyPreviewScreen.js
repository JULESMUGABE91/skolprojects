import React from 'react';
import {Container} from '../components/Container';
import {SurveyPreview} from '../components/SurveyPreview';

class SurveyPreviewScreen extends React.Component {
  render() {
    return (
      <Container>
        <SurveyPreview
          navigation={this.props.navigation}
          params={this.props.route.params}
        />
      </Container>
    );
  }
}

export default SurveyPreviewScreen;
