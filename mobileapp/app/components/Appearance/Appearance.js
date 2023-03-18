import React from 'react';
import {View, FlatList, TouchableOpacity} from 'react-native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Text} from '../Text';
import styles from './styles';
import Close from '../Close/Close';
import {ListItem} from '../List';
import {
  onSetAccentColor,
  onSetPrimaryColor,
  onSwitchingTheme,
} from '../../actions/Theme';
import {Separator} from '../Separator';
import Feather from 'react-native-vector-icons/Feather';
import {primary_colors, accent_colors} from '../../constants/colors';
import {VirtualizedList} from '../VirtualizedList';
import EStyleSheet from 'react-native-extended-stylesheet';
import darkTheme from '../../theme/dark';
import lightTheme from '../../theme/light';

class Appearance extends React.Component {
  componentDidMount() {
    this.toggleColor('primaryColor', this.props.primary_color);
    this.toggleColor('accentColor', this.props.accent_color);
  }

  componentDidUpdate(nxtProps) {
    if (nxtProps.primary_color !== this.props.primary_color) {
      this.toggleColor('accentColor', this.props.primary_color);
    }

    if (nxtProps.accent_color !== this.props.accent_color) {
      this.toggleColor('accentColor', this.props.primary_color);
    }
  }

  toggleColor(name, color) {
    if (this.props.theme === 'light') {
      lightTheme[`$${name}`] = color;

      EStyleSheet.build(lightTheme);
    } else {
      EStyleSheet.build({
        ...darkTheme,
        [`$${name}`]: color,
      });
    }

    this.setState({shouldRender: false}, () =>
      this.setState({shouldRender: true}),
    );
  }

  goBack() {
    this.props.navigation.goBack();
  }

  changeTheme(theme) {
    this.props.dispatch(onSwitchingTheme(theme));
  }

  onSetPrimaryColor(color) {
    this.props.dispatch(onSetPrimaryColor(color));
  }

  onSetAccentColor(color) {
    this.props.dispatch(onSetAccentColor(color));
  }

  render() {
    const {language, theme} = this.props;
    const {change_appearance, primary_color_text, accent_color_text} =
      languages[language];

    const themes = [
      {
        label: 'Light',
        value: 'light',
        left_icon: 'white-balance-sunny',
        onPress: () => this.changeTheme('light'),
      },
      {
        label: 'Dark',
        value: 'dark',
        left_icon: 'moon-waning-crescent',
        onPress: () => this.changeTheme('dark'),
      },
    ];

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text type="bold" sbtitle style={styles.title}>
            {change_appearance}
          </Text>
          <Close handleCloseModal={this.props.handleCloseModal} />
        </View>
        <VirtualizedList>
          <View style={styles.content}>
            {themes.map((item, i) => {
              return (
                <ListItem
                  key={i}
                  title={item.label}
                  left_icon={item.left_icon}
                  checkbox
                  checked={item.value === theme}
                  onPress={item.onPress}
                  background={this.props.theme === 'light'}
                  style={{
                    paddingHorizontal: 0,
                  }}
                />
              );
            })}
            <Separator title={primary_color_text} />
            <FlatList
              showsHorizontalScrollIndicator={false}
              horizontal
              contentContainerStyle={{marginHorizontal: 10}}
              data={primary_colors}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={this.onSetPrimaryColor.bind(this, item)}>
                  <View style={[styles.color_box, {backgroundColor: item}]}>
                    {this.props.primary_color === item && (
                      <Feather name="check" style={styles.icon_check_color} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
            <Separator title={accent_color_text} />
            <FlatList
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{marginHorizontal: 10}}
              horizontal
              data={accent_colors}
              renderItem={({item}) => (
                <TouchableOpacity
                  onPress={this.onSetAccentColor.bind(this, item)}>
                  <View style={[styles.color_box, {backgroundColor: item}]}>
                    {this.props.accent_color === item && (
                      <Feather name="check" style={styles.icon_check_color} />
                    )}
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.id}
            />
          </View>
        </VirtualizedList>
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

export default connect(mapPropsToState)(Appearance);
