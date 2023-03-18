import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  form_container: {
    backgroundColor: '$bgColorLight',
    padding: 15,
  },

  provider_image_container: {
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

  provider_item: {
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

  provider_item_image_container: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '$bgColor',
    marginRight: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },

  provider_item_image: {
    width: 50,
    height: 50,
    borderRadius: 8,
  },

  provider_item_placeholder: {
    fontSize: 20,
    color: '$white',
  },

  provider_item_points: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },

  provider_item_info: {
    flex: 1,
  },
});

export default styles;
