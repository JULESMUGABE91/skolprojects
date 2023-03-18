import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    backgroundColor: '$bgColorLight',
    padding: 15,
    marginBottom: 5,
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default styles;
