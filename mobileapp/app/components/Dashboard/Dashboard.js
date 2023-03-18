import React from 'react';
import styles from './styles';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from '../Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import LocalStorage from '../../utils/storage';
import AnswersPerDayChart from '../Chart/queries/AnswersPerDayChart';
import AnswersPie from '../Chart/queries/AnswersPie';
import {APP_ID} from '../../constants/strings';

class Dashboard extends React.Component {
  state = {
    answers: [],
    answerFilters: {},
    isInit: true,
  };

  componentDidMount = async () => {
    let user = await new LocalStorage().get();

    const {survey_id} = this.props.params;

    let answerFilters = {};

    if (survey_id) {
      answerFilters.survey = survey_id;
    }

    if (!user.account_type) {
      answerFilters.user = user.user_id;
    }

    this.setState({
      answerFilters: {
        ...answerFilters,
        organization: APP_ID,
      },
      isInit: false,
    });
  };

  render() {
    return (
      <View style={styles.container}>
        {/* <View style={styles.filters_container}>
          <View style={styles.title_bx}>
            <MaterialCommunityIcons
              name="view-dashboard"
              style={styles.title_b_iconx}
            />
          </View>
          <Text numberOfLines={2} style={{flex: 1}} type="bold" primary>
            {this.props.params.survey_title}
          </Text>
        </View> */}
        {!this.state.isInit && (
          <ScrollView contentContainerStyle={{flexGrow: 1, paddingBottom: 150}}>
            <View style={styles.content}>
              <AnswersPerDayChart filters={this.state.answerFilters} />
              {/* <AnswersPie filters={this.state.answerFilters} /> */}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {accent_color, primary_color} = state.Theme;
  return {
    language,
    accent_color,
    primary_color,
  };
};

export default connect(mapPropsToState)(Dashboard);
