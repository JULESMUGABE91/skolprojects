import EStyleSheet from 'react-native-extended-stylesheet';
import {Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '$bgColor',
  },

  form_container: {
    flex: 1,
  },

  form_content: {
    backgroundColor: '$white',
    padding: 15,
  },

  form_header: {
    backgroundColor: '$white',
    marginBottom: 1,
    paddingTop: 15,
    paddingHorizontal: 15,
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
  },

  logo: {
    width: 80,
    height: 80,
  },

  questions_container: {
    // borderRadius: 8,
    marginBottom: 15,
    backgroundColor: '$white',
    padding: 15,
  },

  questions_content: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  question_btns: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
    marginTop: 70,
  },

  question_btns_btn: {
    width: 35,
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
  },

  q_btn_icon_primary: {
    color: '$primaryColor',
  },

  q_btn_icon: {
    fontSize: 18,
    color: '$white',
  },

  q_a_btns: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    flexWrap: 'wrap',
  },

  q_a_btns_btn: {
    height: 35,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginRight: 25,
    flex: 1,
  },

  option_container: {
    borderWidth: 2,
    borderColor: '$border',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
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

  radio_container: {
    width: 15,
    height: 15,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '$border',
    borderWidth: 2,
    marginRight: 15,
  },

  radio: {
    width: 8,
    height: 8,
    borderRadius: 50,
    backgroundColor: '$primaryColor',
  },

  header_create_dropdown: {
    minHeight: 55,
    alignItems: 'center',
    paddingHorizontal: 15,
    flexDirection: 'row',
    borderBottomColor: '$border',
    borderBottomWidth: 1,
  },

  content_create_dropdown: {
    padding: 15,
    flex: 1,
  },

  add_new_dropdown: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    backgroundColor: '$primaryColor',
  },

  add_new_dropdown_icon: {
    color: '$white',
    fontSize: 18,
  },

  remove_new_dropdown: {
    backgroundColor: '$white',
    borderColor: '$primaryColor',
    borderWidth: 2,
  },

  remove_new_dropdown_icon: {
    color: '$primaryColor',
    fontSize: 24,
  },

  header_create_dropdown_title: {
    flex: 1,
  },

  apply_container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },

  apply_checkbox: {
    width: 24,
    height: 24,
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '$border',
  },

  apply_checkbox_icon: {
    color: '$border',
  },

  apply_checkbox_text: {
    marginLeft: 15,
  },

  close_modal: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },

  close_modal_icon: {
    fontSize: 20,
    color: '$textColor',
  },

  copy_from: {
    padding: 15,
    borderWidth: 1,
    borderColor: '$primaryColor',
    borderRadius: 8,
    marginBottom: 5,
  },

  copy_from_txt: {
    color: '$primaryColor',
  },
});

export default styles;
