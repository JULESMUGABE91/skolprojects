import React from 'react';
import styles from './styles';
import {View, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {Text} from '../Text';

const Checkbox = props => {
  return (
    <TouchableOpacity onPress={props.onCheck}>
      <View style={styles.check_item}>
        <View
          style={[
            styles.checkbox_container,
            props?.checked != '' &&
              props.checked &&
              styles.checkbox_container_checked,
            props?.checked != '' &&
              props.checked && {backgroundColor: props.accent_color},
          ]}>
          {props?.checked != '' && props?.checked && (
            <Feather name="check" style={styles.check_icon} />
          )}
        </View>
        <Text type="bold" style={styles.check_label}>
          {props.label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const mapPropsToState = state => {
  const {theme, accent_color, primary_color} = state.Theme;
  return {
    theme,
    primary_color,
    accent_color,
  };
};

export default connect(mapPropsToState)(Checkbox);
