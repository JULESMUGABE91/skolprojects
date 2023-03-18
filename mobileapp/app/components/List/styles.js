import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const {width} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  list_item_container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },

  list_item_container_bg: {
    backgroundColor: '$card',
    flex: 1,
  },

  item_info: {
    flex: 1,
    paddingRight: 10,
  },

  icon_container: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderRadius: 50,
  },

  left_icon_primary_bg: {
    backgroundColor: '$primaryColor',
  },

  left_icon: {
    fontSize: 20,
    color: '$primaryColor',
  },

  left_icon_white: {
    color: '$white',
  },

  right_icon: {
    fontSize: 18,
    color: '$textColor',
    marginLeft: 10,
  },

  empty_title: {
    height: 10,
    backgroundColor: '$inputBg',
    width: width / 3,
    borderRadius: 20,
  },

  empty_sbtitle: {
    height: 10,
    backgroundColor: '$inputBg',
    width: width / 4,
    borderRadius: 20,
    marginTop: 5,
  },

  user_photo: {
    backgroundColor: '$inputBg',
    width: 55,
    height: 55,
    borderRadius: 50,
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  photo_image: {
    width: 55,
    height: 55,
    borderRadius: 50,
  },

  group_user_image: {
    position: 'relative',
  },

  description: {
    opacity: 0.5,
    marginTop: 2,
  },

  user_name_char: {
    opacity: 0.5,
  },

  unread: {
    paddingHorizontal: 8,
    borderRadius: 10,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 18,
    marginBottom: 5,
  },

  unread_count: {
    color: '$white',
    fontSize: 9,
  },

  message_date: {
    // position: 'absolute',
    // right: 0,
    alignItems: 'flex-end',
  },

  date: {
    fontSize: 10,
    opacity: 0.5,
  },

  category_container: {
    // maxWidth: 80,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 50,
    minHeight: 20,
    marginTop: 5,
    marginLeft: 10,
  },

  category_text: {
    color: '$white',
    fontSize: 8,
  },

  border: {
    borderWidth: 2,
    borderColor: '$border',
    borderRadius: 8,
  },
});

export default styles;
