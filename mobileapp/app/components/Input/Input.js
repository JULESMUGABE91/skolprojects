import React from 'react';
import {
  View,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Image,
} from 'react-native';
import styles from './styles';
import {Text} from '../Text';
import Feather from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';

class Input extends React.Component {
  state = {};
  onShowPassword(placeholder) {
    let field = `${placeholder}_secure_text`;
    this.setState({
      [field]: !this.state[field],
    });
  }

  render() {
    const props = this.props;

    let placeholder = props?.placeholder?.replace(' ', '_') || '';

    let secure_input_state = this.state[placeholder + '_secure_text'];

    return (
      <>
        {props.label && (
          <View>
            <Text type="bold">
              {props.label}{' '}
              {props.required && <Text style={styles.danger}>*</Text>}
            </Text>
            <View style={{flexDirection: 'row', flex: 1, alignItems: 'center'}}>
              {props.multipleAnswerText && (
                <TouchableOpacity
                  onPress={() => props.onSetQuestionSetting('isMultiAnswers')}>
                  <View
                    style={[
                      styles.question_setting,
                      props.isMultiAnswers && {
                        borderColor: props.primary_color,
                      },
                      {marginRight: 15},
                    ]}>
                    <View
                      style={[
                        styles.question_setting_check,
                        props.isMultiAnswers && {
                          borderColor: this.props.primary_color,
                        },
                      ]}>
                      <Feather
                        name="check"
                        style={[
                          styles.question_setting_check_icon,
                          props.isMultiAnswers && {
                            color: this.props.primary_color,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      type="bold"
                      style={{opacity: props.isMultiAnswers ? 1 : 0.5}}
                      primary={props.isMultiAnswers}>
                      {props.multipleAnswerText}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              {props.requiredText && (
                <TouchableOpacity
                  onPress={() => props.onSetQuestionSetting('isRequired')}>
                  <View
                    style={[
                      styles.question_setting,
                      props.isRequired && {
                        borderColor: props.primary_color,
                      },
                    ]}>
                    <View
                      style={[
                        styles.question_setting_check,
                        props.isRequired && {
                          borderColor: this.props.primary_color,
                        },
                      ]}>
                      <Feather
                        name="check"
                        style={[
                          styles.question_setting_check_icon,
                          props.isRequired && {
                            color: this.props.primary_color,
                          },
                        ]}
                      />
                    </View>
                    <Text
                      type="bold"
                      style={{opacity: props.isRequired ? 1 : 0.5}}
                      primary={props.isRequired}>
                      {props.requiredText}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}
        <View
          style={[
            styles.container,
            props.error && styles.input_error,
            props.light && styles.light,
          ]}>
          {props.leftIcon && (
            <View style={styles.left_icon_container}>
              {props?.leftIcon?.includes('http') ? (
                <Image
                  source={{uri: props.leftIcon}}
                  style={styles.leftIconImage}
                />
              ) : (
                <Feather name={props.leftIcon} style={styles.icon} />
              )}
            </View>
          )}
          {props.clickable ? (
            <TouchableOpacity style={{flex: 1}} onPress={props.onInputPressed}>
              <TextInput
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={props.onChangeText}
                style={[styles.input, props.inputStyles]}
                secureTextEntry={
                  secure_input_state ? false : props.secureTextEntry
                }
                pointerEvents="none"
                editable={false}
                keyboardType={props.keyboardType}
                multiline={props.multiline}
              />
            </TouchableOpacity>
          ) : (
            <View style={{flex: 1, flexDirection: 'row'}}>
              {props.showCountryCode && props?.country?.value && (
                <TouchableOpacity>
                  <View style={styles.phone_country_code}>
                    <Image
                      source={{uri: props.country.flag}}
                      style={styles.flag}
                    />
                    <Text style={styles.phone_country_code_txt}>
                      {props.country.value}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              <TextInput
                placeholder={props.placeholder}
                value={props.value}
                onChangeText={props.onChangeText}
                style={styles.input}
                secureTextEntry={
                  secure_input_state ? false : props.secureTextEntry
                }
                keyboardType={props.keyboardType}
                maxLength={props.maxLength}
                autoFocus={props.autoFocus}
                autoCapitalize={props.autoCapitalize}
                placeholderTextColor="rgba(0,0,0,0.3)"
                multiline={props.multiline}
                editable={props.editable}
              />
            </View>
          )}

          {props.rightIcon && (
            <TouchableOpacity
              onPress={
                secure_input_state && props.secureTextEntry
                  ? this.onShowPassword.bind(this, placeholder)
                  : props.onPressRight
              }>
              <View styles={styles.right_icon}>
                <Feather
                  name={
                    props.secureTextEntry
                      ? secure_input_state
                        ? 'eye'
                        : 'eye-off'
                      : props.rightIcon
                  }
                  style={styles.icon}
                />
              </View>
            </TouchableOpacity>
          )}
          {props.rightText && !props.isResending && (
            <TouchableOpacity onPress={props.onPressRight}>
              <View styles={styles.right_icon}>
                <Text type="bold" primary>
                  {props.rightText}
                </Text>
              </View>
            </TouchableOpacity>
          )}
          {props.rightText && props.isResending && (
            <View styles={styles.right_icon}>
              <ActivityIndicator size={'small'} color={props.primary_color} />
            </View>
          )}
        </View>
        {props.helpText && (
          <View style={styles.helpText_container}>
            <Text style={styles.helpText} textDisabled>
              {props.helpText}
            </Text>
          </View>
        )}
        {props.error && (
          <View style={[styles.error_container, {marginBottom: 15}]}>
            <Text style={styles.error}>{props.error}</Text>
          </View>
        )}
      </>
    );
  }
}

const mapPropsToState = state => {
  const {primary_color} = state.Theme;
  return {
    primary_color,
  };
};

export default connect(mapPropsToState)(Input);
