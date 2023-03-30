import React from 'react';
import {SafeAreaView, StatusBar, View} from 'react-native';
import styles from './styles';

const Container = props => {
  return (
    <SafeAreaView style={{backgroundColor: '#000', flex: 1}}>
      <StatusBar translucent barStyle="light-content" />
      <View style={styles.container}>{props?.children}</View>
    </SafeAreaView>
  );
};

export default Container;
