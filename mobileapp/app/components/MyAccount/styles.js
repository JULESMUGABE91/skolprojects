import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    minHeight: 80,
    flexDirection: 'row',
    paddingHorizontal: 15,
    backgroundColor: '$bgColorLight',
    alignItems: 'center',
    marginBottom: 5,
  },

  content: {
    backgroundColor: '$bgColorLight',
    padding: 15,
  },

  photo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },

  user_photo: {
    width: 50,
    height: 50,
    borderRadius: 50,
    marginRight: 15,

  },
});

export default styles;
