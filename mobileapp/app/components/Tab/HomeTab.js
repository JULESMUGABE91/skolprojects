import React from 'react';
import styles from './styles';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from '../Text';
import Feather from 'react-native-vector-icons/Feather';
import {DrawerActions} from '@react-navigation/native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';

class HomeTab extends React.Component {
  constructor() {
    super();

    this.setState({
      selected_tab: 0,
    });
  }

  onSelectTab(selected_tab) {
    this.props.onSelectTab(selected_tab);
  }

  render() {
    const {language} = this.props;
    const {
      all_surveys,
      available_surveys,
      progress_surveys,
      completed_surveys,
    } = languages[language];

    const tabs = [
      {
        label: all_surveys,
      },
      {
        label: available_surveys,
      },
      {
        label: progress_surveys,
      },
      {
        label: completed_surveys,
      },
    ];

    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.container}>
          {tabs.map((tab, i) => {
            return (
              <TouchableOpacity key={i} onPress={() => this.onSelectTab(i)}>
                <View
                  style={[
                    styles.tab_item,
                    this.props.activeTab === i && {
                      borderWidth: 2,
                      borderColor: this.props.primary_color,
                    },
                  ]}>
                  <Text
                    smtitle
                    type={this.props.activeTab === i && 'bold'}
                    primary={this.props.activeTab === i}>
                    {tab.label}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {primary_color} = state.Theme;
  return {
    language,
    primary_color,
  };
};

export default connect(mapPropsToState)(HomeTab);
