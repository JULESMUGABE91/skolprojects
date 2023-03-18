import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet} from 'react-native';

const styles = EStyleSheet.create({
  container: {},

  header: {
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 8,
  },

  content: {
    flex: 1,
    // padding: 15,
  },

  filters_container: {
    height: 50,
    backgroundColor: '$bgColorLight',
    // elevation: 6,
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
  },

  title_bx: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$primaryColor',
    borderRadius: 4,
    marginRight: 10,
  },

  title_b_iconx: {
    color: '$white',
  },
});

export default styles;
