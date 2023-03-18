import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet} from 'react-native';

const height = 45;

const styles = EStyleSheet.create({
  container: {},

  header: {
    minHeight: 60,
    flexDirection: 'row',
    paddingHorizontal: 20,
    backgroundColor: '$bgColorLight',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '$border',
  },

  title: {
    flex: 1,
  },

  color_box: {
    width: 40,
    height: 40,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
  },

  icon_check_color: {
    color: '$white',
    fontSize: 18,
  },

  content: {
    paddingHorizontal: 10,
  },
});

export default styles;
