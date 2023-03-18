import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$white',
  },

  form_container: {
    paddingHorizontal: 15,
    flex: 1,
    paddingVertical: 25,
  },

  title: {
    marginBottom: 8,
  },

  description: {
    marginBottom: 25,
    opacity: 0.5,
  },

  login_btn: {
    marginTop: 15,
  },

  need_to_login_container: {
    padding: 20,
  },

  header: {
    minHeight: 65,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 15,
    backgroundColor: '$accentColor',
    elevation: 2,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  logo: {
    width: 80,
    height: 80,
  },
});

export default styles;
