import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet, Dimensions} from 'react-native';

const height = 45;
const fullHeight = Dimensions.get('screen').height;
const fullWidth = Dimensions.get('screen').width;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  // top_header: {
  //   minHeight: 80,
  //   flexDirection: 'row',
  //   paddingHorizontal: 15,
  //   backgroundColor: '$accentColor',
  //   alignItems: 'center',
  // },

  // profile_header: {
  //   minHeight: 80,
  //   paddingHorizontal: 15,
  //   backgroundColor: '$accentColor',
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },

  profile_container: {
    minHeight: 60,
    backgroundColor: '$card',
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },

  user_photo: {
    width: 50,
    height: 50,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$accentColor',
    borderWidth: 3,
    borderColor: '$border',
    position: 'relative',
  },

  camera_container: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$white',
    borderWidth: 2,
    borderColor: '$bgColor',
    marginRight: 10,
  },

  photo: {
    width: 50,
    height: 50,
    borderRadius: 60,
  },

  profile_name_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    flex: 1,
  },

  profile_info_container: {
    marginLeft: 15,
    flex: 1,
  },

  profile_badge_container: {
    height: 20,
    backgroundColor: '$accentColor',
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
  },

  profile_badge_txt: {
    fontSize: 10,
    opacity: 0.8,
    textTransform: 'capitalize',
  },

  small_dash_container: {
    minHeight: 80,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    justifyContent: 'space-between',
  },

  card_count: {
    backgroundColor: '$card',
    height: 100,
    flex: 1,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },

  count: {
    fontSize: 24,
    marginBottom: 10,
  },

  qr_container: {
    width: 35,
    height: 35,
    borderRadius: 8,
    backgroundColor: '$bgColor',
    alignItems: 'center',
    justifyContent: 'center',
  },

  qr_icon: {
    fontSize: 24,
    color: '$textColor',
  },

  qr_profile_container: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '$bgColorLight',
  },

  qr_profile_shot: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    backgroundColor: '$bgColorLight',
    width: fullWidth,
    height: fullHeight,
  },

  qr_profile_header: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 65,
    position: 'absolute',
    left: 0,
    right: 0,
    paddingHorizontal: 15,
    zIndex: 999,
  },

  qr_close: {
    color: '$primaryColor',
    fontSize: 28,
  },

  qr_close_container: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },

  account_type: {
    backgroundColor: '$border',
    paddingHorizontal: 10,
    marginLeft: 5,
    paddingVertical: 5,
    borderRadius: 20,
  },
});

export default styles;
