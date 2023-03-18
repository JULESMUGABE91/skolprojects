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

const QuestionMenu = props => {
  const menus = [
    {
      title: 'Duplicate this Question',
      onPress: () =>
        props.onSelectQuestionMenu({
          input: 'duplicate',
          type: 'question_menu',
        }),
      icon: 'check-circle-outline',
    },
  ];
  return (
    <ScrollView>
      <View style={styles.menuModalContainer}>
        <View
          style={{
            paddingHorizontal: 15,
            minHeight: 40,
            alignItems: 'center',
            flexDirection: 'row',
          }}>
          <Text type="bold">Q: {props.selected_item.question}</Text>
        </View>
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

export default connect(mapPropsToState)(QuestionMenu);
