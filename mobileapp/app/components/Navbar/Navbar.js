import React from 'react';
import styles from './styles';
import {TouchableOpacity, View} from 'react-native';
import {Text} from '../Text';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {DrawerActions} from '@react-navigation/native';
import {connect} from 'react-redux';
import LocalStorage from '../../utils/storage';

class Navbar extends React.Component {
  state = {
    user: {},
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user});
  };

  onDrawer() {
    this.props.navigation.dispatch(DrawerActions.toggleDrawer());
  }

  gotoScreen(screen) {
    this.props.navigation.navigate(screen);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.left_content}>
          {this.props.back ? (
            <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={styles.icon_container}>
                <Feather name="arrow-left" style={styles.icon_item} />
              </View>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={this.onDrawer.bind(this)}>
              <View style={styles.icon_container}>
                <Feather name="menu" style={styles.icon_item} />
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.title_content}>
          <Text type="bold" primary sbtitle>
            {this.props.title}
          </Text>
        </View>
        <View style={styles.right_content}>
          {this.props.location && (
            <TouchableOpacity onPress={this.props.handleRequestLocation}>
              <View style={[styles.icon_container, {marginRight: 20}]}>
                <MaterialCommunityIcons
                  name="map-marker"
                  style={styles.icon_item}
                />
                <View style={styles.my_location_status}>
                  {this.props.my_location.latitude ? (
                    <MaterialCommunityIcons
                      name="check"
                      style={styles.my_location_status_icon}
                    />
                  ) : (
                    <AntDesign
                      name="question"
                      style={styles.my_location_status_icon}
                    />
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          {this.props.scan &&
          (this.state.user.account_type === 'super_admin' ||
            this.state.user.account_type === 'admin') ? (
            <TouchableOpacity onPress={() => this.gotoScreen('QRScan')}>
              <View style={styles.icon_container}>
                <MaterialCommunityIcons
                  name="line-scan"
                  style={styles.icon_item}
                />
              </View>
            </TouchableOpacity>
          ) : this.props.filter ? (
            <></>
          ) : (
            (this.state.user.account_type === 'super_admin' ||
              this.state.user.account_type === 'admin') &&
            this.props.add && (
              <TouchableOpacity onPress={this.props.handleAddPress}>
                <View style={styles.icon_container}>
                  <Feather name="plus" style={styles.icon_item} />
                </View>
              </TouchableOpacity>
            )
          )}
        </View>
      </View>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {my_location} = state.MyLocation;
  return {
    language,
    my_location,
  };
};

export default connect(mapPropsToState)(Navbar);
