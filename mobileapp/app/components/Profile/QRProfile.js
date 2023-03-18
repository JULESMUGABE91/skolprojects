import React from 'react';
import {View, Dimensions, TouchableOpacity, Platform} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles';
import LocalStorage from '../../utils/storage';
import {USER_PHOTO_PLACEHOLDER} from '../../constants/strings';
import QRCode from 'react-native-qrcode-svg';

import axios from 'axios';
import {GOOGLE_PLAY_STORE, APPLE_STORE} from '../../constants/strings';
import toastMessage from '../../utils/toastMessage';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from '../Button';
import {Loading} from '../Loading';
import Share from 'react-native-share';
import RNFetchBlob from 'rn-fetch-blob';
import ViewShot from 'react-native-view-shot';
import uuid4 from '../../utils/uuid4';

const {width} = Dimensions.get('screen');
const fs = RNFetchBlob.fs;

class QRProfile extends React.Component {
  constructor() {
    super();

    this.refShot = React.createRef();

    this.state = {
      user: {},
    };
  }

  componentDidMount = async () => {
    this.initiateProfile();

    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.initiateProfile();
      },
    );
  };

  initiateProfile = async () => {
    const user = await new LocalStorage().get();

    this.setState({
      user,
      survey: this.props.params.survey,
      balance: this.props.params.balance,
    });
  };

  gotoScreen(screen, params) {
    this.props.navigation.navigate(screen, params);
  }

  shareDetails() {
    const {user} = this.state;

    this.setState({isShooting: true});

    this.refShot?.current.capture().then(uri => {
      let shareImage = {
        title: user.firstname + ' ' + user.lastname,
        message: `I would like to invite to visit my profile, you can download Skole App from ${
          Platform.OS === 'android' ? GOOGLE_PLAY_STORE : APPLE_STORE
        } to scan this QR open the app go to your profile and click scan QR`,
        url: uri,
      };
      Share.open(shareImage)
        .then(res => {
          console.log(res);
          this.setState({isShooting: false});
        })
        .catch(err => {
          err && toastMessage(err);

          this.setState({isShooting: false});
        });
    });
  }

  render() {
    return (
      <>
        <View style={styles.qr_profile_header}>
          <View style={{flex: 1}} />
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <View style={styles.qr_close_container}>
              <MaterialCommunityIcons name="close" style={styles.qr_close} />
            </View>
          </TouchableOpacity>
        </View>
        {this.state.isLoading ? (
          <Loading />
        ) : (
          <>
            <View style={styles.qr_profile_container}>
              <ViewShot
                ref={this.refShot}
                options={{
                  fileName:
                    this.state.user.firstname +
                    '_' +
                    this.state.user.lastname +
                    '_' +
                    uuid4(),
                  format: 'jpg',
                  quality: 0.9,
                }}>
                <View style={styles.qr_profile_shot}>
                  <QRCode
                    value={
                      this.state.user._id +
                      '__' +
                      this.state.user.firstname +
                      '__' +
                      this.state.user.lastname +
                      '__' +
                      this.state.user.phone +
                      '__balance_' +
                      this.state.balance +
                      '__totalsurvey_' +
                      this.state.survey
                    }
                    logo={{
                      uri: this.state?.user?.file || USER_PHOTO_PLACEHOLDER,
                    }}
                    logoSize={38}
                    logoBorderRadius={20}
                    size={width / 2}
                  />
                </View>
              </ViewShot>
            </View>
            <View style={{padding: 30, backgroundColor: '#fff'}}>
              <Button
                text="Share QR Code"
                onPress={this.shareDetails.bind(this)}
              />
            </View>
          </>
        )}
      </>
    );
  }
}
const mapPropsToState = state => {
  const {language} = state.Language;
  const {theme, primary_color, accent_color} = state.Theme;
  return {
    language,
    theme,
    primary_color,
    accent_color,
  };
};

export default connect(mapPropsToState)(QRProfile);
