import React from 'react';
import {View, ScrollView, Image} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';

import styles from './styles';
import toastMessage from '../../utils/toastMessage';
import validatePhone from '../../utils/validatePhone';
import {languages} from '../../constants/localization';
import {Button} from '../Button';
import {Text} from '../Text';
import {Input} from '../Input';
import {Back} from '../Back';
import countries from '../../constants/countries';
import {APP_ID, ROOT_API} from '../../constants/strings';
class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      phone: '',
      isSubmitting: false,
      error: {},
      selected_country: countries[0],
    };
  }

  onChangeText(field, v) {
    let {error} = this.state;

    delete error[field];

    this.setState({
      error,
      [field]: v,
    });
  }

  formattedPhone(phone) {
    let formatted = phone;

    formatted = phone.replace('+', '');

    return formatted;
  }

  validateForm() {
    let {error, phone, selected_country} = this.state;

    const {language} = this.props;
    const {phone_required, invalid_phone} = languages[language];

    if (phone === '') {
      error.phone = phone_required;
    } else if (
      !validatePhone(this.formattedPhone(selected_country.value + '' + phone))
    ) {
      error.phone = invalid_phone;
    }

    this.setState({error});
  }

  onSubmit = async () => {
    await this.validateForm();
    const {error, phone, selected_country} = this.state;

    if (Object.keys(error).length === 0) {
      this.setState({
        isSubmitting: true,
      });

      const formatted_phone = this.formattedPhone(
        selected_country.value + '' + phone,
      );

      const options = {
        method: 'POST',
        url: `${ROOT_API}/otp/send`,
        data: {
          phone: formatted_phone,
        },
      };
      axios(options)
        .then(data => {
          this.props.navigation.navigate('OTPCode', {
            phone: formatted_phone,
          });

          this.setState({
            isSubmitting: false,
            phone: '',
          });
        })
        .catch(error => {
          const {language} = this.props;
          const {phone_auth_failed} = languages[language];

          this.setState({
            isSubmitting: false,
          });

          toastMessage(phone_auth_failed);
        });
    }
  };

  render() {
    const {language} = this.props;
    const {
      enter_phone_number_title,
      phone_number,
      enter_phone_number_description,
      next,
    } = languages[language];

    return (
      <ScrollView
        contentContainerStyle={{flexGrow: 1}}
        keyboardShouldPersistTaps="always">
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
          <View style={styles.form_container}>
            <Text type="bold" title style={styles.title}>
              {enter_phone_number_title}
            </Text>
            <Text style={styles.description}>
              {enter_phone_number_description}
            </Text>
            <View>
              <Input
                placeholder={phone_number}
                value={this.state.phone}
                onChangeText={e => this.onChangeText('phone', e)}
                error={this.state.error.phone}
                showCountryCode
                country={this.state.selected_country}
                keyboardType="phone-pad"
              />
              <Button
                text={next}
                style={styles.login_btn}
                onPress={this.onSubmit.bind(this)}
                isSubmitting={this.state.isSubmitting}
              />
            </View>
          </View>
          <View style={styles.footer}></View>
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

export default connect(mapPropsToState)(Login);
