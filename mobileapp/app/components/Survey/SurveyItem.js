import React from 'react';
import styles from './styles';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '../Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import LocalStorage from '../../utils/storage';
import axios from 'axios';
import {ROOT_API} from '../../constants/strings';
import {getAnsweredQuestions} from '../../utils/survey/handleSurveyStatus';
import toastMessage from '../../utils/toastMessage';
import {ChartCountSurvey} from '../Chart';
import socket from '../../utils/socket';
import {Button} from '../Button';
import moment from 'moment';

class SurveyItem extends React.Component {
  state = {
    user: {},
    isLoading: true,
    answers: [],
    progress_bar_width: 0,
    progress_bar_indicator_width: 0,
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user}, () => {
      this.getData(true);
    });

    socket.on('answer', () => {
      this.getData(true);
    });
  };

  getData(isLoading) {
    this.setState({isLoading, isFetched: false});

    const {user} = this.state;

    const options = {
      method: 'POST',
      url: `${ROOT_API}/answer/fetch`,
      data: {
        survey: this.props._id,
        // user: this.state.user.user_id,
      },
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    axios(options)
      .then(data => {
        this.setState({
          isLoading: false,
          answers: data.data,
          isFetched: true,
        });
      })
      .catch(error => {
        toastMessage(error);

        this.setState({isLoading: false, isFetched: false});
      });
  }

  answeredQuestions = () => {
    const answered_questions = getAnsweredQuestions(
      this.props.questions || [],
      this.state.answers,
    );

    return answered_questions;
  };

  findProgressBarWidth(layout) {
    this.setState({
      progress_bar_indicator_width: layout.width / this.state.answers.length,
    });
  }

  render() {
    const props = this.props;

    let survey_status = this.state.answers.length > 0 ? 'completed' : 'pending';

    return (
      <>
        <>
          <View style={styles.container}>
            <View style={styles.icon_left_container}>
              {props.showStatus && (
                <MaterialCommunityIcons
                  name={
                    survey_status === 'completed'
                      ? 'check-circle-outline'
                      : survey_status === 'inprogress'
                      ? 'bell-circle'
                      : 'alarm-check'
                  }
                  style={[styles.icon_left_icon, {color: props.primary_color}]}
                />
              )}
            </View>
            <View style={styles.content}>
              <View style={styles.header}>
                <View style={{flexDirection: 'row', alignContent: 'center'}}>
                  <Text type="bold" sbtitle numberOfLines={2}>
                    {props.title}
                  </Text>
                  {props.showStatus && (
                    <View
                      style={[
                        styles.status_container,
                        this.state.isFetched &&
                          survey_status === 'pending' && {
                            backgroundColor: props.primary_color,
                            borderRadius: 4,
                          },
                      ]}>
                      {this.state.isFetched && survey_status === 'pending' && (
                        <Text type="bold" style={styles.status_text}>
                          NEW
                        </Text>
                      )}
                    </View>
                  )}
                </View>
                {props.description !== '' && props.description && (
                  <View style={{marginTop: 5}}>
                    <Text style={styles.description}>{props.description}</Text>
                  </View>
                )}
              </View>

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {props.questions && (
                  <View style={{flex: 1}}>
                    <Text style={styles.description}>
                      {props.questions.length} Question(s)
                    </Text>
                  </View>
                )}
                {props.showDate && (
                  <View style={{flex: 1}}>
                    <Text textDisabled smtitle style={{marginTop: 8}}>
                      {moment(props.updatedAt).format('lll')}
                    </Text>
                  </View>
                )}
                {props.showStartBtn && (
                  <Button
                    text="Take Survey"
                    type="sm"
                    onPress={props.onPressItem}
                  />
                )}
                {props.showResult && (
                  <Button
                    text="Show Result"
                    type="sm"
                    onPress={props.onPressItem}
                  />
                )}
              </View>
            </View>
            {/* <View style={styles.right_icon_container}>
              <MaterialCommunityIcons
                name="chevron-right"
                style={styles.right_icon_icon}
              />
            </View> */}
          </View>
        </>
        {/* {(this.state?.user?.account_type === 'super_admin' ||
          this.state?.user?.account_type === 'skol_admin') && (
          <ChartCountSurvey
            onPressCountCard={this.props.onPressCountCard}
            survey_id={this.props._id}
          />
        )} */}
      </>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {surveys} = state.Survey;
  const {accent_color, primary_color} = state.Theme;
  return {
    language,
    accent_color,
    primary_color,
    surveys,
  };
};

export default connect(mapPropsToState)(SurveyItem);
