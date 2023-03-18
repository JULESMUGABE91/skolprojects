import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$bgColor',
    paddingVertical: 10,
  },

  empty_info: {
    width: width / 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  title: {
    textAlign: 'center',
    color: '$textColor',
    marginBottom: 15,
  },

  description: {
    opacity: 0.5,
    color: '$textColor',
    textAlign: 'center',
  },

  image_container: {
    width: 80,
    height: 80,
    backgroundColor: '$bgColorLight',
    borderRadius: 90,
    marginBottom: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  empty_icon: {
    fontSize: 40,
    color: '$primaryColor',
  },
});

export default styles;
