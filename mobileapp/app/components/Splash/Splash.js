import React from 'react';
import {View, Image} from 'react-native';
import styles from './styles';

const Splash = () => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/logo.png')} style={styles.logo} />
    </View>
  );
};

export default Splash;
