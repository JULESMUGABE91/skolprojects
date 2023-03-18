import React from 'react';
import styles from './styles';
import {
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  View,
  Image,
  Alert,
} from 'react-native';
import {Text} from '../Text';
import {connect} from 'react-redux';
import LocalStorage from '../../utils/storage';
import axios from 'axios';
import {
  APP_ID,
  DEFAULT_IMAGE_PLACEHOLDER,
  ROOT_API,
} from '../../constants/strings';
import toastMessage from '../../utils/toastMessage';
import {Button} from '../Button';
import {Input} from '../Input';
import {Navbar} from '../Navbar';
import imageUploadHandler from '../../utils/image/imageUploadHandler';
import EStyleSheet from 'react-native-extended-stylesheet';
import ImageChoice from '../ImageComponent/ImageChoice';
import Modal from 'react-native-modalbox';
import uploadImage from '../../utils/image/uploadImage';
import {Providers} from '../Providers';

class NewGift extends React.Component {
  state = {
    user: {},
    isLoading: true,
    min_point: '',
    max_point: '',
    file: {},
    error: {},
    isSubmitting: false,
    description: '',
    name: '',
    providers: [],
    isLoadingProvider: false,
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user}, async () => {
      await this.getProviders(true);
    });

    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.setState({user}, async () => {
          this.getProviders(true);
        });
      },
    );

    if (this.props.params && this.props.params._id) {
      this.setState({
        min_point: this.props.params.min_point + '',
        max_point: this.props.params.max_point + '',
        file: {
          uri: this.props.params.file || '',
        },
        description: this.props.params.description,
        name: this.props.params.name,
        _id: this.props.params._id,
      });
    }
  };

  getProviders(isLoadingProviders) {
    this.setState({isLoadingProviders});

    const {user} = this.state;

    const options = {
      method: 'GET',
      url: `${ROOT_API}/provider`,
      params: {
        organization: APP_ID,
      },
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    axios(options)
      .then(data => {
        let default_provider = {};

        if (this.props?.params && this.props?.params?._id) {
          for (let item of data.data) {
            if (item._id === this?.props?.params?.provider) {
              default_provider = item;
            }
          }
        } else if (data.data.length > 0) {
          default_provider = data.data[0];
        }
        this.setState({
          isLoadingProviders: false,
          providers: data.data,
          provider: default_provider,
        });
      })
      .catch(error => {
        toastMessage(error);

        this.setState({isLoadingProviders: false});
      });
  }

  onChangeText(field, e) {
    let {error} = this.state;

    delete error[field];

    this.setState({[field]: e, error});
  }

  handleOpenModal(modal) {
    this.refs[modal].open();
  }

  handleCloseModal(modal) {
    this.refs[modal].close();
  }

  onPressImageMenu = async params => {
    await this.handleImage(params.type);
  };

  onSelectItem(item) {
    this.setState({provider: item});
  }

  handleImage = async type => {
    const {user} = this.state;
    try {
      const image_obj = await imageUploadHandler(type);

      this.setState({isSubmittingFile: true, file: image_obj});

      const image_url = await uploadImage(image_obj, user.token);

      this.setState({
        isSubmittingFile: false,
        file: image_url?.length ? {uri: image_url[0]} : {},
      });

      this.handleCloseModal('upload_menus');
    } catch (error) {
      toastMessage(error.response);

      this.setState({isSubmittingFile: false, file: {}});
    }
  };

  validateForm() {
    let {error, name, max_point, min_point, file, provider} = this.state;

    if (name === '') {
      error.name = 'Gift name is required';
    }

    if (max_point === '') {
      error.max_point = 'Maximum point is required';
    }

    if (min_point === '') {
      error.min_point = 'Minimum point is required';
    }

    if (provider._id === '') {
      error.provider = 'Please select gift provider';
    }

    if (!file.uri) {
      error.file = 'Please upload gift image';
    }

    this.setState({error});
  }

  onSubmit = async () => {
    await this.validateForm();
    const {
      error,
      name,
      max_point,
      min_point,
      description,
      user,
      file,
      _id,
      provider,
    } = this.state;

    if (Object.keys(error).length === 0) {
      this.setState({isSubmitting: true});

      let method = 'POST',
        body = {
          name,
          max_point,
          min_point,
          description,
          file: file.uri,
          organization: APP_ID,
          provider: provider._id,
        };

      if (_id && _id !== '') {
        method = 'PUT';
        body.id = _id;
      }
      const options = {
        url: `${ROOT_API}/gift`,
        method,
        data: body,
        headers: {
          authorization: 'Bearer ' + user.token,
        },
      };

      axios(options)
        .then(data => {
          this.setState({
            isSubmitting: false,
            name: '',
            max_point: '',
            min_point: '',
            description: '',
          });

          toastMessage('New gift has been added successfully');

          this.props.navigation.navigate('Gifts');
        })
        .catch(error => {
          console.log(error.response);
          this.setState({isSubmitting: false});

          toastMessage('Error occured when adding new Gift: ' + error);
        });
    }
  };

  handleDelete = () => {
    Alert.alert('Delete Gift', 'Are you sure, want to delete this gift', [
      {
        text: 'NO',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {text: 'YES', onPress: () => this.onDelete()},
    ]);
  };

  onDelete = async () => {
    const {_id, user} = this.state;

    this.setState({isDeleting: true});

    let body = {
      id: _id,
    };

    const options = {
      url: `${ROOT_API}/gift`,
      method: 'DELETE',
      data: body,
      headers: {
        authorization: 'Bearer ' + user.token,
      },
    };

    axios(options)
      .then(data => {
        this.setState({
          isDeleting: false,
        });

        toastMessage('Gift has been deleted successfully');

        this.props.navigation.navigate('Gifts');
      })
      .catch(error => {
        this.setState({isDeleting: false});

        toastMessage('Error occured when deleting  Gift: ' + error);
      });
  };

  getSelectedItem(item) {
    this.setState({provider: item});
  }

  render() {
    const bgColor = EStyleSheet.value('$bgColorLight');

    const modal_radius = {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    };

    const modal_styles = StyleSheet.create({
      upload_menus: {
        height: 110,
        ...modal_radius,
        backgroundColor: bgColor,
      },
    });

    return (
      <>
        <View style={styles.container}>
          <Navbar title="New Zawadi" back navigation={this.props.navigation} />
          <ScrollView
            keyboardShouldPersistTaps="always"
            contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.form_container}>
              {this.state.error.file && (
                <Text danger>{this.state.error.file}</Text>
              )}
              <TouchableOpacity
                onPress={() => this.handleOpenModal('upload_menus')}>
                <View
                  style={[
                    styles.gift_image_container,
                    this.state.error.file && {borderColor: 'red'},
                  ]}>
                  <>
                    <View style={styles.image_container}>
                      <Image
                        source={{
                          uri: this.state?.file?.uri
                            ? this.state?.file.uri
                            : DEFAULT_IMAGE_PLACEHOLDER,
                        }}
                        resizeMode="contain"
                        style={styles.image_gift}
                      />
                    </View>
                    <Text type="bold">Upload Gift Image</Text>
                  </>
                </View>
              </TouchableOpacity>

              <Input
                required
                label="Gift Name"
                placeholder="Name"
                error={this.state.error.name}
                value={this.state.name}
                onChangeText={e => this.onChangeText('name', e)}
              />
              <View style={{flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <Input
                    required
                    label="Min Point"
                    placeholder="10"
                    error={this.state.error.min_point}
                    value={this.state.min_point}
                    keyboardType="number-pad"
                    onChangeText={e => this.onChangeText('min_point', e)}
                  />
                </View>
                <View style={{width: 10}} />
                <View style={{flex: 1}}>
                  <Input
                    required
                    label="Max Point"
                    placeholder="100"
                    keyboardType="number-pad"
                    error={this.state.error.max_point}
                    value={this.state.max_point}
                    onChangeText={e => this.onChangeText('max_point', e)}
                  />
                </View>
              </View>
              <Input
                label="Provider"
                placeholder="Select Provider"
                error={this.state.error.provider}
                value={this.state.provider?.name || ''}
                onChangeText={e => this.onChangeText('provider', e)}
                onInputPressed={() => this.handleOpenModal('providers_modal')}
                clickable
              />
              <Input
                label="Description"
                placeholder="Enter Description"
                error={this.state.error.description}
                value={this.state.description}
                onChangeText={e => this.onChangeText('description', e)}
              />
              <Button
                text="Submit"
                isSubmitting={this.state.isSubmitting}
                onPress={this.onSubmit.bind(this)}
              />
              {this.state._id && (
                <View style={{marginTop: 25}}>
                  <Button
                    text="Delete"
                    isSubmitting={this.state.isDeleting}
                    onPress={this.handleDelete.bind(this)}
                    type="transparent"
                    textBlack
                  />
                </View>
              )}
            </View>
          </ScrollView>
        </View>
        <Modal
          style={modal_styles.upload_menus}
          ref="upload_menus"
          position={'bottom'}
          onClosingState={() => this.handleCloseModal('upload_menus')}>
          <ImageChoice
            handleCloseModal={() => this.handleCloseModal('upload_menus')}
            onPress={params => this.onPressImageMenu(params)}
            isSubmitting={this.state.isSubmittingFile}
          />
        </Modal>
        <Modal
          style={modal_styles.providers_modal}
          ref="providers_modal"
          coverScreen
          onClosingState={() => this.handleCloseModal('providers_modal')}>
          <Providers
            handleCloseModal={() => this.handleCloseModal('providers_modal')}
            onPress={params => this.onSelectItem(params)}
            navigation={this.props}
            getSelectedItem={params => this.getSelectedItem(params)}
          />
        </Modal>
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

export default connect(mapPropsToState)(NewGift);
