import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const height = 45,
  main_search_height = 35;

const {width} = Dimensions.get('screen');

const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '$inputBg',
    flexDirection: 'row',
    paddingHorizontal: 15,
    minHeight: height,
    marginVertical: 10,
    borderRadius: '$md_radius',
    borderWidth: 1,
    borderColor: '$inputBg',
  },

  light: {
    backgroundColor: '$card',
  },

  input: {
    flex: 1,
    color: '$textColor',
    fontWeight: '600',
  },

  phone_country_code: {
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: 15,
    flexDirection: 'row',
  },

  phone_country_code_txt: {
    fontWeight: '600',
  },

  left_icon_container: {
    height,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  icon: {
    fontSize: 18,
    color: '$primaryColor',
  },

  input_error: {
    borderWidth: 2,
    borderColor: '$danger',
    backgroundColor: '$white',
  },

  error: {
    color: '$danger',
  },

  mainSearch: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '$bgColorLight',
    minHeight: main_search_height,
    borderWidth: 2,
    borderColor: '$primaryColor',
    borderRadius: height,
    marginHorizontal: 10,
  },

  search_icon_container: {
    minHeight: main_search_height,
    width: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: main_search_height,
  },

  input_icon: {
    fontSize: 18,
    color: '$textColor',
  },

  main_search_input: {
    fontSize: 12,
    minHeight: main_search_height,
    padding: 0,
    flex: 1,
  },

  icon_primary: {
    color: '$primaryColor',
  },

  checkbox_container: {
    width: 22,
    height: 22,
    borderRadius: 4,
    backgroundColor: '$inputBg',
    alignItems: 'center',
    justifyContent: 'center',
  },

  check_icon: {
    color: '$white',
  },

  checkbox_container_checked: {
    backgroundColor: '$accentColor',
  },

  check_item: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  check_label: {
    marginLeft: 10,
  },

  danger: {
    color: '$danger',
  },

  helpText_container: {
    paddingBottom: 10,
  },

  leftIconImage: {
    width: 30,
    height: 20,
    borderRadius: 4,
  },

  flag: {
    width: 24,
    height: 20,
    borderRadius: 4,
    marginRight: 10,
  },

  question_setting: {
    minHeight: 40,
    alignItems: 'center',
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '$border',
    paddingHorizontal: 15,
    marginTop: 15,
    borderRadius: 8,
    flex: 1,
    justifyContent: 'space-between',
  },

  question_setting_check: {
    width: 20,
    height: 20,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '$border',
    marginRight: 10,
  },

  question_setting_check_icon: {
    color: '$border',
  },
});

export default styles;
