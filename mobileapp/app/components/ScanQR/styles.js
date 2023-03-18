import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const {height, width} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  container: {
    height,
    width,
  },
});

export default styles;
