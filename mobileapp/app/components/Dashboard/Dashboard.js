import React from 'react';
import styles from './styles';
import {ScrollView, TouchableOpacity, View} from 'react-native';
import {Text} from '../Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import LocalStorage from '../../utils/storage';
import {WebView} from 'react-native-webview';
import {URL} from '../../constants/strings';

class Dashboard extends React.Component {
  state = {
    user: {},
  };

  componentDidMount = async () => {
    let user = await new LocalStorage().get();

    this.setState({user});
  };

  INJECTED_JAVASCRIPT = `(function() {
    window.ReactNativeWebView.postMessage(JSON.stringify({message : {"value"}}));
  })();`;
  render() {
    return (
      // <View style={styles.container}>
      <WebView
        ref={ref => {
          this.webview = ref;
        }}
        source={{
          uri: `https://bfe2-2c0f-fe30-164a-0-50ba-cc61-2184-620c.ngrok-free.app/dashboard/home`,
          headers: {
            authorization: `Bearer ${this.state.token}`,
          },
        }}
        style={{flex: 1}}
        injectedJavaScript={this.INJECTED_JAVASCRIPT}
        onMessage={event => {
          const data = JSON.parse(event.nativeEvent.data);
          alert(data.key);
        }}
      />
      // </View>
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

export default connect(mapPropsToState)(Dashboard);
