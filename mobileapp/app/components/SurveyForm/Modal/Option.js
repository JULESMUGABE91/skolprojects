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

const Option = props => {
  return (
    <ScrollView>
      <View style={styles.menuModalContainer}>
        {props?.menus?.map((item, i) => {
          return (
            <TouchableOpacity
              disabled={item.isLoading}
              key={i}
              onPress={() =>
                props.onPress({
                  ...props.selected_item,
                  config: item?.config || {},
                  index: i,
                })
              }>
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

export default connect(mapPropsToState)(Option);
