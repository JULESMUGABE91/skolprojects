import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import {connect} from 'react-redux';
import {Text} from '../Text';
import styles from './styles';
import LocalStorage from '../../utils/storage';
import {Button} from '../Button';
import {ORGANIZATION_NAME} from '../../constants/strings';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

class Introduction extends React.Component {
  state = {
    user: {},
  };

  componentDidMount = async () => {
    this.initiateProfile();

    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.initiateProfile();
      },
    );
  };

  initiateProfile = async () => {
    const user = await new LocalStorage().get();

    const intro = this.formatIntro(user);
    console.log(intro);

    this.setState({
      user,
      intro,
    });
  };

  formatIntro(user) {
    let intro = this.props.intro;
    let pattern = /\{[^\}]+\}/g;

    intro = intro.replace(pattern, (match, contents, offset, input_string) => {
      // if(e === "{firstname}")
      console.log('====================================');
      console.log({match, contents, offset, input_string});
      console.log('====================================');
      if (match === '{firstname}') {
        return match.replace(pattern, user.firstname);
      }
      if (match === '{lastname}') {
        return match.replace(pattern, user.lastname);
      }
      if (match === '{organization}') {
        return match.replace(pattern, ORGANIZATION_NAME);
      }

      if (match === '{cell}') {
        return match.replace(pattern, user.cell);
      }

      const replaced_by_key = Object.keys(user).map((key, i) => {
        if (match === '{' + key + '}') {
          return match.replace(pattern, user.cell);
        }
      });

      return replaced_by_key;
    });

    return intro;
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={this.props.goBack}>
          <View style={styles.top_header}>
            <MaterialCommunityIcons
              name="arrow-left"
              style={styles.back_icon}
            />
          </View>
        </TouchableOpacity>
        <View style={styles.header}>
          <View style={styles.hi_container}>
            <MaterialCommunityIcons
              name="hand-wave-outline"
              style={styles.hi_icon}
            />
          </View>
        </View>
        <View style={styles.content}>
          <Text style={styles.intro}>{this.state.intro}</Text>
        </View>
        <View style={styles.footer}>
          <Button text="Start Survey" onPress={this.props.handleStart} />
        </View>
      </View>
    );
  }
}
const mapPropsToState = state => {
  const {language} = state.Language;
  const {theme, primary_color, accent_color} = state.Theme;
  return {
    language,
    theme,
    primary_color,
    accent_color,
  };
};

export default connect(mapPropsToState)(Introduction);
