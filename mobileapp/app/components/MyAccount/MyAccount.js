import React from 'react';
import styles from './styles';
import {View, ScrollView, Platform, StyleSheet, Dimensions} from 'react-native';
import {Text} from '../Text';
import {languages} from '../../constants/localization';
import {Back} from '../Back';
import {connect} from 'react-redux';
import {Input} from '../Input';
import {Button} from '../Button';
import LocalStorage from '../../utils/storage';
import {ROOT_API} from '../../constants/strings';
import axios from 'axios';
import Modal from 'react-native-modalbox';
import {LoginModal} from '../Login';
import EStyleSheet from 'react-native-extended-stylesheet';
import validateEmail from '../../utils/validateEmail';
import toastMessage from '../../utils/toastMessage';
const {height} = Dimensions.get('screen');

class MyAccount extends React.Component {
  state = {
    email: '',
    firstname: '',
    lastname: '',
    error: {},
    isSubmitting: false,
    user: {},
    phone: '',
  };

  componentDidMount = async () => {
    this.initiateProfile();

    // this.focusListener = this.props.navigation.addListener(
    //   'focus',
    //   async () => {
    //     this.initiateProfile();
    //   },
    // );
  };

  initiateProfile = async () => {
    const user = await new LocalStorage().get();

    this.setState({
      ...user,
      user,
    });

    if (!user.token) {
      this.refs.loginmodal.open();
    }
  };

  onChangeText(field, v) {
    let {error} = this.state;

    delete error[field];

    this.setState({
      [field]: v,
      error,
    });
  }

  validateUserForm() {
    let {error, email, firstname, lastname, phone} = this.state;

    const {language} = this.props;
    const {
      firstname_is_required,
      lastname_is_required,
      invalid_email,
      phone_is_required,
    } = languages[language];

    if (email !== '' && !validateEmail(email)) {
      error.email = invalid_email;
    }

    if (firstname === '') {
      error.firstname = firstname_is_required;
    }

    if (lastname === '') {
      error.lastname = lastname_is_required;
    }

    if (phone === '') {
      error.phone = phone_is_required;
    }

    this.setState({error});
  }

  goBack() {
    this.props.navigation.goBack();
  }

  onUpdate = async () => {
    await this.validateUserForm();

    const {error, email, firstname, lastname, token, user} = this.state;

    const {language} = this.props;
    const {user_update_success, user_update_failed} = languages[language];

    if (Object.keys(error).length === 0) {
      this.setState({isSubmitting: true});

      const options = {
        method: 'POST',
        url: `${ROOT_API}/user/update`,
        data: {
          firstname,
          lastname,
          email,
          id: user.user_id,
        },
        headers: {
          authorization: `Bearer ${token}`,
        },
      };

      axios(options)
        .then(async data => {
          this.setState({isSubmitting: false});

          this.initiateProfile();

          await new LocalStorage().set({
            token,
            ...user,
            phone: data.data.phone,
            email: data.data.email,
            name: data.data.name,
          });

          toastMessage(user_update_success);

          this.props.navigation.navigate('Splash');
        })
        .catch(error => {
          this.setState({isSubmitting: false});

          toastMessage(user_update_failed);
        });
    }
  };

  onSelect(type, item) {
    let {error} = this.state;

    delete error[type];
    this.setState({[type]: item, error});
  }

  render() {
    const {language} = this.props;
    const {
      my_account_text,
      firstname_txt,
      lastname_txt,
      email_address,
      update_profile,
      phone_txt,
    } = languages[language];

    let dv_h = Platform.OS === 'ios' ? 3 : 4;
    const bgColor = EStyleSheet.value('$bgColorLight');

    const modal_radius = {
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
    };

    const modal_styles = StyleSheet.create({
      loginmodal: {
        height: height / dv_h,
        ...modal_radius,
        backgroundColor: bgColor,
      },
    });

    return (
      <>
        <View style={styles.container}>
          <View style={styles.header}>
            <Back goBack={this.goBack.bind(this)} />
            <Text type="bold" title>
              {my_account_text}
            </Text>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.content}>
              <Input
                placeholder={firstname_txt}
                leftIcon="user"
                value={this.state.firstname}
                onChangeText={e => this.onChangeText('firstname', e)}
                error={this.state.error.firstname}
              />
              <Input
                placeholder={lastname_txt}
                leftIcon="user"
                value={this.state.lastname}
                onChangeText={e => this.onChangeText('lastname', e)}
                error={this.state.error.lastname}
              />
              <Input
                placeholder={email_address}
                leftIcon="mail"
                value={this.state.email}
                onChangeText={e => this.onChangeText('email', e)}
                error={this.state.error.email}
              />
              <Input
                placeholder={phone_txt}
                leftIcon="phone"
                value={this.state.phone + ''}
                onChangeText={e => this.onChangeText('phone', e)}
                error={this.state.error.phone}
                keyboardType="phone-pad"
                editable={false}
              />
              <Input
                placeholder={'Province'}
                leftIcon="chevron-right"
                value={this.state.province}
                onChangeText={e => this.onChangeText('province', e)}
                error={this.state.error.province}
                clickable
                onInputPressed={() =>
                  this.props.navigation.navigate('Rwanda', {
                    type: 'province',
                    onSelect: this.onSelect.bind(this),
                  })
                }
              />
              <Input
                placeholder={'District'}
                leftIcon="chevron-right"
                value={this.state.district}
                onChangeText={e => this.onChangeText('district', e)}
                error={this.state.error.district}
                clickable
                onInputPressed={() =>
                  this.props.navigation.navigate('Rwanda', {
                    type: 'district',
                    province: this.state.province,
                    onSelect: this.onSelect.bind(this),
                  })
                }
              />
              <Input
                placeholder={'Sector'}
                leftIcon="chevron-right"
                value={this.state.sector}
                onChangeText={e => this.onChangeText('sector', e)}
                error={this.state.error.sector}
                clickable
                onInputPressed={() =>
                  this.props.navigation.navigate('Rwanda', {
                    type: 'sector',
                    province: this.state.province,
                    district: this.state.district,
                    onSelect: this.onSelect.bind(this),
                  })
                }
              />
              <Input
                placeholder={'Village'}
                leftIcon="chevron-right"
                value={this.state.village}
                onChangeText={e => this.onChangeText('village', e)}
                error={this.state.error.village}
                clickable
                onInputPressed={() =>
                  this.props.navigation.navigate('Rwanda', {
                    type: 'cell',
                    province: this.state.province,
                    district: this.state.district,
                    sector: this.state.sector,
                    onSelect: this.onSelect.bind(this),
                  })
                }
              />
              <View
                style={{
                  flexDirection: 'row',
                  marginTop: 15,
                  alignItems: 'center',
                }}></View>
              <View style={{height: 10}} />
              <View style={{height: 20}} />
              <Button
                text={update_profile}
                onPress={this.onUpdate.bind(this)}
                isSubmitting={this.state.isSubmitting}
              />
            </View>
          </ScrollView>
        </View>
        <Modal
          style={modal_styles.loginmodal}
          ref="loginmodal"
          position={'bottom'}
          backdropPressToClose={false}
          swipeToClose={false}
          backdropOpacity={0.8}
          backButtonClose={false}>
          <LoginModal
            navigation={this.props.navigation}
            screen="MyAccount"
            params={this.props.params}
            handleCloseModal={() => this.handleCloseModal('loginmodal')}
          />
        </Modal>
      </>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  return {
    language,
  };
};

export default connect(mapPropsToState)(MyAccount);
