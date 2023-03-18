import React from 'react';
import {View, ScrollView} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';

import styles from './styles';
import toastMessage from '../../utils/toastMessage';
import validateEmail from '../../utils/validateEmail';
import {languages} from '../../constants/localization';
import {Button} from '../Button';
import {Separator} from '../Separator';
import {Text} from '../Text';
import {Checkbox, Input} from '../Input';
import LocalStorage from '../../utils/storage';
import {ROOT_API} from '../../constants/strings';

class StepOne extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isSubmitting: false,
      error: {},
      email: '',
      age: '',
      gender: '',
      firstname: '',
      lastname: '',
      user: {},
      checked: '',
    };
  }

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user});
  };

  onChangeText(field, v) {
    let {error} = this.state;

    delete error[field];

    this.setState({
      error,
      [field]: v,
    });
  }

  onCheck(e) {
    console.log(e);
    this.setState({gender: e});
  }

  validateForm() {
    let {error, email, age, gender, firstname, lastname} = this.state;

    const {language} = this.props;
    const {
      email_required,
      invalid_email,
      age_required,
      gender_required,
      firstname_is_required,
      lastname_is_required,
    } = languages[language];

    if (email === '') {
      error.email = email_required;
    } else if (!validateEmail(email)) {
      error.email = invalid_email;
    }

    if (gender === '') {
      error.gender = gender_required;
    }

    console.log(age);

    if (age === '') {
      error.age = age_required;
    } else if (Number(age) < 18) {
      error.age = 'Only 18+ allowed to use skol product';
    }

    if (firstname === '') {
      error.firstname = firstname_is_required;
    }

    if (lastname === '') {
      error.firstname = lastname_is_required;
    }

    this.setState({error});
  }

  onSubmit = async () => {
    await this.validateForm();

    const {error, gender, email, age, firstname, lastname, user} = this.state;
    if (Object.keys(error).length === 0) {
      this.setState({
        isSubmitting: true,
      });

      const options = {
        method: 'POST',
        url: `${ROOT_API}/user/update`,
        data: {
          age,
          gender,
          firstname,
          lastname,
          email,
          id: user.user_id,
        },
        headers: {
          authorization: 'Bearer ' + user.token,
        },
      };
      console.log(options);
      axios(options)
        .then(data => {
          this.onSuccess();
        })
        .catch(error => {
          console.log(error.response);

          this.setState({
            isSubmitting: false,
          });

          toastMessage(
            'Something went wrong, check your internet and please try again',
          );
        });
    }
  };

  onSuccess = async () => {
    const {user, age, gender, firstname, lastname, email} = this.state;

    const user_updated = {
      ...user,
      badge: 'adventurer',
      age,
      gender,
      firstname,
      lastname,
    };

    await new LocalStorage().set(user_updated);

    this.setState({
      isSubmitting: false,
      age: '',
      email: '',
      gender: '',
      firtname: '',
      lastname: '',
    });

    this.props.navigation.navigate('StepTwo');
  };

  render() {
    const {language} = this.props;
    const {
      complete_profile,
      age_txt,
      email_txt,
      next,
      gender_txt,
      male,
      female,
      email_address_placeholder,
      lastname_placeholder,
      firstname_placeholder,
      firstname_txt,
      lastname_txt,
    } = languages[language];

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text type="bold" title style={styles.title}>
            {complete_profile + ' '}(1 / 2)
          </Text>
          <View style={styles.progress_container}>
            <View
              style={[
                styles.progress_item,
                styles.progress_item_active,
              ]}></View>
            <View style={styles.progress_item}></View>
          </View>
        </View>
        <ScrollView
          contentContainerStyle={{flexGrow: 1}}
          keyboardShouldPersistTaps="always">
          <View style={styles.form_container}>
            <View style={{flex: 1}}>
              <Input
                label={firstname_txt}
                value={this.state.firstname}
                onChangeText={e => this.onChangeText('firstname', e)}
                error={this.state.error.firstname}
                placeholder={firstname_placeholder}
                required
              />
              <Input
                label={lastname_txt}
                value={this.state.lastname}
                onChangeText={e => this.onChangeText('lastname', e)}
                error={this.state.error.lastname}
                placeholder={lastname_placeholder}
                required
              />
              <Input
                label={email_txt}
                value={this.state.email}
                onChangeText={e => this.onChangeText('email', e)}
                error={this.state.error.email}
                placeholder={email_address_placeholder}
                required
              />
              <Input
                label={age_txt}
                value={this.state.age}
                onChangeText={e => this.onChangeText('age', e)}
                error={this.state.error.age}
                keyboardType="number-pad"
                required
                placeholder="18+"
              />
              <View>
                <Separator title={gender_txt} />
                <View style={{marginBottom: 15}}>
                  <Checkbox
                    label={male}
                    checked={this.state.gender === male}
                    onCheck={() => this.onCheck(male)}
                  />
                </View>
                <View style={{marginBottom: 15}}>
                  <Checkbox
                    label={female}
                    checked={this.state.gender === female}
                    onCheck={() => this.onCheck(female)}
                  />
                </View>
                {this.state.error.gender && (
                  <Text danger>{this.state.error.gender}</Text>
                )}
              </View>
            </View>
            <Button
              text={next}
              style={styles.login_btn}
              onPress={this.onSubmit.bind(this)}
              isSubmitting={this.state.isSubmitting}
            />
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

export default connect(mapPropsToState)(StepOne);
