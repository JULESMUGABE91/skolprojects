import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  menu_item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    minHeight: 55,
    borderBottomWidth: 1,
    borderBottomColor: '$border',
  },

  icon: {
    fontSize: 18,
    color: '$primaryColor',
    marginRight: 15,
  },
});

export default styles;
