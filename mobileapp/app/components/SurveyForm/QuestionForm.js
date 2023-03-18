import React from 'react';
import {View, ScrollView, Image, StyleSheet, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';

import styles from './styles';
import {languages} from '../../constants/localization';
import {Button} from '../Button';
import {Text} from '../Text';
import {Input} from '../Input';
import {Back} from '../Back';
import uuid4 from '../../utils/uuid4';
import {CQuestions} from '.';
import {APP_ID, ROOT_API} from '../../constants/strings';
import toastMessage from '../../utils/toastMessage';
import LocalStorage from '../../utils/storage';
import Modal from 'react-native-modalbox';
import OtherOption from './Modal/OtherOption';
import EStyleSheet from 'react-native-extended-stylesheet';
import OptionSetting from './Modal/OptionSetting';
import CreateDropDown from './Modal/CreateDropDown';
import QuestionMenu from './Modal/QuestionMenu';
import {Loading} from '../Loading';
import Option from './Modal/Option';
import {optionsOptions, questionOptions} from '../../constants/question_option';

const {height} = Dimensions.get('screen');

const question_format = {
  _id: uuid4(),
  type: 'input',
  options: [],
  setting: {
    isRequired: true,
  },
};

class QuestionForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      error: {},
      questions: [],
      selected_item: {},
      isLoading: true,
    };
  }

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    let questions = [];

    if (this.props?.params?.questions) {
      if (this.props?.params?.questions?.length !== 0) {
        questions = this.props?.params?.questions;
      }
    }

    this.setState({user, questions, isLoading: false});
  };

  onChangeText(field, v) {
    let {error} = this.state;

    delete error[field];

    this.setState({
      error,
      [field]: v,
    });
  }

  addRemoveQuestion(params) {
    let {questions} = this.state;
    let {question_index, config, action} = params;

    console.log(question_index);

    if (
      action === 'remove' &&
      question_index >= 0 &&
      questions[question_index]
    ) {
      questions.splice(question_index, 1);
    } else if (
      action === 'update' &&
      // question_index !== -1 &&
      questions[question_index]
    ) {
      questions[question_index].type = params.config.input;
    } else if (action === 'add' && questions.length > 0) {
      questions.push({
        _id: uuid4(),
        type: config?.input,
        options: [],
        setting: {
          isRequired: true,
        },
      });
    } else {
      questions = [
        {
          _id: uuid4(),
          type: config.input,
          options: [
            {
              type: 'checkbox',
              _id: uuid4(),
              option: 'Enter your answer',
            },
          ],
          setting: {
            isRequired: true,
          },
        },
      ];
    }

    this.setState({questions});

    this.handleCloseModal('question_menu_modal');
  }

  addRemoveOption(params) {
    let {question_index, option_index, question_id, type} = params;
    let {questions} = this.state;

    if (option_index >= 0 && type == 'remove') {
      questions[question_index].options.splice(option_index, 1);
    }
    if (question_id === questions[question_index]._id) {
      questions[params.question_index].options.push({
        type: params.config.input,
        _id: uuid4(),
      });

      params.option_index = questions[params.question_index].options.length - 1;
    }

    if (params.modal) {
      this.handleCloseModal(params.modal);
    }

    if (params?.config?.type === 'dropdown_option_setting') {
      let {options} = questions[params.question_index];
      this.handleOpenModal('createDropdownModal', {
        ...options[params.option_index],
        selected_item: params,
        dropdown_options:
          options[params.option_index]?.dropdown_options || undefined,
      });
    }

    this.setState({questions});
  }

  handleOpenDropdownModal(params) {
    const {selected_item, questions} = this.state;

    if (
      params.type === 'dropdown_option_setting' &&
      selected_item.question_index > -1 &&
      selected_item.option_index > -1
    ) {
      let {options} = questions[selected_item.question_index];

      // options[selected_item.option_index].type = params.config.input;

      // if (params.feature === 'built_in') {
      //   options[selected_item.option_index].key = params.key;

      //   this.handleCloseModal('optionSettingModal');

      //   return;
      // }

      // this.handleOpenModal('createDropdownModal', {
      //   ...options[selected_item.option_index],
      //   selected_item,
      //   dropdown_options:
      //     options[selected_item.option_index]?.dropdown_options || undefined,
      // });
    }
  }

  onSelectOtherOption(params) {
    const {selected_item, questions} = this.state;

    if (
      params.type === 'option_setting' &&
      selected_item.question_index > -1 &&
      selected_item.option_index > -1
    ) {
      let {options} = questions[selected_item.question_index];

      options[selected_item.option_index].type = params.config.input;

      this.handleCloseModal('optionSettingModal');
    }

    if (
      params.type === 'dropdown_option_setting' &&
      selected_item.question_index > -1 &&
      selected_item.option_index > -1
    ) {
      let {options} = questions[selected_item.question_index];

      options[selected_item.option_index].type = params.input;

      if (params.feature === 'built_in') {
        options[selected_item.option_index].key = params.key;

        this.handleCloseModal('optionSettingModal');

        return;
      }

      this.handleOpenModal('createDropdownModal', {
        ...options[selected_item.option_index],
        selected_item,
        dropdown_options:
          options[selected_item.option_index]?.dropdown_options || undefined,
      });
    }

    this.setState({questions});
  }

  handleOpenQuestionMenuModal(params) {
    const {questions} = this.state;
    const {modal} = params;

    if (params.type === 'question_menu') {
      let body = {...question_format, action: params.action};

      if (params?.question_index !== -1) {
        body = {
          ...questions[params.question_index],
          action: params.action,
          question_index: params?.question_index,
        };
      }

      return this.handleOpenModal('question_menu_modal', body);
    }

    // if (params.type === 'new_option') {
    //   // questions[params.question_index].options.push({
    //   //   type: params.config.input,
    //   //   _id: uuid4(),
    //   // });
    // }

    this.handleOpenModal(modal, params);
  }

  onSelectQuestionMenu(params) {
    let {selected_item, questions} = this.state;
    if (params.input === 'duplicate') {
      if (selected_item && selected_item.question) {
        let {options = []} = selected_item;

        delete selected_item.createdAt;
        delete selected_item._v;
        delete selected_item._id;

        for (let option of options) {
          option._id = uuid4();
        }

        questions.push(selected_item);

        this.handleCloseModal('questionMenuModal');

        console.log([...questions]);

        this.setState({questions: [...questions], selected_item: {}});

        toastMessage('Question duplicated successfully');
      } else {
        toastMessage('Question is missing');
      }
    }
  }

  onAddRemoveDropdown(params) {
    const {selected_item, questions} = this.state;
    const {options, isAll} = params;

    let question = questions[selected_item.selected_item.question_index];

    if (isAll) {
      for (let option of question.options) {
        option.type = 'dropdown';
        option['dropdown_options'] = options;
      }
    } else {
      question.options[selected_item.selected_item.option_index][
        'dropdown_options'
      ] = options;
    }
    this.setState({questions});
  }

  onChangeQuestion(e, i) {
    let {questions} = this.state;

    questions[i]['question'] = e;

    delete questions[i]?.error?.question;

    this.setState({questions});
  }

  onChangeOption(params) {
    let {questions} = this.state;
    let {question_index, option_index, e, option} = params;

    option['option'] = e;

    console.log('====================================');
    console.log('option change', option);
    console.log('====================================');

    delete option.error?.option;

    if (questions[question_index].options[option_index]._id === option._id) {
      questions[question_index].options[option_index] = option;

      this.setState({questions});
    }
  }

  onSetQuestionSetting(params) {
    let {questions} = this.state;
    let {question_index, setting} = params;

    if (!questions[question_index]['setting']) {
      questions[question_index]['setting'] = {
        [setting]: true,
      };
    } else {
      if (questions[question_index].setting[setting]) {
        questions[question_index].setting[setting] = false;
      } else {
        questions[question_index].setting[setting] = true;
      }
    }

    this.setState(questions);
  }

  validateForm() {
    let {error, questions} = this.state;

    for (let [i, question] of questions.entries()) {
      if (!question.question || question.question === '') {
        question['error'] = {question: ''};
        question['error'].question = `Question ${i} is required `;
      }
    }

    this.setState({error});
  }

  handleOpenModal(modal, params) {
    this.refs[modal].open();

    this.setState({selected_item: params});
  }

  handleCloseModal(modal) {
    this.refs[modal].close();
  }

  questionErrors() {
    let errors = [],
      {questions} = this.state;
    for (let question of questions) {
      if (Object.keys(question?.error || {}).length > 0) {
        errors.push(question.error);
      }
    }

    return errors;
  }

  onSubmit = async () => {
    await this.validateForm();

    const {error, user, questions} = this.state;

    const {survey_id, point} = this.props.params;

    const calculate_each_question_point = questions.length / point;

    if (
      Object.keys(error || {}).length === 0 &&
      Object.keys(this.questionErrors()).length === 0
    ) {
      const {language} = this.props;
      const {question_added_failed} = languages[language];

      this.setState({
        isSubmitting: true,
      });

      for (let [index, question] of questions.entries()) {
        let route = '/add';

        const options = {
          method: 'POST',
          url: `${ROOT_API}/question${route}`,
          data: {
            survey: survey_id,
            question: question.question,
            id: question._id,
            options: question.options,
            type: question.type,
            setting: question.setting,
            organization: APP_ID,
            available: true,
            point: calculate_each_question_point,
          },
          headers: {
            authorization: `Bearer ${user.token}`,
          },
        };

        await axios(options)
          .then(data => {
            if (index === questions.length - 1) {
              this.setState({
                isSubmitting: false,
              });

              this.props.navigation.navigate('Home', {from: 'new'});
            }
          })
          .catch(error => {
            this.setState({isSubmitting: false});

            toastMessage(question_added_failed);
          });
      }
    }
  };

  render() {
    const {language} = this.props;
    const {field_with_star_required, submit, new_question} =
      languages[language];

    const bgColor = EStyleSheet.value('$bgColorLight');

    const modal_radius = {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    };

    const modal_styles = StyleSheet.create({
      otherOptionModal: {
        height: height / 2,
        ...modal_radius,
        backgroundColor: bgColor,
      },
      optionSettingModal: {
        height: height / 1.5,
        ...modal_radius,
        backgroundColor: bgColor,
      },

      createDropdownModal: {},

      questionMenuModal: {
        height: 150,
        ...modal_radius,
        backgroundColor: bgColor,
      },

      question_menu_modal: {
        height: height / 1.5,
        ...modal_radius,
        backgroundColor: bgColor,
      },
    });

    console.log('====================================');
    console.log(this.state.questions);
    console.log('====================================');

    return (
      <>
        <View style={styles.container}>
          <View style={styles.header}>
            <Back
              colorIcon={this.props.primary_color}
              goBack={() => this.props.navigation.goBack()}
            />
            <View style={{flex: 1, alignItems: 'center', marginRight: 40}}>
              <Image
                source={require('../../assets/logo.png')}
                style={styles.logo}
              />
            </View>
          </View>
          {this.state.isLoading ? (
            <Loading />
          ) : (
            <ScrollView
              contentContainerStyle={{flexGrow: 1}}
              keyboardShouldPersistTaps="always">
              <View style={styles.form_container}>
                <View style={styles.form_header}>
                  <Text type="bold" title style={styles.title}>
                    {new_question}
                  </Text>
                  <Text style={styles.description}>
                    {field_with_star_required}
                  </Text>
                </View>
                <View>
                  <CQuestions
                    questions={this.state.questions}
                    onChangeQuestion={(e, i) => this.onChangeQuestion(e, i)}
                    onChangeOption={params => this.onChangeOption(params)}
                    addRemoveQuestion={i => this.addRemoveQuestion(i)}
                    addRemoveOption={params => this.addRemoveOption(params)}
                    onPressOther={params =>
                      this.handleOpenQuestionMenuModal({
                        type: 'other_option',
                        ...params,
                        modal: 'otherOptionModal',
                      })
                    }
                    onPressOptionsModal={params =>
                      this.handleOpenQuestionMenuModal({
                        ...params,
                        modal: 'optionSettingModal',
                      })
                    }
                    // handleOpenOtherOptionModal={params =>
                    //   this.handleOpenModal('otherOptionModal', params)
                    // }
                    // handleOpenOptionSettingModal={params =>
                    //   this.handleOpenModal('optionSettingModal', params)
                    // }
                    onSetQuestionSetting={params =>
                      this.onSetQuestionSetting(params)
                    }
                    handleOpenQuestionMenuModal={params =>
                      this.handleOpenQuestionMenuModal(params)
                    }
                  />

                  <View
                    style={{
                      flexDirection: 'row',
                      paddingHorizontal: 15,
                      paddingBottom: 15,
                    }}>
                    <View style={{flex: 1, marginRight: 15}}>
                      <Button
                        text={'New Question'}
                        style={styles.login_btn}
                        // onPress={this.addRemoveQuestion.bind(this)}
                        onPress={() =>
                          this.handleOpenQuestionMenuModal({
                            type: 'question_menu',
                            action: 'add',
                          })
                        }
                        type="bordered"
                        primaryText
                        leftIcon="plus"
                        leftIconColor={this.props.primary_color}
                      />
                    </View>
                    <View style={{flex: 1}}>
                      <Button
                        text={submit}
                        style={styles.login_btn}
                        onPress={this.onSubmit.bind(this)}
                        isSubmitting={this.state.isSubmitting}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </ScrollView>
          )}
        </View>
        {/* <Modal
          style={modal_styles.otherOptionModal}
          ref="otherOptionModal"
          position={'bottom'}
          coverScreen
          onClosingState={() => this.handleCloseModal('otherOptionModal')}>
          <OtherOption
            onSelectOtherOption={params => this.onSelectOtherOption(params)}
          />
        </Modal> */}
        <Modal
          style={modal_styles.optionSettingModal}
          ref="optionSettingModal"
          position={'bottom'}
          coverScreen
          onClosingState={() => this.handleCloseModal('optionSettingModal')}>
          <Option
            menus={optionsOptions}
            onPress={params => this.addRemoveOption(params)}
            selected_item={this.state.selected_item}
            questions={this.state.questions}
            onRemove={params => this.onRemove(params)}
            handleCloseModal={() =>
              this.handleCloseModal('question_menu_modal')
            }
          />
        </Modal>
        <Modal
          style={modal_styles.createDropdownModal}
          ref="createDropdownModal"
          position={'top'}
          coverScreen
          onClosingState={() => this.handleCloseModal('createDropdownModal')}>
          <CreateDropDown
            onSelectOtherOption={params => this.onSelectOtherOption(params)}
            selected_item={this.state.selected_item}
            questions={this.state.questions}
            onAddRemoveDropdown={params => this.onAddRemoveDropdown(params)}
            handleCloseDropdownModal={() =>
              this.handleCloseModal('createDropdownModal')
            }
            handleCloseOptionModal={() =>
              this.handleCloseModal('optionSettingModal')
            }
          />
        </Modal>
        <Modal
          style={modal_styles.question_menu_modal}
          ref="question_menu_modal"
          position={'bottom'}
          coverScreen
          onClosingState={() => this.handleCloseModal('question_menu_modal')}>
          <Option
            menus={questionOptions}
            onPress={params => this.addRemoveQuestion(params)}
            selected_item={this.state.selected_item}
            onRemove={params => this.onRemove(params)}
            handleCloseModal={() =>
              this.handleCloseModal('question_menu_modal')
            }
          />
        </Modal>
      </>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {primary_color} = state.Theme;
  return {
    language,
    primary_color,
  };
};

export default connect(mapPropsToState)(QuestionForm);
