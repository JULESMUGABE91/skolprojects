import React from 'react';
import {StatusBar} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {StepTwo} from '../components/CompleteProfile';
import {Container} from '../components/Container';

class StepTwoScreen extends React.Component {
  render() {
    const bgColorLight = EStyleSheet.value('$bgColorLight');
    return (
      <Container>
        <StatusBar barStyle={'dark-content'} backgroundColor={bgColorLight} />

        <StepTwo
          params={this.props.route.params}
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}

export default StepTwoScreen;
