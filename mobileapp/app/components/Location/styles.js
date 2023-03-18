import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },

  icon_container: {
    width: width / 5,
    height: width / 5,
    backgroundColor: '$border',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: width,
    marginBottom: 30,
    marginTop: 45,
  },

  pin: {
    fontSize: 30,
    color: '$primaryColor',
  },

  description_container: {
    paddingHorizontal: 30,
  },

  title: {
    textAlign: 'center',
    marginBottom: 10,
  },

  description: {
    textAlign: 'center',
    opacity: 0.5,
  },

  button_container: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
  },

  close_container: {
    position: 'absolute',
    top: 0,
    marginTop: 15,
  },

  close: {
    fontSize: 20,
    opacity: 0.5,
  },

  close_indicator: {
    backgroundColor: '$border',
    width: 60,
    height: 8,
    borderRadius: 10,
  },
});

export default styles;
