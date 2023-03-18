import React from 'react';
import {View, ScrollView, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Text} from '../Text';
import styles from './styles';
import Close from '../Close/Close';
import {ListItem} from '../List';
import {onSwitchLanguage} from '../../actions/Language';

class CLanguage extends React.Component {
  goBack() {
    this.props.navigation.goBack();
  }

  setDefaultLanguage(language) {
    this.props.dispatch(onSwitchLanguage(language));
  }

  render() {
    const {language} = this.props;
    const {change_language} = languages[language];

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text type="bold" sbtitle style={styles.title}>
            {change_language}
          </Text>
          <Close handleCloseModal={this.props.handleCloseModal} />
        </View>
        <ScrollView>
          <View style={{flex: 1}}>
            {Object.keys(languages).map((item, i) => {
              return (
                <ListItem
                  title={item.toUpperCase()}
                  key={i}
                  checked={this.props.language === item}
                  checkbox
                  onPress={() => this.setDefaultLanguage(item)}
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  }
}
const mapPropsToState = state => {
  const {language} = state.Language;
  return {
    language,
  };
};

export default connect(mapPropsToState)(CLanguage);
