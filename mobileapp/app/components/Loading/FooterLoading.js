import React from 'react';
import {View, ActivityIndicator} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles';

const FooterLoading = props => {
  return (
    <View style={styles.loader_footer}>
      <ActivityIndicator size="small" color={props.primary_color} />
    </View>
  );
};

const mapPropsToState = state => {
  const {primary_color} = state.Theme;
  return {
    primary_color,
  };
};

export default connect(mapPropsToState)(FooterLoading);
