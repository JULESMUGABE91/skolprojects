import React from 'react';
import {ActivityIndicator, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from '../../Text';

const OtherOptions = props => {
  const menus = [
    {
      title: 'Checkbox',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'checkbox',
          type: 'question_other_option',
        }),
      icon: 'check-circle-outline',
    },
    {
      title: 'TextInput',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'textinput',
          type: 'question_other_option',
        }),
      icon: 'card-text-outline',
    },
    {
      title: 'Name',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'name',
          type: 'question_other_option',
        }),
      icon: 'card-text-outline',
    },
    {
      title: 'Address',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'address',
          type: 'question_other_option',
        }),
      icon: 'card-text-outline',
    },
    {
      title: 'Phone Number',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'phone_number',
          type: 'question_other_option',
        }),
      icon: 'card-text-outline',
    },
    {
      title: 'Age',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'age',
          type: 'question_other_option',
        }),
      icon: 'card-text-outline',
    },
  ];
  return (
    <View style={styles.menuModalContainer}>
      {menus.map((item, i) => {
        return (
          <TouchableOpacity
            disabled={item.isLoading}
            key={i}
            onPress={item.onPress}>
            <View style={styles.item_menu}>
              <View style={styles.menuitem_icon_container}>
                {item.isLoading ? (
                  <ActivityIndicator color={this.props.primary_color} />
                ) : (
                  <MaterialCommunityIcons
                    name={item.icon}
                    style={styles.menuitem_icon}
                  />
                )}
              </View>
              <Text type="bold">{item.title}</Text>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const mapPropsToState = state => {
  const {language} = state.Language;
  const {accent_color, primary_color} = state.Theme;
  return {
    language,
    accent_color,
    primary_color,
  };
};

export default connect(mapPropsToState)(OtherOptions);
