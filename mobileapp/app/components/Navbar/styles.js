import EStyleSheet from 'react-native-extended-stylesheet';

const height = 65;

const styles = EStyleSheet.create({
  container: {
    height,
    backgroundColor: '$bgColorLight',
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    elevation: 2,
  },

  icon_item: {
    fontSize: 22,
    color: '$primaryColor',
  },

  left_content: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  title_content: {
    marginHorizontal: 15,
    flex: 1,
  },

  right_content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon_container: {
    width: 30,
    height: 30,
    alignItems: 'center',
    position: 'relative',
    justifyContent: 'center',
  },

  my_location_status: {
    position: 'absolute',
    top: 10,
    right: 0,
    width: 14,
    height: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$primaryColor',
    borderWidth: 2,
    borderColor: '$accentColor',
  },

  my_location_status_icon: {
    color: '$white',
    fontSize: 6,
  },
});

export default styles;
