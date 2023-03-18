import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from '../../Text';

const OptionSetting = props => {
  const menus = [
    {
      title: 'Checkbox',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'checkbox',
          type: 'option_setting',
        }),
      icon: 'check-circle-outline',
    },
    {
      title: 'TextInput',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'textinput',
          type: 'option_setting',
        }),
      icon: 'card-text-outline',
    },

    {
      title: 'Name',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'name',
          type: 'option_setting',
        }),
      icon: 'card-text-outline',
    },
    {
      title: 'Phone Number',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'phone_number',
          type: 'option_setting',
        }),
      icon: 'card-text-outline',
    },
    {
      title: 'Address',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'address',
          type: 'option_setting',
        }),
      icon: 'card-text-outline',
    },

    {
      title: 'Gender',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'gender',
          type: 'option_setting',
        }),
      icon: 'card-text-outline',
    },
    {
      title: 'Dropdown',
      onPress: () =>
        props.onSelectOtherOption({
          input: 'dropdown',
          type: 'dropdown_option_setting',
        }),
      icon: 'format-list-bulleted-square',
    },
  ];

  // const templates_menus = [
  //   {
  //     title: 'Province',
  //     onPress: () =>
  //       props.onSelectOtherOption({
  //         key: 'province',
  //         input: 'dropdown',
  //         type: 'dropdown_option_setting',
  //         feature: 'built_in',
  //       }),
  //     icon: 'check-circle-outline',
  //   },
  //   {
  //     title: 'District',
  //     onPress: () =>
  //       props.onSelectOtherOption({
  //         key: 'district',
  //         input: 'dropdown',
  //         type: 'dropdown_option_setting',
  //         feature: 'built_in',
  //       }),
  //     icon: 'card-text-outline',
  //   },
  //   {
  //     title: 'Sector',
  //     onPress: () =>
  //       props.onSelectOtherOption({
  //         key: 'sector',
  //         input: 'dropdown',
  //         type: 'dropdown_option_setting',
  //         feature: 'built_in',
  //       }),
  //     icon: 'format-list-bulleted-square',
  //   },
  //   {
  //     title: 'Cell',
  //     onPress: () =>
  //       props.onSelectOtherOption({
  //         key: 'cell',
  //         input: 'dropdown',
  //         type: 'dropdown_option_setting',
  //         feature: 'built_in',
  //       }),
  //     icon: 'format-list-bulleted-square',
  //   },
  //   {
  //     title: 'Village',
  //     onPress: () =>
  //       props.onSelectOtherOption({
  //         input: 'village',
  //         feature: 'built_in',
  //         type: 'option_setting',
  //       }),
  //     icon: 'format-list-bulleted-square',
  //   },
  // ];
  return (
    <ScrollView>
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
        {/* <View style={{padding: 10}}>
          <Text type="bold" textDisabled>
            Menus with Templates
          </Text>
        </View> */}
        {/* {templates_menus.map((item, i) => {
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
        })} */}
      </View>
    </ScrollView>
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

export default connect(mapPropsToState)(OptionSetting);
