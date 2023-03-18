import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import {Text} from '../Text';
import styles from './styles';
import Feather from 'react-native-vector-icons/Feather';
import {Checkbox} from '../Input';
import {connect} from 'react-redux';

const Separator = props => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.left}>
        {props.checkbox && (
          <View>
            <Checkbox checked={props.checked} onCheck={props.onCheck} />
          </View>
        )}
        {props.title === '' ? (
          <View style={styles.empty_title} />
        ) : (
          <Text type="bold" smtitle style={props.titleStyle}>
            {props.title}
          </Text>
        )}
        {props.type && (
          <View
            style={[
              styles.type_container,
              props?.type?.includes('Health')
                ? {backgroundColor: props.accent_color}
                : {backgroundColor: props.primary_color},
            ]}>
            <Text style={styles.type_txt}>{props.type}</Text>
          </View>
        )}
      </View>
      <View style={styles.right}>
        {props.action === 'loading' ? (
          <View style={styles.btn_empty} />
        ) : (
          <TouchableOpacity onPress={props.onPressAction}>
            <Text type="bold" primary smtitle>
              {props.action}
            </Text>
          </TouchableOpacity>
        )}
        {props.collapse && (
          <TouchableOpacity onPress={props.collapse ? props.onToggle : null}>
            <View style={styles.collapse}>
              <Feather name="chevron-down" style={styles.collapse_icon} />
            </View>
          </TouchableOpacity>
        )}
        {props.rightCheckbox && (
          <View style={{marginTop: -10}}>
            <Checkbox
              checked={props.rightChecked}
              onCheck={props.onCheckRight}
              label={props.status}
            />
          </View>
        )}
      </View>
    </View>
  );
};

const mapPropsToState = state => {
  const {accent_color, primary_color} = state.Theme;
  return {
    accent_color,
    primary_color,
  };
};

export default connect(mapPropsToState)(Separator);
