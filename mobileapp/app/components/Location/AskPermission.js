import React from 'react';
import {Linking, View, Alert, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Button} from '../Button';
import styles from './styles';
import Feather from 'react-native-vector-icons/Feather';
import {Text} from '../Text';
import Geolocation from 'react-native-geolocation-service';
import {
  checkLocationPermission,
  requestLocationPermission,
} from '../../utils/permissions';
import {onSetLocation} from '../../actions/MyLocation';
import Geocoder from 'react-native-geocoding';
import {GOOGLE_API} from '../../constants/strings';
import toastMessage from '../../utils/toastMessage';

class AskPermission extends React.Component {
  state = {};

  handleLocation() {
    const {language} = this.props;
    const {ask_location_title, ask_location_description} = languages[language];

    checkLocationPermission(async permission => {
      if (permission !== 'granted') {
        const resultPermission = await requestLocationPermission();

        if (resultPermission === 'blocked') {
          Alert.alert(ask_location_title, ask_location_description, [
            {
              text: 'OK',
              onPress: () => {
                Linking.openSettings();
              },
            },
          ]);
          return;
        }
        this.handleLocation();
      } else {
        this.setLocation();
      }
    });
  }

  setLocation() {
    Geocoder.init(GOOGLE_API);

    this.setState({isSubmitting: true});

    Geolocation.getCurrentPosition(
      async position => {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        const geocode_address = await Geocoder.from({
          latitude,
          longitude,
        });

        let address = '';

        if (
          geocode_address?.results?.length > 0 &&
          geocode_address?.results[0]?.formatted_address
        ) {
          address = geocode_address?.results[0]?.formatted_address;
        }

        this.props.dispatch(
          onSetLocation({
            name: address,
            latitude,
            longitude,
          }),
        );

        this.setState({isSubmitting: false});

        this.props.handleCloseModal();
      },
      error => {
        // See error code charts below.
        this.setState({isSubmitting: false});
        toastMessage('Check your internet and try again');
      },
      {enableHighAccuracy: false, timeout: 25000, maximumAge: 3600000},
    );
  }

  render() {
    const {language} = this.props;
    const {ask_location_title, ask_location_description, YES, NO} =
      languages[language];

    return (
      <View style={styles.container}>
        <View style={styles.icon_container}>
          <Feather name="map-pin" style={styles.pin} />
        </View>
        <TouchableOpacity
          style={styles.close_container}
          onPress={this.props.handleCloseModal}>
          <View style={styles.close_indicator}></View>
        </TouchableOpacity>
        <View style={styles.description_container}>
          <Text type="bold" title style={styles.title}>
            {ask_location_title}
          </Text>
          <Text style={styles.description}>{ask_location_description}</Text>
          <View style={styles.button_container}>
            <View style={{flex: 1, marginRight: 15}}>
              <Button
                text={NO}
                onPress={this.props.handleCloseModal.bind(this)}
                secondary
                type="disabled"
                primaryText
              />
            </View>

            <View style={{flex: 1, marginLeft: 15}}>
              <Button
                text={YES}
                onPress={this.handleLocation.bind(this)}
                isSubmitting={this.state.isSubmitting}
              />
            </View>
          </View>
        </View>
      </View>
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

export default connect(mapPropsToState)(AskPermission);
