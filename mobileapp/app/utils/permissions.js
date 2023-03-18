import {check, PERMISSIONS, request} from 'react-native-permissions';
import {Platform} from 'react-native';

export const checkLocationPermission = callback => {
  if (Platform.OS === 'ios') {
    check(PERMISSIONS.IOS.LOCATION_ALWAYS)
      .then(result => {
        callback(result);
      })
      .catch(error => {
        callback(error);
      });
  } else {
    check(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION)
      .then(result => {
        callback(result);
      })
      .catch(error => {
        callback(error);
      });
  }
};

export const checkCameraPermission = callback => {
  if (Platform.OS === 'ios') {
    check(PERMISSIONS.IOS.CAMERA)
      .then(result => {
        callback(result);
      })
      .catch(error => {
        callback(error);
      });
  } else {
    check(PERMISSIONS.ANDROID.CAMERA)
      .then(result => {
        callback(result);
      })
      .catch(error => {
        callback(error);
      });
  }
};

export const requestLocationPermission = callback => {
  try {
    if (Platform.OS === 'ios') {
      return request(PERMISSIONS.IOS.LOCATION_ALWAYS);
    } else {
      return request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
    }
  } catch (error) {
    console.log(error);
  }
};

export const requesCameraPermission = callback => {
  try {
    if (Platform.OS === 'ios') {
      return request(PERMISSIONS.IOS.CAMERA);
    } else {
      return request(PERMISSIONS.ANDROID.CAMERA);
    }
  } catch (error) {
    console.log(error);
    return error;
  }
};
