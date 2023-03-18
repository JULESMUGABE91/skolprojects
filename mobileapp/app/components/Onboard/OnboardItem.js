import React from 'react';
import {View, Image} from 'react-native';

import styles from './styles';
import {Text} from '../Text';

const OnboardItem = props => {
  return (
    <View style={styles.item_container}>
      <View style={styles.image_container}>
        <Image
          source={{uri: props.image}}
          style={[styles.image, props.i === 1 && styles.second]}
          resizeMode="contain"
        />
        <View style={[styles.image, props.i === 1 && styles.second]}></View>
      </View>
      <View style={styles.info}>
        <Text type="bold" primary style={styles.title} title>
          {props.title}
        </Text>
        <Text primary style={styles.description}>
          {props.description}
        </Text>
      </View>
    </View>
  );
};

export default OnboardItem;
