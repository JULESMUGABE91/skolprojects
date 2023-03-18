import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet} from 'react-native';

const height = 55;

const styles = EStyleSheet.create({
  container: {
    minHeight: height,
    alignItems: 'center',
    flexDirection: 'row',
    marginVertical: 10,
  },

  tab_item: {
    minHeight: 35,
    paddingHorizontal: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 4,
    marginRight: 10,
    backgroundColor: '$bgColorLight',
  },
});

export default styles;
