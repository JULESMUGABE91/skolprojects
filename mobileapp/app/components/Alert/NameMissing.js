import React from 'react';
import styles from './styles';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '../Text';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {DrawerActions} from '@react-navigation/native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Button} from '../Button';

const NameMissing = props => {
  const {language} = props;
  const {
    welcome_missing_profile_info_title,
    complete_profile,
    welcome_missing_profile_info_description,
  } = languages[language];

  return (
    <View style={styles.name_missing_container}>
      <View style={styles.name_missing}>
        <Text style={styles.name_title} type="bold">
          {welcome_missing_profile_info_title}
        </Text>
        <Text style={styles.name_description}>
          {welcome_missing_profile_info_description}
        </Text>
      </View>
      <View>
        <Button
          text={complete_profile}
          onPress={() => props.navigation.navigate('MyAccount')}
        />
      </View>
    </View>
  );
};

const mapPropsToState = state => {
  const {language} = state.Language;
  return {
    language,
  };
};

export default connect(mapPropsToState)(NameMissing);
