import axios from 'axios';
import React from 'react';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {ROOT_API} from '../../constants/strings';
import toastMessage from '../../utils/toastMessage';
import {Button} from '../Button';
import {Input} from '../Input';
import {ScrollView, View} from 'react-native';
import {Back} from '../Back';
import {Text} from '../Text';
import styles from './styles';
import LocalStorage from '../../utils/storage';

class StepTwo extends React.Component {
  state = {
    isSubmitting: false,
    error: {},
    user: {},
    sector: '',
    province: '',
    district: '',
    cell: '',
    village: '',
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user});
  };

  onChangeText(name, e) {
    let {error} = this.state;

    delete error[name];

    this.setState({
      [name]: e,
      error,
    });
  }

  validateForm() {
    let {error, village, sector, cell, location, district, province} =
      this.state;

    const {language} = this.props;
    const {
      province_required,
      district_required,
      sector_required,
      cell_required,
      village_required,
    } = languages[language];

    if (province === '') {
      error.province = province_required;
    }

    if (district === '') {
      error.district = district_required;
    }

    if (sector === '') {
      error.sector = sector_required;
    }

    if (cell === '') {
      error.cell = cell_required;
    }

    if (village === '') {
      error.village = village_required;
    }

    this.setState({
      error,
    });
  }

  onSubmit = async () => {
    await this.validateForm();

    let {error, province, district, sector, cell, user, village} = this.state;

    console.log(error);

    if (Object.keys(error).length === 0) {
      this.setState({isSubmitting: true});

      const options = {
        method: 'POST',
        url: `${ROOT_API}/user/update`,
        data: {
          province,
          district,
          sector,
          cell,
          village,
          badge: 'family',
          id: user.user_id,
        },
        headers: {
          authorization: `Bearer ${user.token}`,
        },
      };

      axios(options)
        .then(data => {
          this.onSuccess();
        })
        .catch(error => {
          this.setState({isSubmitting: false});

          toastMessage(
            'Something went wrong, please check your internet and try again',
          );
        });
    }
  };

  onSuccess = async () => {
    toastMessage('Account Updated!');

    this.props.navigation.navigate('Home');

    const {user, province, district, sector, village} = this.state;

    const user_updated = {
      ...user,
      badge: 'family',
      province,
      district,
      sector,
      village,
    };

    await new LocalStorage().set(user_updated);

    this.setState({isSubmitting: false});

    this.props.navigation.navigate('Home');
  };

  onSelect(type, item) {
    let {error} = this.state;

    delete error[type];
    this.setState({[type]: item, error});
  }

  handleOpenModal(modal) {
    this.refs[modal].open();
  }

  handleCloseModal(modal) {
    this.refs[modal].close();
  }

  render() {
    const {language} = this.props;
    const {
      submit,
      almost_there,
      province_txt,
      district_txt,
      cell_txt,
      sector_txt,
      village_txt,
      select_province_txt,
      select_district_txt,
      select_cell_txt,
      select_sector_txt,
      select_village_txt,
      skip,
    } = languages[language];

    return (
      <>
        <View style={[styles.container]}>
          <View style={styles.header}>
            <Text type="bold" title style={styles.title}>
              {almost_there + ' '}(2 / 2)
            </Text>
            <View style={styles.progress_container}>
              <View
                style={[
                  styles.progress_item,
                  styles.progress_item_active,
                ]}></View>
              <View
                style={[
                  styles.progress_item,
                  styles.progress_item_active,
                ]}></View>
            </View>
          </View>
          <ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{flexGrow: 1, paddingTop: 10}}>
            <View style={styles.form_container}>
              <Input
                label={province_txt}
                placeholder={select_province_txt}
                value={this.state.province}
                onChangeText={e => this.onChangeText('province', e)}
                error={this.state.error.province}
                required
                clickable
                onInputPressed={() =>
                  this.props.navigation.navigate('Rwanda', {
                    type: 'province',
                    onSelect: this.onSelect.bind(this),
                  })
                }
              />
              <Input
                label={district_txt}
                placeholder={select_district_txt}
                value={this.state.district}
                onChangeText={e => this.onChangeText('district', e)}
                error={this.state.error.district}
                required
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
                label={sector_txt}
                placeholder={select_sector_txt}
                value={this.state.sector}
                onChangeText={e => this.onChangeText('sector', e)}
                error={this.state.error.sector}
                required
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
                label={cell_txt}
                placeholder={select_cell_txt}
                value={this.state.cell}
                onChangeText={e => this.onChangeText('cell', e)}
                error={this.state.error.cell}
                required
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
              <Input
                placeholder={select_village_txt}
                label={village_txt}
                value={this.state.village}
                onChangeText={e => this.onChangeText('village', e)}
                error={this.state.error.village}
                required
                clickable
                onInputPressed={() =>
                  this.props.navigation.navigate('Rwanda', {
                    type: 'village',
                    province: this.state.province,
                    district: this.state.district,
                    sector: this.state.sector,
                    cell: this.state.cell,
                    onSelect: this.onSelect.bind(this),
                  })
                }
              />
              <View style={{marginTop: 15}}>
                <Button
                  onPress={this.onSubmit.bind(this)}
                  isSubmitting={this.state.isSubmitting}
                  text={submit}
                />
                <View style={{marginTop: 20}}>
                  <Button
                    onPress={() => this.props.navigation.navigate('Home')}
                    text={skip}
                    type="transparent"
                    textBlack
                  />
                </View>
              </View>
            </View>
          </ScrollView>
        </View>
      </>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {theme} = state.Theme;
  return {
    language,
    theme,
  };
};

export default connect(mapPropsToState)(StepTwo);
