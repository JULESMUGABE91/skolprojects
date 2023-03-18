import AsyncStorage from '@react-native-async-storage/async-storage';
import toastMessage from './toastMessage';

export default class LocalStorage {
  constructor(field_name) {
    this.field_name = field_name ? field_name : 'skolLMTNSurvey';
  }

  set = async data => {
    if (!this.field_name) return;

    try {
      AsyncStorage.setItem(this.field_name, JSON.stringify(data));
    } catch (error) {
      toastMessage(error);
    }
  };

  get = async () => {
    if (!this.field_name) return;

    let data = {};
    try {
      data = await AsyncStorage.getItem(this.field_name);
      return data ? JSON.parse(data) : {};
    } catch (error) {
      toastMessage(error);
    }
  };

  clear = async () => {
    await AsyncStorage.clear();
  };
}
