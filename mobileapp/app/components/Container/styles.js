import EStyleSheet from 'react-native-extended-stylesheet';

import {StatusBar, Platform} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$bgColor',
    marginTop: Platform.OS === 'ios' ? StatusBar.currentHeight : 20,
  },
});

export default styles;
