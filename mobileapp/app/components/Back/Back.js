import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';

const Back = props => {
  return (
    <TouchableOpacity onPress={props.goBack}>
      <View style={styles.back_container}>
        <Feather
          name="arrow-left"
          style={[
            styles.back_icon,
            props.colorIcon && {color: props.colorIcon},
          ]}
          color={props.colorIcon}
        />
      </View>
    </TouchableOpacity>
  );
};

export default Back;
