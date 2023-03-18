import React from 'react';
import {View, ScrollView, Image} from 'react-native';
import {connect} from 'react-redux';
import axios from 'axios';

import styles from './styles';
import {languages} from '../../constants/localization';
import {Button} from '../Button';
import {Text} from '../Text';
import {Input} from '../Input';
import {Back} from '../Back';
import {ROOT_API} from '../../constants/strings';
import toastMessage from '../../utils/toastMessage';
import LocalStorage from '../../utils/storage';
class OTPVerify extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      otp_code: '',
      isSubmitting: false,
      error: {},
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

  validateForm() {
    let {error, otp_code} = this.state;
    const {language} = this.props;

    const {otp_required, invalid_otp} = languages[language];

    if (otp_code === '') {
      error.otp_code = otp_required;
    } else if (otp_code.length < 5) {
      error.otp_code = invalid_otp;
    }

    this.setState({error});
  }

  onSubmit = async () => {
    await this.validateResendForm();

    const {error, otp_code} = this.state;
    const {params} = this.props;
    const {phone, token} = params;

    if (Object.keys(error).length === 0) {
      this.setState({
        isSubmitting: true,
      });

      const options = {
        method: 'POST',
        url: `${ROOT_API}/user/otp-verify`,
        data: {
          otp_code,
          isPhoneVerified: true,
        },
        headers: {
          authorization: 'Bearer ' + token,
        },
      };
      axios(options)
        .then(data => {
          this.onSuccess();
        })
        .catch(error => {
          const {language} = this.props;
          const {wrong_otp_code} = languages[language];

          this.setState({
            isSubmitting: false,
          });

          toastMessage(wrong_otp_code);
        });
    }
  };

  onSuccess = async () => {
    const {params} = this.props;
    const {badge} = params;

    await new LocalStorage().set(params);

    if (badge === 'Explorer' || badge === 'Explorer')
      return this.props.navigation.navigate('StepOne');
    if (badge === 'Adventurer')
      return this.props.navigation.navigate('StepTwo');

    this.props.navigation.navigate('Home');
  };

  validateResendForm() {
    const {error} = this.state;
    const {params, language} = this.props;
    const {phone} = params;

    const {missing_phone} = languages[language];

    if (phone === '') {
      error.otp_code = missing_phone;
    }

    this.setState({error});
  }

  onResendOTP = async () => {
    try {
      const {error} = this.state;
      const {params, language} = this.props;
      const {phone} = params;

      const {sent_otp_success} = languages[language];

      this.setState({isResending: true});

      await this.validateResendForm();

      await this.requestOTP({error, phone});

      this.setState({isResending: false});

      toastMessage(sent_otp_success + ' ' + phone);
    } catch (error) {
      toastMessage(error);

      this.setState({isResending: false, isSubmitting: false});
    }
  };

  requestOTP = async ({error, phone}) => {
    console.log(error, phone);
    if (Object.keys(error).length === 0) {
      const formatted_phone = this.formattedPhone(phone);

      const options = {
        method: 'POST',
        url: `${ROOT_API}/user/phone-auth`,
        data: {
          phone: formatted_phone,
        },
      };
      return await axios(options);
    }
  };

  formattedPhone = phone => {
    let formatted = phone;

    formatted = phone.replace('+', '');

    return formatted;
  };

  render() {
    const {language, params} = this.props;
    const {enter_otp_code, otp_code, sent_otp, submit, resend_otp} =
      languages[language];

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
              {enter_otp_code}
            </Text>
            <Text style={styles.description}>
              {sent_otp + ' ' + params.phone}
            </Text>
            <View>
              <Input
                placeholder={otp_code}
                value={this.state.otp_code}
                onChangeText={e => this.onChangeText('otp_code', e)}
                error={this.state.error.otp_code}
                maxLength={6}
                keyboardType="number-pad"
                autoFocus={true}
                rightText={resend_otp}
                onPressRight={this.onResendOTP.bind(this)}
                isResending={this.state.isResending}
              />
              <Button
                text={submit}
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

export default connect(mapPropsToState)(OTPVerify);
