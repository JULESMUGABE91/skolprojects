import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    // flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: width / 9,
  },

  footer: {
    paddingVertical: 40,
    paddingHorizontal: width / 9,
  },

  intro: {
    textAlign: 'justify',
  },

  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  hi_container: {
    width: 100,
    height: 100,
    backgroundColor: '$border',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 100,
  },

  hi_icon: {
    fontSize: 35,
    color: '$primaryColor',
  },

  top_header: {
    height: 55,
    paddingHorizontal: 15,
    alignItems: 'center',
    flexDirection: 'row',
  },

  back_icon: {
    color: '$textColor',
    fontSize: 24,
  },
});

export default styles;
