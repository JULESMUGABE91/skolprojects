import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet} from 'react-native';

const height = 45;

const styles = EStyleSheet.create({
  header: {
    minHeight: 60,
    flexDirection: 'row',
    paddingHorizontal: 15,
    backgroundColor: '$bgColorLight',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '$border',
  },

  title: {
    flex: 1,
  },
});

export default styles;
