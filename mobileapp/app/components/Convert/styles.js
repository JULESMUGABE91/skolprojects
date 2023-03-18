import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  qr_container: {
    // width: 100,
    // height: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    padding: 15,
  },

  header: {
    paddingHorizontal: 15,
    minHeight: 55,
    borderBottomWidth: 1,
    borderBottomColor: '$border',
    alignItems: 'center',
    flexDirection: 'row',
  },
});

export default styles;
