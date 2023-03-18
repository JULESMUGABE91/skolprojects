import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet} from 'react-native';

const height = 45;

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  top_header: {
    minHeight: 80,
    flexDirection: 'row',
    paddingHorizontal: 15,
    backgroundColor: '$bgColorLight',
    alignItems: 'center',
  },

  back_container: {
    marginRight: 20,
  },

  back_icon: {
    fontSize: 24,
    color: '$textColor',
  },
});

export default styles;
