import React from 'react';
import {View} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import styles from './styles';
import {Text} from '../Text';
import {Button} from '../Button';

const Empty = props => {
  return (
    <View style={[styles.container, props.style]}>
      <View style={styles.image_container}>
        <MaterialCommunityIcons name={props.icon} style={styles.empty_icon} />
      </View>
      <View style={styles.empty_info}>
        <Text type="bold" sbtitle style={styles.title}>
          {props.title}
        </Text>
        {props.description && (
          <Text style={styles.description}>{props.description}</Text>
        )}
      </View>
      {props.retry && (
        <Button
          onPress={props.onRetry}
          type={props.buttonType ? props.buttonType : 'transparent'}
          text={props.retry}
          primaryText
        />
      )}
    </View>
  );
};

export default Empty;
