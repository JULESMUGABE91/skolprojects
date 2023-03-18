import React from 'react';
import styles from './styles';
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  ActivityIndicator,
} from 'react-native';
import {Text} from '../Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import LocalStorage from '../../utils/storage';
import axios from 'axios';
import {ACCESS, APP_ID, ROOT_API} from '../../constants/strings';
import {Navbar} from '../Navbar';
import {Input} from '../Input';
import toastMessage from '../../utils/toastMessage';

class AccountInfo extends React.Component {
  state = {
    user: {},
    isSubmitting: true,
    account_type: '',
    active_active: 0,
  };

  UNSAFE_componentWillMount = async () => {
    const user = await new LocalStorage().get();

    const {account_type} = this.props.params;

    this.setState({user, account_type});
  };

  onChangeTab(active_active) {
    this.setState({active_active});
  }

  onChangeAccountType(e) {
    this.setState({account_type: e.value}, () => {
      this.updateProfile();
    });
  }

  renderAccountInfo() {
    const {name, firstname, lastname, email, phone, account_type, badge} =
      this.props.params;
    return (
      <View style={styles.form_container}>
        <Input
          label="Firstname"
          placeholder="Firstname"
          value={name ? name : firstname ? firstname : ''}
          editable={false}
        />
        <Input
          label="Lastname"
          placeholder="Lastname"
          value={lastname}
          editable={false}
        />
        <Input
          label="Email Address"
          placeholder="Email"
          value={email}
          editable={false}
        />
        <Input
          label="Phone Number"
          placeholder="Phone Number"
          value={phone}
          editable={false}
        />

        <Input
          label="Badge"
          placeholder="Badge"
          value={badge}
          editable={false}
        />
        <Input
          label="Account Type"
          placeholder="Account Type"
          value={account_type}
          editable={false}
        />
      </View>
    );
  }

  updateProfile = async () => {
    const {user, account_type} = this.state;
    const {_id} = this.props.params;
    this.setState({['isSubmitting' + account_type]: true});

    const options = {
      method: 'POST',
      url: `${ROOT_API}/user/update`,
      data: {
        id: _id,
        account_type,
      },
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    return await axios(options)
      .then(async data => {
        this.setState({['isSubmitting' + account_type]: false});

        if (user._id === _id) {
          user.account_type = account_type;

          await new LocalStorage().set(user);

          this.props.navigation.navigate('Splash');
        }

        this.props.navigation.goBack();

        toastMessage('Updated!');
      })
      .catch(error => {
        this.setState({['isSubmitting' + account_type]: false});

        toastMessage('Something is wrong, please try again');
      });
  };

  renderPermission() {
    const {user} = this.state;
    return (
      <View style={styles.access_container}>
        {ACCESS.map((item, i) => {
          if (item.permission.includes(user.account_type)) {
            return (
              <TouchableOpacity
                key={i}
                onPress={() => this.onChangeAccountType(item)}>
                <View style={styles.access_item}>
                  <Text style={{flex: 1}} type="bold">
                    {item.label}
                  </Text>
                  {this.state['isSubmitting' + this.state.account_type] ===
                  'isSubmitting' + item.value ? (
                    <View>
                      <ActivityIndicator color={this.props.primary_color} />
                    </View>
                  ) : (
                    <View
                      style={[
                        styles.check_bx,
                        this.state.account_type === item.value &&
                          styles.checked_bx,
                      ]}>
                      <MaterialCommunityIcons
                        name="check"
                        style={[
                          styles.check_icon,
                          this.state.account_type === item.value &&
                            styles.checked_icon,
                        ]}
                      />
                    </View>
                  )}
                </View>
              </TouchableOpacity>
            );
          }
        })}
      </View>
    );
  }

  render() {
    const tabs = ['Account Info', 'Permissions'];
    return (
      <>
        <View style={styles.container}>
          <Navbar
            handleAddPress={() => this.props.navigation.navigate('NewProvider')}
            title="Account"
            back
            navigation={this.props.navigation}
          />
          <View style={styles.tabs}>
            {tabs.map((tab, i) => {
              return (
                <TouchableOpacity
                  onPress={() => this.onChangeTab(i)}
                  key={i}
                  style={[
                    styles.tab_item,
                    this.state.active_active === i && styles.tab_item_active,
                  ]}>
                  <View>
                    <Text type="bold">{tab}</Text>
                  </View>
                  {this.state.active_active === i && (
                    <View style={styles.border_bottom} />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {this.state.active_active === 0 && this.renderAccountInfo()}
          {this.state.active_active === 1 &&
            (this.state.user.account_type === 'super_admin' ||
              this.state.user.account_type === 'admin') &&
            this.renderPermission()}
        </View>
      </>
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

export default connect(mapPropsToState)(AccountInfo);
