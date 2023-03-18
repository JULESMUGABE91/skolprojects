import React from 'react';
import {View, Text, TouchableOpacity, Platform} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {languages} from '../constants/localization';
import styles from './styles';
import {connect} from 'react-redux';

class CustomTab extends React.Component {
  handlePress(name) {
    const {navigation} = this.props;

    navigation.navigate(name);
  }

  returnTabName(name) {
    const {language} = this.props;
    const {surveys, rewards, profile_txt} = languages[language];

    let tab_name = '';

    switch (name) {
      case 'Surveys':
        tab_name = surveys;
        break;
      case 'Zawadi':
        tab_name = rewards;
        break;
      case 'Profile':
        tab_name = profile_txt;
        break;
      default:
        break;
    }

    return tab_name;
  }

  render() {
    const {state, primary_color} = this.props;
    const {routes, index} = state;

    return (
      <View style={[styles.tabs, Platform.OS === 'ios' && {paddingBottom: 30}]}>
        {routes.map((item, i) => {
          const {name} = item;
          return (
            <TouchableOpacity
              key={i}
              style={{flex: 1}}
              onPress={() => this.handlePress(name)}>
              <View
                style={{
                  flex: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                {name === 'Surveys' ? (
                  <View style={styles.add}>
                    <MaterialCommunityIcons
                      name="home-outline"
                      size={23}
                      style={
                        index === i
                          ? [styles.activeTabIcon, {color: primary_color}]
                          : styles.inactiveTabIcon
                      }
                    />
                  </View>
                ) : name === 'Zawadi' ? (
                  <View>
                    <MaterialCommunityIcons
                      name="trophy-outline"
                      size={23}
                      style={
                        index === i
                          ? [styles.activeTabIcon, {color: primary_color}]
                          : styles.inactiveTabIcon
                      }
                    />
                  </View>
                ) : (
                  name === 'Profile' && (
                    <View style={{position: 'relative'}}>
                      <MaterialCommunityIcons
                        name="account-outline"
                        size={23}
                        style={
                          index === i
                            ? [styles.activeTabIcon, {color: primary_color}]
                            : styles.inactiveTabIcon
                        }
                      />
                    </View>
                  )
                )}
                <Text
                  type="bold"
                  style={[
                    index === i
                      ? [
                          styles.activeTabName,
                          {color: primary_color, opacity: 1},
                        ]
                      : styles.inactiveTabName,
                    styles.title,
                  ]}>
                  {this.returnTabName(name)}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
}

const mapPropsToState = state => {
  const {accent_color, primary_color} = state.Theme;
  const {language} = state.Language;
  return {
    accent_color,
    primary_color,
    language,
  };
};

export default connect(mapPropsToState)(CustomTab);
