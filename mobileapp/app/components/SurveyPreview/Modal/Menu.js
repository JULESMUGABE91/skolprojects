import React from 'react';
import {ActivityIndicator, Alert, TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {languages} from '../../../constants/localization';
import styles from '../styles';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Text} from '../../Text';
import {ROOT_API} from '../../../constants/strings';
import axios from 'axios';
import toastMessage from '../../../utils/toastMessage';
import LocalStorage from '../../../utils/storage';

class Menu extends React.Component {
  state = {
    user: {},
    isDeleting: false,
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user});
  };

  onEditSurvey() {
    const {survey, questions} = this.props;

    this.props.navigation.navigate('SurveyForm', {
      survey,
      questions,
    });
  }

  openAlert() {
    const {language} = this.props;
    const {delete_survey, NO, YES, delete_survey_desc} = languages[language];
    Alert.alert(delete_survey, delete_survey_desc, [
      {
        text: NO,
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: YES,
        onPress: this.onDeleteSurvey.bind(this),
      },
    ]);
  }

  onDeleteSurvey() {
    const {survey} = this.props;

    this.setState({isDeleting: true});

    const {user} = this.state;

    const options = {
      method: 'POST',
      url: `${ROOT_API}/survey/delete`,
      data: {
        id: survey._id,
      },
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    axios(options)
      .then(data => {
        this.setState({
          isDeleting: false,
        });

        this.props.navigation.goBack();

        toastMessage('Deleted successful');
      })
      .catch(error => {
        toastMessage(error);

        this.setState({isDeleting: false});
      });
  }

  render() {
    const {language} = this.props;
    const {edit_txt, delete_txt} = languages[language];

    const menus = [
      {
        title: edit_txt,
        onPress: this.onEditSurvey.bind(this),
        icon: 'pencil-box-outline',
      },
      {
        title: delete_txt,
        onPress: this.openAlert.bind(this),
        icon: 'trash-can-outline',
        isLoading: this.state.isDeleting,
      },
    ];
    return (
      <View style={styles.menuModalContainer}>
        {menus.map((item, i) => {
          return (
            <TouchableOpacity
              disabled={item.isLoading}
              key={i}
              onPress={item.onPress}>
              <View style={styles.item_menu}>
                <View style={styles.menuitem_icon_container}>
                  {item.isLoading ? (
                    <ActivityIndicator color={this.props.primary_color} />
                  ) : (
                    <MaterialCommunityIcons
                      name={item.icon}
                      style={styles.menuitem_icon}
                    />
                  )}
                </View>
                <Text type="bold">{item.title}</Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
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

export default connect(mapPropsToState)(Menu);
