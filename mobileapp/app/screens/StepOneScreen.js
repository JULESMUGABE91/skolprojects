import React from 'react';
import {StatusBar} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {StepOne} from '../components/CompleteProfile';
import {Container} from '../components/Container';

class StepOneScreen extends React.Component {
  render() {
    const bgColorLight = EStyleSheet.value('$bgColorLight');
    return (
      <Container>
        <StatusBar barStyle={'dark-content'} backgroundColor={bgColorLight} />

        <StepOne
          params={this.props.route.params}
          navigation={this.props.navigation}
        />
      </Container>
    );
  }
}

export default StepOneScreen;
