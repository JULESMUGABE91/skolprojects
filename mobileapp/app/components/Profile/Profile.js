import React from 'react';
import {
  FlatList,
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Text} from '../Text';
import styles from './styles';
import {ListItem} from '../List';
import LocalStorage from '../../utils/storage';
import {APP_ID, USER_PHOTO_PLACEHOLDER, URL} from '../../constants/strings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import axios from 'axios';
import {ROOT_API} from '../../constants/strings';
import toastMessage from '../../utils/toastMessage';
import generateOTP from '../../utils/generateOTP';
import {Button} from '../Button';
import {Input} from '../Input';
import Share from 'react-native-share';
import ImageChoice from '../ImageComponent/ImageChoice';
import Modal from 'react-native-modalbox';
import EStyleSheet from 'react-native-extended-stylesheet';
import uploadImage from '../../utils/image/uploadImage';
import imageUploadHandler from '../../utils/image/imageUploadHandler';

class Profile extends React.Component {
  state = {
    user: {},
    reward: '...',
    survey: '...',
    link: '',
    invites: 0,
    referral_code: '',
  };

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

    this.setState(
      {
        user,
        link: `${URL}/invite?org=${APP_ID}&uid=${user._id}&ref=${generateOTP(
          4,
        )}`,
      },
      () => {
        this.getRewards(true);
        this.getSurveys(true);
        this.getInvites(true);
      },
    );
  };

  gotoScreen(screen, params) {
    this.props.navigation.navigate(screen, params);
  }

  getRewards(isLoading) {
    this.setState({isLoading});

    const {user} = this.state;

    let body = {
      user: user.user_id,
    };

    const options = {
      method: 'POST',
      url: `${ROOT_API}/reward/fetch`,

      data: body,
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
    axios(options)
      .then(data => {
        if (data.data.length > 0) {
          return this.setState({reward: Math.round(data.data[0].total_reward)});
        }
        this.setState({isLoading: false, reward: 0});
      })
      .catch(error => {
        console.log(error.response);
        toastMessage(error);

        this.setState({isLoading: false});
      });
  }

  getSurveys(isLoading) {
    this.setState({isLoading});

    const {user} = this.state;

    const options = {
      method: 'GET',
      url: `${ROOT_API}/user/survey?user=${user.user_id}`,
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
    axios(options)
      .then(data => {
        if (data.data.length > 0) {
          return this.setState({survey: data.data.length});
        }
        this.setState({isLoading: false, survey: 0});
      })
      .catch(error => {
        console.log(error.response);
        toastMessage(error);

        this.setState({isLoading: false, survey: 0});
      });
  }

  getInvites(isLoadingLinkCount) {
    this.setState({isLoadingLinkCount});

    const {user, link} = this.state;

    const options = {
      method: 'GET',
      url: `${ROOT_API}/invites?type=profile&organization=${APP_ID}&author=${user._id}&link=${link}`,
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };
    axios(options)
      .then(data => {
        if (data.data.length > 0) {
          return this.setState({invites: data.data[0].count});
        }
        this.setState({isLoadingLinkCount: false, invites: 0});
      })
      .catch(error => {
        console.log(error.response);
        toastMessage(error);

        this.setState({isLoadingLinkCount: false, invites: 0});
      });
  }

  onLogout = async () => {
    await new LocalStorage().clear();

    await this.props.dispatch({type: 'USER_LOGOUT'});

    this.props.navigation.navigate('Splash');
  };

  onShareLink() {
    const {link} = this.state;

    this.setState({isSharing: true});

    let options = {
      title: 'Hey! Join Skol app today',
      message: `An amazing Skol app survey to win some of our prizes. Get your app today by download it at ${link}. Best`,
    };

    Share.open(options)
      .then(res => {
        console.log(res);
        this.setState({isSharing: false});
      })
      .catch(err => {
        err && toastMessage(err);

        this.setState({isSharing: false});
      });
  }

  handleOpenModal(modal) {
    this.refs[modal].open();
  }

  handleCloseModal(modal) {
    this.refs[modal].close();
  }

  onPressImageMenu = async params => {
    await this.handleImage(params.type);
  };

  handleImage = async type => {
    const {user} = this.state;

    try {
      const image_obj = await imageUploadHandler(type);

      this.setState({
        isSubmitting: true,
      });

      const image_url = await uploadImage(image_obj, user.token);

      if (image_url?.length > 0) {
        await this.updateProfile(image_url[0]);
      }

      this.setState({
        isSubmitting: false,
      });

      this.handleCloseModal('upload_menus');
    } catch (error) {
      toastMessage(error);

      this.setState({isSubmitting: false, file: {}});
    }
  };

  updateProfile = async file => {
    const {user} = this.state;
    this.setState({isSubmitting: true});

    const options = {
      method: 'POST',
      url: `${ROOT_API}/user/update`,
      data: {
        file,
        id: user.user_id,
      },
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    return await axios(options)
      .then(async data => {
        this.setState({isSubmitting: false});

        console.log(data.data);

        await new LocalStorage().set({
          ...user,
          file,
        });

        this.initiateProfile();

        toastMessage('Profile image has been updated successfully');
      })
      .catch(error => {
        this.setState({isSubmitting: false});

        toastMessage('Something wrong, please try again');
      });
  };

  render() {
    const {language, theme} = this.props;
    const {my_account} = languages[language];

    const items = [
      {
        title: my_account,
        right_icon: 'chevron-right',
        left_icon: 'account-edit-outline',
        onPress: () => this.gotoScreen('MyAccount'),
      },
      {
        title: 'Zawadi',
        onPress: () => this.gotoScreen('Gifts'),
        right_icon: 'chevron-right',
        left_icon: 'gift-open-outline',
      },
      {
        title: 'Survey History',
        onPress: () => this.gotoScreen('SurveyHistory'),
        right_icon: 'chevron-right',
        left_icon: 'archive-clock-outline',
      },
      {
        title: 'Scan QR',
        onPress: () => this.gotoScreen('ScanQR'),
        right_icon: 'chevron-right',
        left_icon: 'qrcode',
      },
      {
        title: 'Accounts',
        onPress: () => this.gotoScreen('Accounts'),
        right_icon: 'chevron-right',
        left_icon: 'account-group',
        permission: ['super_admin', 'admin'],
      },
      {
        title: 'Settings',
        onPress: () => this.gotoScreen('Settings'),
        right_icon: 'chevron-right',
        left_icon: 'cog-outline',
      },
    ];

    const bgColor = EStyleSheet.value('$bgColorLight');

    const modal_radius = {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    };

    const modal_styles = StyleSheet.create({
      upload_menus: {
        height: 110,
        ...modal_radius,
        backgroundColor: bgColor,
      },
    });

    return (
      <>
        <View style={styles.container}>
          <View style={styles.profile_container}>
            <View style={{position: 'relative'}}>
              <TouchableOpacity
                onPress={() => this.handleOpenModal('upload_menus')}>
                <View style={styles.user_photo}>
                  <Image
                    source={{
                      uri: this.state?.user?.file || USER_PHOTO_PLACEHOLDER,
                    }}
                    style={styles.photo}
                  />
                  <View style={styles.camera_container}>
                    <MaterialCommunityIcons name="camera" />
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View style={styles.profile_info_container}>
              <View style={styles.profile_name_container}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text type="bold" title>
                    {this.state.user.firstname}
                  </Text>
                  <Text type="bold">{this.state.user.lastname}</Text>
                </View>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Text textDisabled>{this.state.user.phone}</Text>
                {this.state?.user?.account_type !== '' &&
                  this.state.user.account_type && (
                    <View style={styles.account_type}>
                      <Text textDisabled style={{fontSize: 11}}>
                        {this.state.user.account_type}
                      </Text>
                    </View>
                  )}
              </View>
            </View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('QRProfile', {
                  survey: this.state.survey,
                  balance: this.state.balance,
                })
              }>
              <View style={styles.qr_container}>
                <MaterialCommunityIcons name="qrcode" style={styles.qr_icon} />
              </View>
            </TouchableOpacity>
          </View>
          <FlatList
            contentContainerStyle={{paddingBottom: 90}}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <>
                <View style={styles.small_dash_container}>
                  <View style={styles.card_count}>
                    <Text style={styles.count} type="bold">
                      {this.state.survey}
                    </Text>
                    <Text textDisabled type="bold">
                      Total Survey
                    </Text>
                  </View>
                  <View style={{width: 20}} />
                  <View style={styles.card_count}>
                    <Text style={styles.count} type="bold">
                      {this.state.reward}
                    </Text>
                    <Text textDisabled type="bold">
                      Point(s)
                    </Text>
                  </View>
                </View>
              </>
            }
            data={items}
            ListFooterComponent={
              <View style={{paddingTop: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignContent: 'center',
                    backgroundColor: '#fff',
                    padding: 20,
                    marginBottom: 10,
                  }}>
                  <View style={{flex: 1}}>
                    <Input
                      label="Invite your friends by sharing your referral link"
                      placeholder="Link"
                      rightText="Share"
                      editable={false}
                      value={this.state.link}
                      clickable
                      inputStyles={{opacity: 0.2, paddingRight: 10}}
                      onPressRight={this.onShareLink.bind(this)}
                      isResending={this.state.isSharing}
                    />
                  </View>
                </View>
                <View style={{paddingHorizontal: 20}}>
                  <Button text="Sign Out" onPress={this.onLogout.bind(this)} />
                </View>
              </View>
            }
            renderItem={({item}) => {
              if (
                item.permission &&
                item.permission.includes(this.state.user.account_type)
              ) {
                return <ListItem {...item} background={theme === 'light'} />;
              } else if (!item.permission) {
                return <ListItem {...item} background={theme === 'light'} />;
              }
            }}
            keyExtractor={item => item.title}
          />
        </View>
        <Modal
          style={modal_styles.upload_menus}
          ref="upload_menus"
          position={'bottom'}
          onClosingState={() => this.handleCloseModal('upload_menus')}>
          <ImageChoice
            handleCloseModal={() => this.handleCloseModal('upload_menus')}
            onPress={params => this.onPressImageMenu(params)}
            isSubmitting={this.state.isSubmitting}
          />
        </Modal>
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

export default connect(mapPropsToState)(Profile);
