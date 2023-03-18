import EStyleSheet from 'react-native-extended-stylesheet';
import {StyleSheet} from 'react-native';

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$bgColor',
  },

  header: {
    paddingVertical: 15,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '$bgColorLight',
    elevation: 3,
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingLeft: 20,
  },

  survey_count_question: {
    apacity: 0.5,
  },

  title_container: {
    flex: 1,
  },

  close_container: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -10,
  },

  close_icon: {
    color: '$primaryColor',
    fontSize: 24,
  },

  progress_bar: {
    height: 10,
    // flex: 1,
    flexDirection: 'row',
    backgroundColor: 'rgba(254, 254, 254, 0.5)',
    borderRadius: 4,
    marginTop: 10,
    position: 'relative',
  },

  content: {
    flex: 1,
  },

  question_item: {
    padding: 15,
    backgroundColor: '$bgColorLight',
  },

  option_container: {
    borderWidth: 2,
    borderColor: '$border',
    marginTop: 20,
    minHeight: 55,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: 10,
    // backgroundColor: '$bgColorLight',
  },

  radio_container: {
    width: 15,
    height: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '$border',
    borderWidth: 2,
  },

  radio_selected: {
    width: 8,
    height: 8,
    borderRadius: 50,
  },

  option_content: {
    marginHorizontal: 15,
    flex: 1,
  },

  btns_container: {
    paddingVertical: 25,
    flexDirection: 'row',
    paddingHorizontal: 15,
  },

  progress_bar_indicator: {
    width: 0,
    height: 10,
    borderRadius: 4,
    position: 'absolute',
  },

  item_menu: {
    minHeight: 55,
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '$border',
  },

  menuitem_icon_container: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },

  menuitem_icon: {
    color: '$primaryColor',
    fontSize: 24,
  },

  option_txtinput_container: {
    marginTop: 15,
  },

  icon_placeholder: {
    width: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },

  icon_placeholder_txt: {
    color: '$primaryColor',
  },

  dropdown_checkbox: {
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
    backgroundColor: '$border',
  },

  dropdown_checkbox_selected: {
    backgroundColor: '$primaryColor',
  },

  dropdown_checkbox_icon: {
    color: '$border',
  },

  dropdown_checkbox_icon: {
    color: '$bgColor',
  },

  q_count: {
    // width: 25,
    height: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    backgroundColor: '$primaryColor',
    paddingHorizontal: 5,
    borderRadius: 4,
  },

  q_count_txt: {
    color: '$white',
    fontSize: 11,
  },

  drop_down_header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    minHeight: 55,
  },

  title_modal_container: {
    paddingRight: 15,
    flex: 1,
  },

  dropdown_modal_close_icon: {
    fontSize: 18,
    color: '$textColor',
  },
});

export default styles;
