import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  form_container: {
    backgroundColor: '$bgColorLight',
    padding: 15,
  },

  account_image_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    borderWidth: 2,
    borderColor: '$border',
    borderStyle: 'dashed',
    paddingVertical: 10,
    marginVertical: 15,
    marginBottom: 25,
    borderRadius: 8,
  },

  image_container: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '$border',
    marginRight: 15,
  },

  image_provider: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },

  account_item: {
    backgroundColor: '$card',
    marginHorizontal: 15,
    marginVertical: 10,
    elevation: 2,
    borderRadius: 8,
    flexDirection: 'row',
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
    marginTop: 5,
    marginBottom: 5,
    marginHorizontal: 10,
    paddingVertical: 10,
    paddingHorizontal: 15,
    alignItems: 'center',
  },

  account_item_image_container: {
    width: 40,
    height: 40,
    borderRadius: 50,
    backgroundColor: '$bgColor',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  account_item_image: {
    width: 40,
    height: 40,
    borderRadius: 50,
  },

  account_item_placeholder: {
    fontSize: 20,
    color: '$white',
  },

  account_item_points: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  account_item_info: {
    flex: 1,
  },

  type_item: {
    backgroundColor: '$border',
    paddingHorizontal: 10,
    marginLeft: 5,
    paddingVertical: 5,
    borderRadius: 20,
  },

  item_type_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 8,
  },

  type_txt: {
    fontSize: 12,
    textTransform: 'capitalize',
  },

  search_container: {
    paddingHorizontal: 15,
    backgroundColor: '$card',
  },

  access_item: {
    backgroundColor: '$bgColorLight',
    paddingHorizontal: 15,
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 55,
  },

  tabs: {
    backgroundColor: '$bgColorLight',
    marginBottom: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  tab_item: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    minHeight: 55,
    paddingHorizontal: 15,
  },

  border_bottom: {
    height: 3,
    backgroundColor: '$primaryColor',
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },

  check_bx: {
    backgroundColor: '$inputBg',
    width: 18,
    height: 18,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },

  checked_bx: {
    backgroundColor: '$primaryColor',
  },

  checked_icon: {
    color: '$white',
  },
});

export default styles;
