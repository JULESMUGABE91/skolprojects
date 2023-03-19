import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Input} from '../Input';
import styles from './styles';
import Feather from 'react-native-vector-icons/Feather';
import Options from './Options';

const CQuestions = props => {
  const {questions} = props;

  return (
    <View>
      {questions.map((qitem, q) => {
        let n = q + 1;
        return (
          <>
            <View key={q} style={styles.questions_container}>
              <View style={styles.questions_content}>
                <View style={{flex: 1}}>
                  <Input
                    label={'Question - ' + n}
                    placeholder={`Ask a question  ${
                      qitem.type !== 'textinput' ? 'of ' + qitem.type : ''
                    } `}
                    value={questions[q].question}
                    onChangeText={e => props.onChangeQuestion(e, q)}
                    error={questions[q]?.error?.question}
                    multiline
                    required
                    multipleAnswerText="Multiple Answers"
                    onSetQuestionSetting={setting =>
                      props.onSetQuestionSetting({question_index: q, setting})
                    }
                    isRequired={qitem?.setting?.isRequired}
                    isMultiAnswers={qitem?.setting?.isMultiAnswers}
                    requiredText="Required"
                    rightIcon="chevron-down"
                    onPressRight={() =>
                      props.handleOpenQuestionMenuModal({
                        ...qitem,
                        type: 'question_menu',
                        action: 'update',
                        question_index: q,
                      })
                    }
                  />
                </View>
                <View style={styles.question_btns}>
                  {questions.length > 1 && (
                    <>
                      <TouchableOpacity
                        onPress={() =>
                          props.handleRemoveQuestionFromRemote({
                            question_index: 1,
                            type: 'question_menu',
                            action: 'remove',
                          })
                        }>
                        <View
                          style={[
                            styles.question_btns_btn,
                            {
                              borderWidth: 2,
                              borderColor: props.primary_color,
                            },
                          ]}>
                          <Feather
                            name="minus"
                            style={[
                              styles.q_btn_icon,
                              styles.q_btn_icon_primary,
                            ]}
                          />
                        </View>
                      </TouchableOpacity>
                      <View style={{marginRight: 15}} />
                    </>
                  )}
                  {questions.length - 1 === q && (
                    <TouchableOpacity
                      onPress={() =>
                        props.handleOpenQuestionMenuModal({
                          question_index: q,
                          type: 'question_menu',
                          action: 'add',
                        })
                      }>
                      <View
                        style={[
                          styles.question_btns_btn,
                          {backgroundColor: props.primary_color},
                        ]}>
                        <Feather name="plus" style={styles.q_btn_icon} />
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
              <Options
                options={qitem.options}
                addRemoveOption={params => props.addRemoveOption(params)}
                question_index={q}
                question_id={qitem._id}
                onChangeOption={props.onChangeOption}
                handleOpenOtherOptionModal={props.onPressOther}
                handleOpenOptionSettingModal={props.onPressOptionsModal}
                handleOpenQuestionMenuModal={props.handleOpenQuestionMenuModal}
                handleChangePosition={props.handleChangePosition}
              />
            </View>
          </>
        );
      })}
    </View>
  );
};

const mapPropsToState = state => {
  const {language} = state.Language;
  const {primary_color} = state.Theme;
  return {
    language,
    primary_color,
  };
};

export default connect(mapPropsToState)(CQuestions);
