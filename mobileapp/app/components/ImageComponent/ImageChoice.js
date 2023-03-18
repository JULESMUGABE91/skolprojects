import React from 'react';
import styles from './styles';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '../Text';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {DrawerActions} from '@react-navigation/native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Button} from '../Button';
import {Loading} from '../Loading';

const ImageChoice = props => {
  const menus = [
    {
      title: 'Take Picture',
      type: 'camera',
      icon: 'camera',
    },
    {
      title: 'Choose from Gallery',
      type: 'gallery',
      icon: 'folder',
    },
  ];

  return (
    <View style={styles.menu_container}>
      {props.isSubmitting ? (
        <Loading />
      ) : (
        menus.map((item, i) => {
          return (
            <TouchableOpacity onPress={() => props.onPress(item)} key={i}>
              <View style={styles.menu_item}>
                <MaterialCommunityIcons name={item.icon} style={styles.icon} />
                <Text type="bold">{item.title}</Text>
              </View>
            </TouchableOpacity>
          );
        })
      )}
    </View>
  );
};

const mapPropsToState = state => {
  const {language} = state.Language;
  return {
    language,
  };
};

export default connect(mapPropsToState)(ImageChoice);
