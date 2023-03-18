import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    minHeight: 60,
    marginBottom: 10,
  },

  loading: {
    color: '$primaryColor',
  },

  loader_footer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default styles;
