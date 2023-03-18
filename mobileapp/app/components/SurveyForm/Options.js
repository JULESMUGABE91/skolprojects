import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Input} from '../Input';
import styles from './styles';
import Feather from 'react-native-vector-icons/Feather';
import {Text} from '../Text';
import {checkboxes} from '../../constants/input_options';

const renderOptionButton = ({
  props,
  question_index,
  option_index,
  question_id,
}) => {
  return (
    <View style={styles.q_a_btns}>
      <TouchableOpacity
        onPress={() =>
          props.handleOpenOptionSettingModal({
            type: 'new_option',
            question_index,
            option_index,
            question_id,
          })
        }>
        <View style={styles.q_a_btns_btn}>
          <Feather name="plus" color={props.primary_color} />
          <Text type="bold" primary>
            Add Option
          </Text>
        </View>
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() =>
          props.handleOpenOtherOptionModal({
            question_index,
            type: 'question_other_option',
          })
        }>
        <View style={styles.q_a_btns_btn}>
          <Text type="bold" primary>
            "Other" Option
          </Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          props.handleOpenQuestionMenuModal({
            question_index,
            type: 'question_menu',
          })
        }>
        <View style={styles.q_a_btns_btn}>
          <Feather name="more-horizontal" color={props.primary_color} />
          <Text type="bold" primary>
            More
          </Text>
        </View>
      </TouchableOpacity> */}
    </View>
  );
};

const COptions = props => {
  const {options, question_index, question_id} = props;

  return (
    <View>
      {options &&
        options.map((optionitem, option_index) => {
          return (
            <>
              <View key={option_index} style={styles.option_container}>
                {checkboxes.includes(optionitem.type) && (
                  <View style={styles.radio_container}>
                    <View style={styles.radio} />
                  </View>
                )}
                <View style={{flex: 1}}>
                  <Input
                    placeholder={'Enter ' + optionitem.type + ' label'}
                    value={optionitem.option}
                    onChangeText={e =>
                      props.onChangeOption({
                        e,
                        question_index,
                        option_index,
                        option: optionitem,
                      })
                    }
                    error={optionitem?.error?.option}
                    multiline
                    required
                    rightIcon="chevron-down"
                    onPressRight={() =>
                      props.handleOpenOptionSettingModal({
                        question_index,
                        option_index,
                        type: 'option_setting',
                      })
                    }
                  />
                  {optionitem.type === 'dropdown' &&
                    optionitem?.dropdown_options && (
                      <Text type="bold">
                        {optionitem?.dropdown_options?.length} option(s)
                      </Text>
                    )}
                </View>
                <View style={styles.option_btns}>
                  <TouchableOpacity
                    onPress={() =>
                      props.addRemoveOption({
                        question_index,
                        option_index,
                        type: 'remove',
                      })
                    }>
                    <View style={[styles.question_btns_btn, {marginTop: -10}]}>
                      <Feather
                        name="trash"
                        style={[
                          styles.q_btn_icon,
                          {color: props.primary_color},
                        ]}
                      />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              {options.length - 1 === option_index &&
                renderOptionButton({
                  props,
                  question_index,
                  option_index,
                  question_id,
                })}
            </>
          );
        })}
      {options &&
        options.length === 0 &&
        renderOptionButton({props, question_index, question_id})}
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

export default connect(mapPropsToState)(COptions);
