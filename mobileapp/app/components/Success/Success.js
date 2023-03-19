import React from 'react';
import {View, Image, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {Button} from '../Button';
import {Text} from '../Text';
import styles from './styles';

const {width} = Dimensions.get('screen');

class Success extends React.Component {
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.logo_container}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logo}
          />
        </View>
        <View style={styles.success_content}>
          <View style={styles.title_container}>
            <Text type="bold">Process completed successfully</Text>
          </View>

          <View style={styles.content_container}>
            <View style={styles.image_success}>
              <View style={styles.image_success_circle}>
                <Image
                  source={require('../../assets/trophy.png')}
                  style={styles.trophy}
                />
              </View>
            </View>
            <View style={styles.description_c}>
              {/* <Text style={styles.win_desc}>
                You will get a rewards in the amount of{' '}
                <Text type="bold" primary>
                  10 Points!
                </Text>
              </Text> */}
              <Text style={styles.thanks}>Thank you for your time!</Text>
            </View>

            <View>
              <Button
                text="Take another Survey"
                onPress={() => this.props.navigation.navigate('Home')}
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
  const {accent_color, primary_color} = state.Theme;
  return {
    language,
    accent_color,
    primary_color,
  };
};

export default connect(mapPropsToState)(Success);
