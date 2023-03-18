import React from 'react';
import {ActivityIndicator, View} from 'react-native';
import {connect} from 'react-redux';
import {Text} from '../Text';
import styles from './styles';

const Loading = props => {
  return (
    <View style={[styles.container, props.style]}>
      <ActivityIndicator
        size={props.size ? props.size : 'large'}
        style={styles.loading}
        color={props.primary_color}
      />
      {props?.message !== '' && props?.message && (
        <View>
          <Text style={{opacity: 0.5}}>{props.message}</Text>
        </View>
      )}
    </View>
  );
};

const mapPropsToState = state => {
  const {primary_color} = state.Theme;
  return {
    primary_color,
  };
};

export default connect(mapPropsToState)(Loading);
