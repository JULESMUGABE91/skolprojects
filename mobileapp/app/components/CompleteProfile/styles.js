import EStyleSheet from 'react-native-extended-stylesheet';

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
    backgroundColor: '$white',
    elevation: 2,
    shadowColor: '#171717',
    shadowOffset: {width: -2, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  progress_container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 5,
    backgroundColor: '$border',
    flexDirection: 'row',
  },

  progress_item: {
    flex: 1,
    backgroundColor: '$border',
  },

  progress_item_active: {
    flex: 1,
    backgroundColor: '$accentColor',
  },
});

export default styles;
