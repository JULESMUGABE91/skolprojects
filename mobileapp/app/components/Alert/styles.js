import EStyleSheet from 'react-native-extended-stylesheet';

const height = 65;

const styles = EStyleSheet.create({
  name_missing_container: {
    backgroundColor: '$card',
    padding: 15,
    marginBottom: 15,
  },

  name_missing: {
    paddingBottom: 15,
  },
  name_title: {
    paddingBottom: 8,
  },

  name_description: {
    opacity: 0.5,
  },
});

export default styles;
