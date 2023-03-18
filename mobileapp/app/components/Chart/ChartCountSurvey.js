import React from 'react';
import styles from './styles';
import {View, TouchableOpacity} from 'react-native';
import {Text} from '../Text';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Button} from '../Button';
import Surveyed from './queries/Surveyed';
import Answers from './queries/Answers';

class ChartSurvey extends React.Component {
  render() {
    const {language} = this.props;
    const {} = languages[language];

    return (
      <View style={styles.chart_survey_container}>
        <View style={styles.count_container}>
          <TouchableOpacity onPress={this.props.onPressCountCard}>
            <View style={{marginRight: 10}}>
              <Surveyed {...this.props} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={this.props.onPressCountCard}>
            <View style={{marginLeft: 10}}>
              <Answers {...this.props} />
            </View>
          </TouchableOpacity>
        </View>
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

export default connect(mapPropsToState)(ChartSurvey);
