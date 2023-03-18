import React, {Component} from 'react';
import {
  TouchableOpacity,
  View,
  Image,
  ScrollView,
  Platform,
  Linking,
  FlatList,
} from 'react-native';
import {NavigationActions} from 'react-navigation';
import {connect} from 'react-redux';
import {ListItem} from '../components/List';
import {Text} from '../components/Text';
import {languages} from '../constants/localization';
import {USER_PHOTO_PLACEHOLDER} from '../constants/strings';
import styles from './styles';
import LocalStorage from '../utils/storage';
import EStyleSheet from 'react-native-extended-stylesheet';
import toastMessage from '../utils/toastMessage';

const GOOGLE_PACKAGE_NAME = 'com.murugo';
const APPLE_STORE_ID = 'id284882215';

class DrawerContent extends Component {
  constructor() {
    super();

    this.state = {
      user: {
        name: 'Guest',
      },
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
    });
  };

  navigateToScreen = route => () => {
    const navigateAction = NavigationActions.navigate({
      routeName: route,
    });
    this.props.navigation.dispatch(navigateAction);
  };

  rateApp() {
    if (Platform.OS != 'ios') {
      //To open the Google Play Store
      Linking.openURL(`market://details?id=${GOOGLE_PACKAGE_NAME}`).catch(err =>
        alert('Please check for the Google Play Store'),
      );
    } else {
      //To open the Apple App Store
      Linking.openURL(
        `itms://itunes.apple.com/in/app/apple-store/${APPLE_STORE_ID}`,
      ).catch(err => alert('Please check for the App Store'));
    }
  }

  render() {
    const {user} = this.state;

    const {language, theme} = this.props;
    const {my_account, settings, home, welcome_guest, login_is_required} =
      languages[language];

    const items = [
      {
        title: home,
        onPress: () => {
          this.props.navigation.navigate('Home');
        },
        right_icon: 'chevron-right',
        left_icon: 'home-outline',
      },
      {
        title: my_account,
        right_icon: 'chevron-right',
        left_icon: 'account-edit-outline',
        onPress: () => {
          this.props.navigation.navigate('MyAccount');
        },
      },
      {
        title: 'Gifts',
        onPress: () => this.props.navigation.navigate('Gifts'),
        right_icon: 'chevron-right',
        left_icon: 'gift-open-outline',
      },
      {
        title: 'Survey History',
        onPress: () => this.props.navigation.navigate('SurveyHistory'),
        right_icon: 'chevron-right',
        left_icon: 'archive-clock-outline',
      },
      {
        title: settings,
        onPress: () => {
          this.props.navigation.navigate('Settings');
        },
        right_icon: 'chevron-right',
        left_icon: 'cog-outline',
      },
    ];

    const bgColor = EStyleSheet.value('$bgColorLight');
    return (
      <View style={[styles.container, {backgroundColor: bgColor}]}>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate('MyAccount')}>
          <View
            style={[styles.header, Platform.OS === 'ios' && {paddingTop: 40}]}>
            <View style={styles.user_profile_pic}>
              <Image
                source={{
                  uri: this.state.user.file || USER_PHOTO_PLACEHOLDER,
                }}
                style={styles.profile_pic_pic}
                resizeMode="cover"
              />
            </View>
            <View style={styles.user_info}>
              {this.state.user.token ? (
                <>
                  <Text
                    sbtitle
                    type="bold"
                    style={{marginBottom: 5}}
                    numberOfLines={1}>
                    {this.state?.user?.firstname +
                      ' ' +
                      this.state?.user?.lastname || 'Your Name here'}
                  </Text>
                  {this.state.user.phone && (
                    <Text>{this.state.user.phone}</Text>
                  )}
                </>
              ) : (
                <>
                  <Text sbtitle type="bold">
                    {welcome_guest}
                  </Text>
                  <Text textDisabled>{login_is_required}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableOpacity>
        <FlatList
          contentContainerStyle={{paddingBottom: 90}}
          showsVerticalScrollIndicator={false}
          data={items}
          renderItem={({item}) => (
            <ListItem {...item} background={theme === 'light'} />
          )}
          keyExtractor={item => item.id}
        />
      </View>
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

export default connect(mapPropsToState)(DrawerContent);
