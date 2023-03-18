import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  container: {
    flexDirection: 'row',
    minHeight: 50,
    alignItems: 'center',
    paddingHorizontal: 5,
  },

  left: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },

  empty_title: {
    height: 15,
    backgroundColor: '$inputBg',
    width: width / 3,
    borderRadius: 20,
  },

  btn_empty: {
    height: 15,
    backgroundColor: '$inputBg',
    width: width / 5,
    borderRadius: 20,
  },

  collapse: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 30,
    height: 30,
    // marginRight: -5,
    backgroundColor: 'transparent',
    borderRadius: 50,
    marginTop: -13,
  },

  collapse_icon: {
    fontSize: 16,
    color: '$textColor',
  },

  type_container: {
    marginHorizontal: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    maxWidth: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },

  type_txt: {
    fontSize: 9,
    color: '$white',
  },
});

export default styles;
