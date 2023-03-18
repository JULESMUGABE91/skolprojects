import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$accentColor',
  },

  item_container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
  },

  footer: {
    marginHorizontal: 20,
  },

  info: {
    alignItems: 'center',
    // justifyContent: 'center',
    width: width / 1.3,
    paddingVertical: 15,
    flex: 1,
  },

  description: {
    textAlign: 'center',
    paddingVertical: 8,
    fontSize: 14,
    opacity: 0.5,
  },

  image_container: {
    marginTop: height / 10,
    flex: 1,
    marginBottom: 50,
  },

  image: {
    width: width - 50,
    height: width - 50,
  },

  second: {
    width: width,
    height: width,
  },

  buttles: {
    backgroundColor: '$inputBg',
  },

  selected_bullets: {
    backgroundColor: '$accentColor',
  },

  bulletsContainerStyle: {
    position: 'absolute',
    bottom: height / 4.4,
  },

  title: {
    fontSize: 24,
    textAlign: 'center',
  },
});

export default styles;
