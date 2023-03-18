import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const height = 50;

const {width} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  container: {
    backgroundColor: '$primaryColor',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    height,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },

  transparent: {
    backgroundColor: 'transparent',
  },

  secondary: {
    backgroundColor: '$accentColor',
  },

  disabled: {
    backgroundColor: '$bgColor',
  },

  textBlack: {
    color: '$textColor',
  },

  text: {
    color: '$white',
    fontWeight: '900',
  },

  text_border_bottom: {
    // borderBottomWidth: 1,
  },

  bordered: {
    borderWidth: 2,
    borderColor: '$primaryColor',
    backgroundColor: 'transparent',
  },

  image_gmail: {
    width: 14,
    height: 10,
    marginRight: 10,
  },

  image_apple: {
    width: 12.55,
    height: 16,
    marginRight: 10,
  },

  sm_btn: {
    height: 35,
    // width: width / 3,
    // marginTop: 20,
    borderRadius: 8,
  },

  smTxt: {
    fontSize: 11,
  },

  submitting: {
    color: '$white',
  },

  leftIcon: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  l_icon: {
    fontSize: 20,
    color: '$white',
  },

  primaryText: {
    color: '$primaryColor',
  },
});

export default styles;
