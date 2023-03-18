import {Platform} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const height = Platform.OS === 'ios' ? 80 : 55;

const styles = EStyleSheet.create({
  tabs: {
    height: height,
    backgroundColor: '$bgColorLight',
    flexDirection: 'row',
    elevation: 6,
  },

  activeTabName: {
    color: '$primaryColor',
  },

  inactiveTabName: {
    color: '$textColor',
  },

  title: {
    fontSize: 10,
  },

  activeTabIcon: {
    color: '$primaryColor',
  },

  inactiveTabIcon: {
    color: '$textColor',
  },

  notification_container: {
    position: 'absolute',
    top: -8,
    right: -3,
    backgroundColor: '$accentColor',
    borderRadius: 20,
    // minWidth: 18,
    paddingHorizontal: 5,
    minHeight: 18,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '$bgColor',
  },

  count: {
    fontSize: 9,
    color: '$white',
  },

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: '$border',
    paddingVeritical: 15,
    minHeight: Platform.OS === 'ios' ? 120 : 80,
  },

  user_profile_pic: {
    width: 50,
    height: 50,
    borderRadius: 80,
  },

  profile_pic_pic: {
    width: 50,
    height: 50,
    borderRadius: 80,
  },

  user_info: {
    marginHorizontal: 15,
    flex: 1,
  },

  name: {
    color: '$textColor',
  },

  navSectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  sidebaritem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    minHeight: 50,
  },
});

export default styles;
