import React from 'react';
import {
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import styles from '../styles';
import {Text} from '../../Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const Dropdown = props => {
  return (
    <>
      <View style={styles.drop_down_header}>
        <View style={styles.title_modal_container}>
          <Text type="bold">{props?.option?.option || ''}</Text>
        </View>
        <TouchableOpacity onPress={props.handleCloseModal}>
          <View style={styles.dropdown_modal_close_container}>
            <MaterialCommunityIcons
              name="close"
              style={styles.dropdown_modal_close_icon}
            />
          </View>
        </TouchableOpacity>
      </View>
      <ScrollView>
        <View style={styles.menuModalContainer}>
          {props.menus.map((item, i) => {
            return (
              <TouchableOpacity
                disabled={item.isLoading}
                key={i}
                onPress={() => props.handleDropdownPressed({item, i})}>
                <View style={styles.item_menu}>
                  <View style={styles.menuitem_icon_container}>
                    {item.isLoading ? (
                      <ActivityIndicator color={props.primary_color} />
                    ) : (
                      <View style={[styles.icon_placeholder]}>
                        <MaterialCommunityIcons
                          name="menu-right"
                          style={styles.icon_placeholder_txt}
                        />
                      </View>
                    )}
                  </View>
                  <Text style={{flex: 1}} type="bold">
                    {item.value}
                  </Text>
                  <View
                    style={[
                      styles.dropdown_checkbox,
                      item.checked && styles.dropdown_checkbox_selected,
                    ]}>
                    <MaterialCommunityIcons
                      name="check"
                      style={[
                        styles.dropdown_checkbox_icon,
                        item.checked && styles.dropdown_checkbox_icon,
                      ]}
                    />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    </>
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

export default connect(mapPropsToState)(Dropdown);
