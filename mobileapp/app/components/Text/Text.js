import React from 'react';
import {Text} from 'react-native';
import {connect} from 'react-redux';
import Fonts from '../../utils/Fonts';
import styles from './styles';

const FontText = ({
  style,
  numberOfLines,
  type,
  children,
  title,
  primary,
  sbtitle,
  smtitle,
  primary_color,
  xstitle,
  underline,
  secondary,
  accent_color,
  danger,
  textDisabled,
  xtitle,
}) => {
  return (
    <Text
      style={[
        styles.text,
        title && styles.title,
        sbtitle && styles.sbtitle,
        smtitle && styles.smtitle,
        xstitle && styles.xstitle,
        underline && styles.underline,
        {
          fontFamily:
            type === 'bold'
              ? Fonts.FontBold
              : type === 'semi-bold'
              ? Fonts.FontBlack
              : type === 'light'
              ? Fonts.FontLight
              : Fonts.FontRegular,
        },
        style,
        primary && styles.primaryText,
        primary && {color: primary_color},
        secondary && {color: accent_color},
        danger && styles.danger,
        textDisabled && styles.textDisabled,
        xtitle && styles.xtitle,
      ]}
      numberOfLines={numberOfLines}
      ellipsizeMode="tail">
      {children}
    </Text>
  );
};

const mapPropsToState = state => {
  const {primary_color, accent_color} = state.Theme;
  return {
    primary_color,
    accent_color,
  };
};

export default connect(mapPropsToState)(FontText);
