import React from 'react';
import {View} from 'react-native';
import {Text} from '../../Text';
import {Button} from '../../Button';
import styles from '../styles';
import LocalStorage from '../../../utils/storage';
import {APP_ID, ROOT_API} from '../../../constants/strings';
import axios from 'axios';
import toastMessage from '../../../utils/toastMessage';
import remainingQuestion from '../utils/remainingQuestion';
import {connect} from 'react-redux';
import formattedSurvey from '../utils/formattedSurvey';

class ConfirmIncomplete extends React.Component {
  state = {
    isSubmitting: false,
    user: {},
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user});
  };

  onSubmit = async () => {
    try {
      this.setState({isSubmitting: true});

      let {
        current_question_index,
        survey,
        user,
        identifier,
        questions,
        start_interview,
        my_location,
      } = this.props;

      const q = remainingQuestion({current_question_index, questions});

      let last_question = q[current_question_index]?._id || undefined;

      const completed_format = formattedSurvey({
        questions: q,
        survey,
        start_interview,
        my_location,
      });

      let request_body = [];

      for (let formatted of completed_format) {
        request_body.push({
          ...formatted,
          survey: survey._id,
          organization: APP_ID,
          status: 'incomplete',
          last_question: last_question,
        });
      }

      const options = {
        method: 'POST',
        url: `${ROOT_API}/answer/add/bulk`,
        data: {
          questions: request_body,
          organization: APP_ID,
          identifier,
          survey: survey._id,
        },
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      await axios(options);

      this.setState({
        isSubmitting: false,
      });

      this.props.navigation.goBack();

      toastMessage('Cancelled successful');
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      this.setState({isSubmitting: false});
      toastMessage(
        'To cancel this survey has been failed, please your internet and try again',
      );
    }
  };

  render() {
    return (
      <View style={styles.confirm_container}>
        <View style={styles.confirm_header}>
          <Text type="bold">Cancel a survey</Text>
        </View>
        <View style={styles.confirm_content}>
          <Text>
            Are you sure, your survey will be recorded as incomplete, Do you
            want to cancel this survey
          </Text>
          <View style={styles.confirm_btns}>
            <View style={{flex: 1, marginRight: 15}}>
              <Button
                text="NO"
                type="bordered"
                primaryText
                onPress={this.props.handleCloseModal}
              />
            </View>
            <View style={{flex: 1}}>
              <Button
                text="YES"
                onPress={this.onSubmit.bind(this)}
                isSubmitting={this.state.isSubmitting}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {accent_color, primary_color} = state.Theme;
  const {my_location} = state.MyLocation;
  return {
    language,
    accent_color,
    primary_color,
    my_location,
  };
};

export default connect(mapPropsToState)(ConfirmIncomplete);
