import React from 'react';
import styles from '../styles';
import {View} from 'react-native';
import {Text} from '../../Text';
import {connect} from 'react-redux';
import {languages} from '../../../constants/localization';
import axios from 'axios';
import {ROOT_API} from '../../../constants/strings';
import LocalStorage from '../../../utils/storage';
import toastMessage from '../../../utils/toastMessage';

class Answers extends React.Component {
  state = {
    isLoading: true,
    total_answers: '...',
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user}, () => {
      this.getData(true);
    });
  };

  getData(isLoading) {
    this.setState({isLoading});

    const {user} = this.state;

    const options = {
      method: 'POST',
      url: `${ROOT_API}/answer/fetch`,
      data: {
        survey: this.props.survey_id,
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
          total_answers: data.data.length,
        });
      })
      .catch(error => {
        toastMessage(error);

        this.setState({isLoading: false});
      });
  }

  render() {
    const {language} = this.props;
    const {} = languages[language];

    return (
      <View
        style={[
          styles.card_count,
          {backgroundColor: this.props.primary_color},
        ]}>
        <Text
          type="bold"
          style={[styles.card_count_total, {color: this.props.accent_color}]}>
          {this.state.total_answers}
        </Text>
        <Text
          style={[styles.card_count_title, {color: this.props.accent_color}]}>
          Responses
        </Text>
      </View>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {primary_color, accent_color} = state.Theme;
  return {
    language,
    primary_color,
    accent_color,
  };
};

export default connect(mapPropsToState)(Answers);
