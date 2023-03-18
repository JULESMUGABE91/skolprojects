import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 80,
    paddingHorizontal: 20,
    backgroundColor: '$accentColor',
  },

  success_content: {
    backgroundColor: '$bgColorLight',
    borderRadius: 8,
  },

  title_container: {
    paddingHorizontal: 15,
    minHeight: 45,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '$border',
  },

  content_container: {
    padding: 15,
  },

  image_success: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 15,
  },

  trophy: {
    width: 145,
    height: 145,
    marginBottom: 20,
  },

  image_success_circle: {
    width: 150,
    height: 150,
    backgroundColor: '$bgColor',
    borderRadius: 150,
    // borderWidth: 3,
    // borderColor: '$primaryColor',
    alignItems: 'center',
    justifyContent: 'center',
  },

  win_desc: {
    textAlign: 'center',
  },

  description_c: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
  },

  win_desc: {
    paddingVertical: 15,
  },

  thanks: {},

  logo_container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 50,
  },

  logo: {
    width: 100,
    height: 100,
  },
});

export default styles;
