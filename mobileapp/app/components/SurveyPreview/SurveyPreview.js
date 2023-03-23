import React from 'react';
import styles from './styles';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import {Text} from '../Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import LocalStorage from '../../utils/storage';
import {Button} from '../Button';
import {APP_ID, ROOT_API} from '../../constants/strings';
import axios from 'axios';
import {VirtualizedList} from '../VirtualizedList';
import {Loading} from '../Loading';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import Menu from './Modal/Menu';
import toastMessage from '../../utils/toastMessage';
import {Empty} from '../Empty';
import {Input} from '../Input';
import Dropdown from './Modal/Dropdown';
import uuid4 from '../../utils/uuid4';
import {Introduction} from '../Introduction';
import {checkboxes, dropdown, inputs} from '../../constants/input_options';

const {height} = Dimensions.get('screen');
class SurveyPreview extends React.Component {
  state = {
    survey: {},
    current_question_index: 0,
    survey_percentage: 0,
    progress_bar_witth: 0,
    progress_bar_indicator_witth: 0,
    user: {},
    questions: [],
    refreshing: false,
    isSubmitting: false,
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user, survey: this.props.params.data}, () => {
      this.getData();

      //for surveyor
      if (
        (user.account_type === 'super_admin' ||
          user.account_type === 'admin' ||
          user.account_type === 'sub_admin') &&
        this.state.current_question_index === 0 &&
        this.props.params.data?.introduction &&
        this.props.params.data?.introduction !== ''
      ) {
        this.handleOpenModal('introductionmodal');
      }
    });
  };

  getData = async () => {
    await this.getQuestion(true);
  };

  getQuestion = async () => {
    this.setState({isLoading: true});

    const {_id} = this.props.params.data;

    const {user} = this.state;

    const options = {
      method: 'POST',
      url: `${ROOT_API}/question/fetch`,
      data: {
        survey: _id,
      },
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    return await axios(options)
      .then(data => {
        this.setState({
          isLoading: false,
          questions: data.data,
          refreshing: false,
        });
      })
      .catch(error => {
        toastMessage(error);

        this.setState({isLoading: false, refreshing: false});
      });
  };

  onRefresh() {
    this.setState({refreshing: true}, () => this.getQuestion(false));
  }

  handleOpenModal(modal, params) {
    if (params && params.option) {
      this.setState({selected_option: params});
    }

    this.refs[modal].open();
  }

  handleCloseModal(modal) {
    this.refs[modal].close();
  }

  onNext = async () => {
    const {survey, current_question_index} = this.state;

    const error = await this.validateForm(current_question_index);
    if (Object.keys(error).length > 0) return;

    const {questions} = survey;

    if (questions.length - 1 > current_question_index) {
      this.setState({
        current_question_index: current_question_index + 1,
      });
    }

    if (questions.length - 1 === current_question_index) {
      this.onSubmit();
    }
  };

  onPrevious() {
    let {survey, current_question_index} = this.state;

    current_question_index -= 1;

    this.setState({
      current_question_index,
    });
  }

  onPressOptionOption = async params => {
    let {questions} = this.state;
    const {question_index} = params;

    if (questions[question_index]) {
      this.handleAnswer(params);
    }
  };

  handleAnswer(params) {
    let {questions, selected_option} = this.state;
    let {question_index, option} = params;

    let question = questions[question_index];

    delete questions[question_index].error;

    if (!questions[question_index].responses) {
      questions[question_index]['responses'] = [option];
    } else {
      let responses = question?.responses || [],
        {setting} = question,
        response_index = responses.findIndex(el => el._id === option._id);

      if (response_index !== -1) {
        if (option.type === 'dropdown') {
          return;
        }
        responses.splice(response_index, 1);
      } else if (setting?.isMultiAnswers) {
        responses.push(option);
      } else {
        // remove selection
        for (let op of questions[question_index]?.options || []) {
          delete op.selection;

          //uncheck dropdown
          for (let dop of op?.dropdown_options || []) {
            delete dop.checked;
          }
        }
        questions[question_index].responses = [option];
      }
    }

    this.setState({questions, selected_option});
  }

  onChangeInputAnswer(params) {
    let {questions} = this.state;
    let {value, question_index, option} = params;

    let question = questions[question_index];
    let responses = question?.responses || [],
      {setting} = question;

    option['value'] = value;

    delete question.error;
    delete option.error;

    if (!question.responses) {
      question['responses'] = [option];
    } else {
      let response_index = responses.findIndex(el => el._id === option._id);

      if (response_index !== -1) {
        // if (!option.value || option.value === '') {
        //   responses.splice(response_index, 1);
        // } else {
        responses[response_index] = option;
        // }
      } else if (setting?.isMultiAnswers) {
        responses.push(option);
      } else {
        responses = [option];
      }
    }

    this.setState({questions});
  }

  onPressCheckbox() {
    let {questions} = this.state;
    const {question_index, option} = params;

    if (
      questions[question_index].setting &&
      questions[question_index]?.setting.isMultipleAnswer
    ) {
      if (!questions[question_index].responses) {
        questions[question_index]['responses'] = [
          {
            option,
          },
        ];
      } else {
        for (let [response_index, response] of questions[
          question_index
        ].responses.entries()) {
          if (response._id === option._id) {
            questions[question_index].responses.splice(response_index, 1);

            if (questions[question_index].responses.length === 0) {
              delete questions[question_index].responses;
            }
          } else {
            questions[question_index].responses.push(option);
          }
        }
      }
    } else if (questions[question_index].responses) {
      if (questions[question_index].responses.length === 0) {
        questions[question_index]['responses'].push(option);
      } else {
        for (let [response_index, response] of questions[
          question_index
        ].responses.entries()) {
          if (response._id === option._id) {
            questions[question_index].responses.splice(response_index, 1);
          } else {
            questions[question_index]['responses'] = [option];
          }
        }
      }
    } else {
      questions[question_index].responses = [option];
    }
    this.setState({
      questions,
    });
  }

  formattedSurvey(questions) {
    const {survey} = this.state;
    const {my_location} = this.props;

    let formatted = [];

    for (let question of questions) {
      if (
        question.responses &&
        Object.keys(question?.error || {}).length === 0
      ) {
        formatted.push({
          survey: survey._id,
          question: question._id,
          answers: question.responses,
          start_location: {
            coordinates: [my_location.latitude, my_location.longitude],
            address: my_location.name,
          },
          end_location: {
            coordinates: [my_location.latitude, my_location.longitude],
            address: my_location.name,
          },
        });
      }
    }

    return formatted;
  }

  validateForm(current_question_index) {
    let error = {},
      {questions} = this.state;

    if (current_question_index !== undefined) {
      let question = questions[current_question_index];

      question.error = {};

      const setting = question?.setting || {};

      if (Object.keys(setting).includes('isRequired')) {
        if (!question.responses || question?.responses?.length === 0) {
          let message = 'This question is required';
          question.error['question_' + current_question_index] = message;
          error['question_' + current_question_index] = message;
        }
      }
    } else {
      for (let [index, question] of questions.entries()) {
        question.error = {};

        const setting = question?.setting || {};

        if (Object.keys(setting).includes('isRequired')) {
          if (!question.responses || question?.responses?.length === 0) {
            let message = 'This question is required';
            question.error['question_' + index] = message;
            error['question_' + index] = message;
          }
        }
      }
    }

    this.setState({questions});

    return error;
  }

  onSubmit = async params => {
    try {
      const error = await this.validateForm();

      if (Object.keys(error).length > 0) return;

      this.setState({isSubmitting: true});

      const {user, survey, questions} = this.state;

      const identifier = survey._id + '__' + uuid4();

      const completed_format = this.formattedSurvey(questions);

      let request_body = [];

      for (let formatted of completed_format) {
        request_body.push({
          ...formatted,
          survey,
          organization: APP_ID,
          status: params?.status || undefined,
          last_question: params?.last_question || undefined,
        });
      }

      const options = {
        method: 'POST',
        url: `${ROOT_API}/answer/add/bulk`,
        data: {
          questions: request_body,
          organization: APP_ID,
          identifier,
          survey: survey._id,
        },
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const data = await axios(options);

      await this.addToUserSurvey({survey});

      this.setState({
        isSubmitting: false,
      });

      this.props.navigation.navigate('Success', data.data);
    } catch (error) {
      console.log('====================================');
      console.log({error});
      console.log('====================================');
      toastMessage(error);
      this.setState({isSubmitting: false, isFetched: false});
    }
  };

  handleDropdownPressed(params) {
    const {item, i} = params;
    const {selected_option, questions} = this.state;
    const {option, question_index, option_index} = selected_option;

    item['checked'] = !item['checked'];

    if (!option.selection) {
      option.selection = [item];
    } else {
      let exist_selection = [];
      for (let el of option?.selection || []) {
        if (!exist_selection.includes(el._id)) {
          exist_selection.push(el._id);
        }
      }

      let index_option = exist_selection.indexOf(item._id);

      if (index_option !== -1) {
        option.selection.splice(index_option, 1);
      } else {
        option.selection.push(item);
      }
    }

    questions[question_index].options[option_index] = option;

    this.setState({questions});

    if (!questions[question_index]?.setting?.isMultiAnswers) {
      this.handleCloseModal('dropdownmodal');
    }
  }

  addToUserSurvey = async params => {
    try {
      const {user} = this.state;
      const {survey} = params;

      const options = {
        method: 'POST',
        url: `${ROOT_API}/user/survey`,
        data: {
          organization: APP_ID,
          survey: survey._id,
          user: user._id,
        },
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      return await axios(options);
    } catch (error) {
      console.log(error);
    }
  };

  handleCancel = async () => {
    try {
      this.setState({isCancelling: true});

      let {current_question_index, survey, user} = this.state;

      const q = this.remainingQuestion(current_question_index);

      let last_question = q[current_question_index]?._id || undefined;

      const identifier = survey._id + '__' + uuid4();

      const completed_format = this.formattedSurvey(q);

      let request_body = [];

      for (let formatted of completed_format) {
        request_body.push({
          ...formatted,
          survey,
          organization: APP_ID,
          status: 'incomplete',
          last_question: last_question,
        });
      }

      const options = {
        method: 'POST',
        url: `${ROOT_API}/answer/add/bulk`,
        data: {
          questions: request_body,
          organization: APP_ID,
          identifier,
          survey: survey._id,
        },
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      const data = await axios(options);

      this.setState({
        isCancelling: false,
      });

      this.props.navigation.goBack();
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      this.setState({isCancelling: false});
      toastMessage(
        'Cancel this survey has been failed, please your internet and try again',
      );
    }
  };

  remainingQuestion(current_question_index) {
    let {questions} = this.state;

    let copyQuestions = questions.slice(0);

    if (
      !questions[current_question_index] ||
      (questions[current_question_index] &&
        (!questions[current_question_index]?.responses ||
          questions[current_question_index]?.responses?.length === 0))
    ) {
      copyQuestions.splice(current_question_index, 1);

      current_question_index =
        current_question_index > 0 ? current_question_index - 1 : 0;
    }

    return copyQuestions;
  }

  render() {
    const bgColor = EStyleSheet.value('$bgColorLight');

    const modal_radius = {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 0,
    };

    const modal_styles = StyleSheet.create({
      menuModal: {
        height: 110,
        ...modal_radius,
        backgroundColor: bgColor,
      },

      dropdownmodal: {
        height: height / 2,
        ...modal_radius,
        backgroundColor: bgColor,
      },

      introductionmodal: {
        // height: height / 2,
        // ...modal_radius,
        // backgroundColor: bgColor,
      },
    });

    return (
      <>
        <View style={styles.container}>
          <VirtualizedList
            refreshing={this.state.refreshing}
            onRefresh={this.onRefresh.bind(this)}
            styles={{paddingHorizontal: 0, flexGrow: 1}}>
            <View style={styles.header}>
              <View style={styles.title_container}>
                <View style={{flexDirection: 'row'}}>
                  <View style={styles.q_count}>
                    <Text style={styles.q_count_txt}>
                      Q{this.state.current_question_index + 1}.
                    </Text>
                  </View>
                  <View style={{flex: 1}}>
                    <Text sbtitle primary type="bold">
                      {this.state.survey.title}
                    </Text>
                    <View style={styles.survey_count_question}>
                      <Text
                        style={{fontSize: 12, opacity: 0.7, marginTop: 15}}
                        primary>
                        {this.state.current_question_index + 1} /{' '}
                        {this.state?.questions?.length} Questions
                      </Text>
                    </View>
                  </View>

                  {this.state.current_question_index > 0 && (
                    <View style={styles.close_container}>
                      <TouchableOpacity onPress={() => this.handleCancel()}>
                        <View>
                          {this.state.isCancelling ? (
                            <ActivityIndicator />
                          ) : (
                            <MaterialCommunityIcons
                              name="close"
                              style={styles.close_icon}
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {this.state.isLoading ? (
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Loading />
              </View>
            ) : (
              <>
                {this.state.questions.length === 0 && (
                  <Empty
                    title="No question"
                    description="Questions will listed here"
                    icon="progress-question"
                  />
                )}
                <View style={styles.content}>
                  {this.state.questions &&
                    this.state.questions.length > 0 &&
                    this.state.questions.map((question, q) => {
                      if (q === this.state.current_question_index) {
                        return (
                          <View
                            key={q}
                            style={[styles.question_item, {paddingBottom: 20}]}>
                            <View style={{flexDirection: 'row'}}>
                              <Text title type="bold" style={{marginRight: 10}}>
                                {q + 1}.
                              </Text>
                              <View style={{flex: 1, flexDirection: 'row'}}>
                                <View>
                                  <Text sbtitle type="bold">
                                    {question.question}
                                  </Text>
                                  {Object.keys(
                                    question?.error &&
                                      question?.error['question_' + q]
                                      ? question?.error['question_' + q]
                                      : {},
                                  ).length > 0 && (
                                    <Text danger>
                                      {question?.error['question_' + q]}
                                    </Text>
                                  )}
                                </View>
                                {question?.setting?.isRequired && (
                                  <Text
                                    title
                                    type="bold"
                                    danger
                                    style={{marginLeft: 4}}>
                                    *
                                  </Text>
                                )}
                              </View>
                            </View>
                            {question.options &&
                              question.options.map((option, a) => {
                                let isResponded = false;

                                for (let response of question?.responses ||
                                  []) {
                                  if (response._id == option._id) {
                                    isResponded = true;
                                  }
                                }

                                if (checkboxes.includes(option.type)) {
                                  return (
                                    <TouchableOpacity
                                      key={a}
                                      onPress={() =>
                                        this.onPressOptionOption({
                                          question_index: q,
                                          option_index: a,
                                          option,
                                        })
                                      }>
                                      <View
                                        style={[
                                          styles.option_container,
                                          styles.option_container_selected,
                                          isResponded && {
                                            borderColor:
                                              this.props.primary_color,
                                          },
                                        ]}>
                                        <View
                                          style={[
                                            styles.radio_container,
                                            isResponded && {
                                              borderColor:
                                                this.props.primary_color,
                                            },
                                          ]}>
                                          <View
                                            style={[
                                              styles.radio_selected,
                                              isResponded && {
                                                backgroundColor:
                                                  this.props.primary_color,
                                                borderRadius: 10,
                                              },
                                            ]}></View>
                                        </View>
                                        <View style={styles.option_content}>
                                          <Text>{option.option}</Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                } else if (inputs.includes(option.type)) {
                                  let input_value = '';

                                  if (question.responses) {
                                    for (let res of question.responses) {
                                      if (res._id === option._id) {
                                        input_value = option?.value || '';
                                      }
                                    }
                                  }
                                  return (
                                    <View
                                      key={q}
                                      style={styles.option_txtinput_container}>
                                      <Input
                                        // label={option.option}
                                        placeholder={option.option + '...'}
                                        value={input_value}
                                        error={option.error}
                                        keyboardType={
                                          option.type === 'number'
                                            ? 'number-pad'
                                            : 'default'
                                        }
                                        onChangeText={e =>
                                          this.onChangeInputAnswer({
                                            field: option?.option?.replace(
                                              ' ',
                                              '_',
                                            ),
                                            value: e,
                                            question_index: q,
                                            option_index: a,
                                            option,
                                          })
                                        }
                                      />
                                    </View>
                                  );
                                } else if (dropdown.includes(option.type)) {
                                  return (
                                    <TouchableOpacity
                                      key={a}
                                      onPress={() => {
                                        this.onPressOptionOption({
                                          question_index: q,
                                          option_index: a,
                                          option,
                                        });
                                        this.handleOpenModal('dropdownmodal', {
                                          question_index: q,
                                          option_index: a,
                                          option,
                                        });
                                      }}>
                                      <View
                                        style={[
                                          styles.option_container,
                                          styles.option_container_selected,
                                          isResponded && {
                                            borderColor:
                                              this.props.primary_color,
                                          },
                                        ]}>
                                        <View
                                          style={[
                                            styles.radio_container,
                                            isResponded && {
                                              borderColor:
                                                this.props.primary_color,
                                            },
                                          ]}>
                                          <View
                                            style={[
                                              styles.radio_selected,
                                              isResponded && {
                                                backgroundColor:
                                                  this.props.primary_color,
                                                borderRadius: 10,
                                              },
                                            ]}></View>
                                        </View>
                                        <View
                                          style={[
                                            styles.option_content,
                                            {
                                              flexDirection: 'row',
                                              alignItems: 'center',
                                              flexWrap: 'wrap',
                                              flex: 1,
                                              paddingVertical: 10,
                                            },
                                          ]}>
                                          <Text style={{marginRight: 10}}>
                                            {option.option}
                                          </Text>
                                          {question?.responses?.length > 0 &&
                                            question?.responses.map(
                                              (res, r) => {
                                                if (res._id === option._id) {
                                                  return (
                                                    <>
                                                      {res?.selection &&
                                                        res?.selection?.map(
                                                          (selected, s) => {
                                                            if (
                                                              selected.checked
                                                            ) {
                                                              return (
                                                                <View key={s}>
                                                                  <Text
                                                                    primary
                                                                    type="bold">
                                                                    {
                                                                      selected.value
                                                                    }
                                                                  </Text>
                                                                </View>
                                                              );
                                                            }
                                                          },
                                                        )}
                                                    </>
                                                  );
                                                }
                                              },
                                            )}
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  );
                                }
                              })}
                          </View>
                        );
                      }
                    })}
                </View>
              </>
            )}
          </VirtualizedList>
          <View style={styles.btns_container}>
            {this.state.current_question_index === 0 &&
              (this.state?.user?.account_type === 'super_admin' ||
                this.state?.user?.account_type === 'admin') && (
                <View style={{flex: 1, marginRight: 15}}>
                  <Button
                    type="bordered"
                    text="View Actions"
                    onPress={() => this.handleOpenModal('menuModal')}
                    primaryText
                  />
                </View>
              )}
            {this.state.current_question_index > 0 && (
              <View style={{flex: 1, marginRight: 15}}>
                <Button
                  text={'Back'}
                  onPress={this.onPrevious.bind(this)}
                  type="bordered"
                  primaryText
                />
              </View>
            )}
            {this.state.questions.length > 0 && (
              <View style={{flex: 1}}>
                <Button
                  text={
                    this.state.questions.length - 1 ===
                    this.state.current_question_index
                      ? 'Submit'
                      : 'Next'
                  }
                  onPress={this.onNext.bind(this)}
                  isSubmitting={this.state.isSubmitting}
                />
              </View>
            )}
          </View>
        </View>
        <Modal
          style={modal_styles.menuModal}
          ref="menuModal"
          position={'bottom'}
          coverScreen
          onClosingState={() => this.handleCloseModal('menuModal')}>
          <Menu
            navigation={this.props.navigation}
            survey={this.state.survey}
            questions={this.state.questions}
          />
        </Modal>
        <Modal
          style={modal_styles.introductionmodal}
          ref="introductionmodal"
          position={'top'}
          coverScreen
          onClosingState={() => this.handleCloseModal('introductionmodal')}>
          <Introduction
            navigation={this.props.navigation}
            intro={this.state?.survey?.introduction}
            goBack={() => {
              this.handleCloseModal('introductionmodal');
              this.props.navigation.goBack();
            }}
            handleCloseModal={() => this.handleCloseModal('introductionmodal')}
          />
        </Modal>
        <Modal
          style={modal_styles.dropdownmodal}
          ref="dropdownmodal"
          position={'bottom'}
          coverScreen
          onClosingState={() => this.handleCloseModal('dropdownmodal')}>
          <Dropdown
            navigation={this.props.navigation}
            menus={this.state?.selected_option?.option?.dropdown_options || []}
            questions={this.state.questions}
            option={this.state?.selected_option?.option || {}}
            selected_option={this.state?.selected_option || {}}
            handleDropdownPressed={params => this.handleDropdownPressed(params)}
            handleCloseModal={() => this.handleCloseModal('dropdownmodal')}
          />
        </Modal>
      </>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {accent_color, primary_color} = state.Theme;
  const {my_location} = state.MyLocation;
  return {
    language,
    accent_color,
    primary_color,
    my_location,
  };
};

export default connect(mapPropsToState)(SurveyPreview);
