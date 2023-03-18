import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import styles from './styles';

class Close extends React.Component {
  render() {
    return (
      <TouchableOpacity onPress={this.props.handleCloseModal}>
        <View style={styles.close_container}>
          <Feather name="x" style={styles.close_icon} />
        </View>
      </TouchableOpacity>
    );
  }
}

export default Close;
