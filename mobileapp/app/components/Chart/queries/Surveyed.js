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

class Surveyed extends React.Component {
  state = {
    isLoading: true,
    total_surveyed: '...',
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
        let survey_id_ids = [];

        for (let answer of data.data) {
          if (!survey_id_ids.includes(answer.survey)) {
            survey_id_ids.push(answer.survey);
          }
        }

        this.setState({
          isLoading: false,
          total_surveyed: survey_id_ids.length,
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
        style={[styles.card_count, {backgroundColor: this.props.accent_color}]}>
        <Text
          type="bold"
          style={[styles.card_count_total, {color: this.props.primary_color}]}>
          {this.state.total_surveyed}
        </Text>
        <Text
          style={[styles.card_count_title, {color: this.props.primary_color}]}>
          Surveyed
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
    accent_color,
    primary_color,
  };
};

export default connect(mapPropsToState)(Surveyed);
