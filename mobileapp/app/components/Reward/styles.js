import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  title_container: {
    flexDirectyion: 'row',
    alignItems: 'center',
    minHeight: 65,
    flexDirection: 'row',
  },

  card_container: {
    backgroundColor: '$accentColor',
    height: 150,
    borderRadius: 16,
    padding: 15,
    elevation: 2,
  },

  card_header: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  logo: {
    height: 55,
    width: 55,
  },

  card_content: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  balance_x: {
    fontSize: 24,
    marginBottom: 5,
  },

  convertion_container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 25,
  },

  right_icon_convertion: {
    color: '$textColor',
    fontSize: 18,
  },

  convert_serparator: {
    marginHorizontal: 15,
  },

  card: {
    backgroundColor: '$bgColorLight',
    paddingHorizontal: 15,
    marginTop: 10,
    elevation: 1,
    borderRadius: 8,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
  },

  gift_container: {
    marginTop: 10,
    borderRadius: 8,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
  },

  choose_gift: {},

  gifttitle_container: {
    minHeight: 55,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gift_item: {
    backgroundColor: '$card',
    borderRadius: 8,
    height: 130,
    width: 100,
    marginRight: 10,
    alignItems: 'center',
    // justifyContent: 'center',
  },

  gift_item_image: {
    height: 50,
    width: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  gift_item_image_bg: {
    height: 50,
    width: 50,
    borderRadius: 8,
  },

  gift_item__footer: {
    paddingHorizontal: 5,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },

  gift_item_name: {
    fontSize: 24,
    color: '$white',
  },
});

export default styles;
