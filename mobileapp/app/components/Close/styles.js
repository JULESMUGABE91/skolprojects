import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  close_container: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  close_icon: {
    fontSize: 18,
    color: '$textColor',
  },
});

export default styles;
