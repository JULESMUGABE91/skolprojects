import React from 'react';
import {View, ScrollView, Image} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';

import styles from './styles';
import {languages} from '../../constants/localization';
import {Button} from '../Button';
import {Text} from '../Text';
import {Checkbox, Input} from '../Input';
import {Back} from '../Back';
import {APP_ID, ROOT_API} from '../../constants/strings';
import toastMessage from '../../utils/toastMessage';
import LocalStorage from '../../utils/storage';

class SurveyForm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      survey_title: '',
      survey_description: '',
      isSubmitting: false,
      error: {},
      point: '',
      status: 'Public',
      introduction: '',
    };
  }

  UNSAFE_componentWillMount() {
    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.updateStateParams();
      },
    );
  }

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user});

    this.updateStateParams();

    this.focusListener = this.props.navigation.addListener(
      'didFocus',
      async () => {
        this.updateStateParams();
      },
    );
  };

  updateStateParams() {
    const {params} = this.props;
    if (params?.survey?._id) {
      this.setState({
        survey_title: params?.survey?.title,
        survey_description: params.survey.description,
        survey_id: params?.survey?._id,
        point: params?.survey?.point + '',
        introduction: params?.survey?.introduction,
        status: params?.survey?.status || 'Public',
      });
    }
  }

  onChangeText(field, v) {
    let {error} = this.state;

    delete error[field];

    this.setState({
      error,
      [field]: v,
    });
  }

  onCheck(e) {
    this.setState({status: e});
  }

  validateForm() {
    let {error, survey_title} = this.state;

    const {language} = this.props;
    const {survey_title_required} = languages[language];

    if (survey_title === '') {
      error.survey_title = survey_title_required;
    }

    this.setState({error});
  }

  onSubmit = async () => {
    await this.validateForm();

    const {
      error,
      user,
      survey_title,
      survey_description,
      survey_id,
      point = 0,
      status,
      introduction,
    } = this.state;

    if (Object.keys(error).length === 0) {
      const {language} = this.props;
      const {survey_added_failed} = languages[language];

      this.setState({
        isSubmitting: true,
      });

      let route = '/add',
        body = {
          title: survey_title,
          description: survey_description,
          point,
          status,
          organization: APP_ID,
          available: true,
          introduction,
        };

      if (survey_id && survey_id !== '') {
        route = '/update';

        body.id = survey_id;
      }

      const options = {
        method: 'POST',
        url: `${ROOT_API}/survey${route}`,
        data: body,
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      axios(options)
        .then(data => {
          this.setState({
            isSubmitting: false,
            survey_description: '',
            survey_title: '',
          });

          this.props.navigation.navigate('QuestionForm', {
            survey_id: data.data._id,
            point: data.data.point || 0,
            questions: this.props?.params?.questions || undefined,
          });
        })
        .catch(error => {
          console.log(error);
          this.setState({isSubmitting: false});

          toastMessage(survey_added_failed);
        });
    }
  };

  render() {
    const {language} = this.props;
    const {
      new_survey,
      survey_title_placeholder,
      field_with_star_required,
      survey_description_placeholder,
      survey_description_label,
      next,
      survey_title_label,
      total_points,
      survey_introduction_label,
      survey_introduction_placeholder,
      introduction_explain,
    } = languages[language];

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Back
            colorIcon={this.props.primary_color}
            goBack={() => this.props.navigation.goBack()}
          />
          <View style={{flex: 1, alignItems: 'center', marginRight: 40}}>
            <Image
              source={require('../../assets/logo.png')}
              style={styles.logo}
            />
          </View>
        </View>

        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="always">
          <View style={styles.form_container}>
            <View style={styles.form_header}>
              <Text type="bold" title style={styles.title}>
                {new_survey}
              </Text>
              <Text style={styles.description}>{field_with_star_required}</Text>
            </View>
            <View style={styles.form_content}>
              <Input
                placeholder={survey_title_placeholder}
                label={survey_title_label}
                value={this.state.survey_title}
                onChangeText={e => this.onChangeText('survey_title', e)}
                error={this.state.error.survey_title}
                multiline
                required
              />
              <Input
                placeholder={survey_description_placeholder}
                label={survey_description_label}
                value={this.state.survey_description}
                onChangeText={e => this.onChangeText('survey_description', e)}
                error={this.state.error.survey_description}
                multiline
              />
              <Input
                placeholder={'0'}
                label={total_points}
                value={this.state.point}
                onChangeText={e => this.onChangeText('point', e)}
                error={this.state.error.point}
                keyboardType="number-pad"
              />
              <View>
                <View style={{marginTop: 15}}>
                  <Checkbox
                    checked={this.state.status === 'Public'}
                    label="Public"
                    onCheck={() => this.onCheck('Public')}
                  />
                </View>
                <View style={{marginTop: 25, marginBottom: 15}}>
                  <Checkbox
                    checked={this.state.status === 'Private'}
                    label="Private"
                    onCheck={() => this.onCheck('Private')}
                  />
                </View>

                {this.state.status === 'Private' && (
                  <Input
                    placeholder={survey_introduction_placeholder}
                    label={survey_introduction_label}
                    value={this.state.introduction}
                    onChangeText={e => this.onChangeText('introduction', e)}
                    error={this.state.error.introduction}
                    multiline
                    helpText={introduction_explain}
                  />
                )}
              </View>

              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1, marginRight: 15}}>
                  <Button
                    text={next}
                    style={styles.login_btn}
                    onPress={this.onSubmit.bind(this)}
                    isSubmitting={this.state.isSubmitting}
                  />
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
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

export default connect(mapPropsToState)(SurveyForm);
