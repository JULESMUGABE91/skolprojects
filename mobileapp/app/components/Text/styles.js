import EStyleSheet from 'react-native-extended-stylesheet';
import Fonts from '../../utils/Fonts';

const styles = EStyleSheet.create({
  text: {
    fontFamily: Fonts.FontRegular,
    color: '$textColor',
    fontSize: 13,
  },

  title: {
    fontSize: 16,
  },

  sbtitle: {
    fontSize: 15,
  },

  primaryText: {
    color: '$primaryColor',
  },
  smtitle: {
    fontSize: 13,
  },
  xstitle: {
    fontSize: 12,
  },

  underline: {
    borderBottomWidth: 1,
    borderBottomColor: '$textColor',
  },

  danger: {
    color: '$danger',
  },

  textDisabled: {
    opacity: 0.5,
  },

  xtitle: {
    fontSize: 24,
  },
});

export default styles;
