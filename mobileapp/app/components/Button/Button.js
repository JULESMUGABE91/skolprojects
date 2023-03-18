import React from 'react';
import {TouchableOpacity, View, Image, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import {Text} from '../Text';
import styles from './styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Button = props => {
  return (
    <TouchableOpacity onPress={props.onPress} disabled={props.isSubmitting}>
      <View
        style={[
          styles.container,
          {backgroundColor: props.primary_color},
          props.type === 'transparent' && styles.transparent,
          props.type === 'bordered' && styles.bordered,
          props.type === 'secondary' && styles.secondary,
          props.type === 'disabled' && styles.disabled,
          props.type === 'sm' && styles.sm_btn,
          props.style,
        ]}>
        {!props.isSubmitting && props.gmail && (
          <Image source={{uri: props.image}} style={styles.image_gmail} />
        )}
        {!props.isSubmitting && props.apple && (
          <Image source={{uri: props.image}} style={styles.image_apple} />
        )}
        {!props.isSubmitting && props.leftIcon && (
          <View style={styles.leftIcon}>
            <MaterialCommunityIcons
              name={props.leftIcon}
              style={[
                styles.l_icon,
                props.leftIconColor && {color: props.leftIconColor},
              ]}
            />
          </View>
        )}
        {props.isSubmitting ? (
          <ActivityIndicator
            size="small"
            style={styles.submitting}
            color={props.loadingColor ? props.loadingColor : '#fff'}
          />
        ) : (
          <Text
            type="bold"
            style={[
              props.textBottomBorder && styles.text_border_bottom,
              styles.text,
              props.textBlack && styles.textBlack,
              props.primaryText && styles.primaryText,
              props.textStyles,
              props.type === 'sm' && styles.smTxt,
            ]}>
            {props.text}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

const mapPropsToState = state => {
  const {accent_color, primary_color} = state.Theme;
  return {
    primary_color,
    accent_color,
  };
};

export default connect(mapPropsToState)(Button);
