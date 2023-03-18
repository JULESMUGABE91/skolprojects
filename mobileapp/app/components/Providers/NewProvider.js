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

class NewProvider extends React.Component {
  state = {
    user: {},
    isLoading: true,
    file: {},
    error: {},
    isSubmitting: false,
    name: '',
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    if (this.props.params && this.props.params._id) {
      this.setState({
        file: {
          uri: this.props.params.file || '',
        },
        name: this.props.params.name,
        _id: this.props.params._id,
      });
    }

    this.setState({user});
  };

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
    let {error, name, file} = this.state;

    if (name === '') {
      error.name = 'Provider name is required';
    }

    if (!file.uri) {
      error.file = 'Please upload provider image';
    }

    this.setState({error});
  }

  onSubmit = async () => {
    await this.validateForm();
    const {error, name, user, file, _id} = this.state;

    if (Object.keys(error).length === 0) {
      this.setState({isSubmitting: true});

      let method = 'POST',
        body = {
          name,
          file: file.uri,
          organization: APP_ID,
        };

      if (_id && _id !== '') {
        method = 'PUT';
        body.id = _id;
      }
      const options = {
        url: `${ROOT_API}/provider`,
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
            file: {},
          });

          toastMessage('New provider has been added successfully');

          this.props.navigation.navigate('Providers');
        })
        .catch(error => {
          this.setState({isSubmitting: false});

          toastMessage('Error occured when adding new provider: ' + error);
        });
    }
  };

  handleDelete = () => {
    Alert.alert(
      'Delete Provider',
      'Are you sure, want to delete this provider',
      [
        {
          text: 'NO',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'YES', onPress: () => this.onDelete()},
      ],
    );
  };

  onDelete = async () => {
    const {_id, user} = this.state;

    this.setState({isDeleting: true});

    let body = {
      id: _id,
    };

    const options = {
      url: `${ROOT_API}/provider`,
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

        toastMessage('Provider has been deleted successfully');

        this.props.navigation.navigate('Gifts');
      })
      .catch(error => {
        this.setState({isDeleting: false});

        toastMessage('Error occured when deleting  provider: ' + error);
      });
  };

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
          <Navbar
            title="New Provider"
            back
            navigation={this.props.navigation}
          />
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
                    styles.provider_image_container,
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
                        style={styles.image_provider}
                      />
                    </View>
                    <Text type="bold">Upload Provider Image / Logo</Text>
                  </>
                </View>
              </TouchableOpacity>

              <Input
                required
                label="Provider Name"
                placeholder="Name"
                error={this.state.error.name}
                value={this.state.name}
                onChangeText={e => this.onChangeText('name', e)}
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

export default connect(mapPropsToState)(NewProvider);
