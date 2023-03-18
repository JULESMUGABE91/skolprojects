import React from 'react';
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';
import styles from './styles';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import {Text} from '../Text';

const {height} = Dimensions.get('screen');

class ScanQR extends React.Component {
  state = {
    result: '',
  };

  handleOpenModal(modal, params) {
    this.refs[modal].open();

    this.setState({result: params});
  }

  handleCloseModal(modal) {
    this.refs[modal].close();
  }

  onSuccess = e => {
    console.log(e.data);
    this.handleOpenModal('resultmodal', e.data);
  };

  render() {
    const bgColor = EStyleSheet.value('$bgColorLight');

    const modal_radius = {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    };

    const modal_styles = StyleSheet.create({
      resultmodal: {
        height: height / 2,
        ...modal_radius,
        backgroundColor: bgColor,
      },
    });

    return (
      <>
        <QRCodeScanner
          onRead={this.onSuccess.bind(this)}
          flashMode={RNCamera.Constants.FlashMode.torch}
          cameraStyle={styles.container}
        />
        <Modal
          style={modal_styles.resultmodal}
          ref="resultmodal"
          position={'bottom'}
          onClosingState={() => this.handleCloseModal('resultmodal')}>
          <Text>{JSON.stringify(this.state.result)}</Text>
        </Modal>
      </>
    );
  }
}
const mapPropsToState = state => {
  const {language} = state.Language;
  const {theme} = state.Theme;
  return {
    language,
    theme,
  };
};

export default connect(mapPropsToState)(ScanQR);
