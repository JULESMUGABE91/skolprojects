import React from 'react';
import {StatusBar} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {connect} from 'react-redux';
import {Container} from './components/Container';
import {Splash} from './components/Splash';
import RootNavigator from './RootNavigator';

// themes
import darkTheme from './theme/dark';
import lightTheme from './theme/light';
import socket from './utils/socket';
import LocalStorage from './utils/storage';

EStyleSheet.build({
  ...lightTheme,
  $white: '#ffffff',
});

class AppEntry extends React.Component {
  constructor() {
    super();
    this.state = {
      shouldRender: true,
    };
  }

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.toggleTheme(this.props.theme);
    this.toggleLanguage();

    socket.on('connection', () => {
      console.log('==================Socket connected succefully');
    });
  };

  componentDidUpdate(nxtProps) {
    if (nxtProps.theme !== this.props.theme) {
      this.toggleTheme(this.props.theme);
    }

    if (nxtProps.language !== this.props.language) {
      this.toggleLanguage(this.props.language);
    }
  }

  toggleTheme(style) {
    const theme = style === 'dark' ? darkTheme : lightTheme;

    EStyleSheet.build(theme);

    this.setState({shouldRender: false}, () =>
      this.setState({shouldRender: true}),
    );
  }

  toggleLanguage() {
    this.setState({shouldRender: false}, () =>
      this.setState({shouldRender: true}),
    );
  }

  render() {
    if (this.state.shouldRender) {
      const bgColorDark = EStyleSheet.value('$accentColor');

      return (
        <Container>
          <StatusBar
            translucent
            barStyle={'dark-content'}
            backgroundColor={bgColorDark}
          />
          <RootNavigator
            user={this.state.user}
            {...this.props}
            onNavigationStateChange={null}
          />
        </Container>
      );
    } else {
      return <Splash />;
    }
  }
}

const mapStateToProps = state => {
  const {theme, accent_color, primary_color} = state.Theme;
  const {language} = state.Language;
  return {
    theme,
    language,
    accent_color,
    primary_color,
  };
};

export default connect(mapStateToProps)(AppEntry);
