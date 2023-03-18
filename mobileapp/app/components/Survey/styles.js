import EStyleSheet from 'react-native-extended-stylesheet';

const styles = EStyleSheet.create({
  container: {
    minHeight: 65,
    paddingHorizontal: 15,
    backgroundColor: '$card',
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
  },

  header: {
    paddingVertical: 10,
    paddingBottom: 8,
  },

  description: {
    opacity: 0.5,
  },

  icon_left_icon: {
    fontSize: 24,
  },

  icon_left_container: {
    marginRight: 10,
    marginTop: 8,
  },

  status_text: {
    color: '$white',
    fontSize: 8,
  },

  status_container: {
    paddingHorizontal: 4,
    paddingVertical: 3,
    borderRadius: 4,
    marginLeft: 6,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    paddingBottom: 10,
  },

  description: {
    opacity: 0.6,
    fontSize: 12,
  },

  right_icon_container: {
    marginTop: 25,
  },

  right_icon_icon: {
    color: '$textColor',
  },

  progress_bar_container: {
    height: 8,
    flexDirection: 'row',
    backgroundColor: '#f7ebeb',
    borderRadius: 8,
    marginTop: 10,
    position: 'relative',
  },

  progress_bar_indicator: {
    width: 0,
    height: 8,
    borderRadius: 8,
    position: 'absolute',
  },
});

export default styles;
