import React from 'react';
import {Text, View, Dimensions} from 'react-native';
import Carousel from 'react-native-looped-carousel';
import {connect} from 'react-redux';

import styles from './styles';

import {languages} from '../../constants/localization';
import OnboardItem from './OnboardItem';
import {Button} from '../Button';
import {
  ONBOARD_IMAGE_ONE,
  ONBOARD_IMAGE_THREE,
  ONBOARD_IMAGE_TWO,
} from '../../constants/strings';

const {width, height} = Dimensions.get('window');

class Onboard extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      size: {width, height},
    };
  }

  _onLayoutDidChange = e => {
    const layout = e.nativeEvent.layout;
    this.setState({size: {width: layout.width, height: layout.height}});
  };

  gotoScreen(screen) {
    this.props.navigation.navigate(screen);
  }

  render() {
    const {language} = this.props;
    const {on_board_one, on_board_two, on_board_three, getting_started} =
      languages[language];
    const options = [
      {
        title: on_board_one.title,
        description: on_board_one.description,
        image: ONBOARD_IMAGE_ONE,
      },
      {
        title: on_board_two.title,
        description: on_board_two.description,
        image: ONBOARD_IMAGE_TWO,
      },
      {
        title: on_board_three.title,
        description: on_board_three.description,
        image: ONBOARD_IMAGE_THREE,
      },
    ];

    return (
      <View style={styles.container} onLayout={this._onLayoutDidChange}>
        <View style={{flex: 1}}>
          <Carousel
            delay={5000}
            style={this.state.size}
            autoplay
            bullets
            bulletStyle={styles.buttles}
            bulletsContainerStyle={styles.bulletsContainerStyle}
            chosenBulletStyle={[
              styles.selected_bullets,
              {backgroundColor: this.props.primary_color},
            ]}
            pageStyle={styles.pageStyle}>
            {options.map((el, i) => {
              return <OnboardItem {...el} i={i} />;
            })}
          </Carousel>
        </View>
        <View style={styles.footer}>
          <Button
            text={getting_started}
            style={{marginBottom: 15}}
            onPress={() => this.gotoScreen('Login')}
          />
          <Button
            text="Powered By Limitess Apps"
            type="transparent"
            textStyles={{
              fontSize: 10,
              color: this.props.primary_color,
              opacity: 0.5,
            }}
          />
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

export default connect(mapPropsToState)(Onboard);
