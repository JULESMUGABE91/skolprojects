import React from 'react';
import {View, ScrollView, StyleSheet, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import {Text} from '../Text';
import styles from './styles';
import {ListItem} from '../List';
import {Back} from '../Back';
import EStyleSheet from 'react-native-extended-stylesheet';
import Modal from 'react-native-modalbox';
import {Appearance} from '../Appearance';
import {CLanguage} from '../Language';
import {Button} from '../Button';
import LocalStorage from '../../utils/storage';

const {height} = Dimensions.get('screen');

class Setting extends React.Component {
  goBack() {
    this.props.navigation.goBack();
  }

  gotoScreen(modal) {
    this.refs[modal].open();
  }

  handleCloseModal(modal) {
    this.refs[modal].close();
  }

  onLogout = async () => {
    await new LocalStorage().clear();

    await this.props.dispatch({type: 'USER_LOGOUT'});

    this.props.navigation.navigate('Splash');
  };

  render() {
    const {language} = this.props;
    const {appearence, language_text, logout, settings} = languages[language];

    const items = [
      // {
      //   title: appearence,
      //   onPress: () => this.gotoScreen('appearanceModal'),
      //   right_icon: 'chevron-right',
      //   left_icon: 'theme-light-dark',
      //   description: '',
      // },
      {
        title: language_text,
        // onPress: () => this.gotoScreen('languageModal'),
        right_icon: 'chevron-right',
        left_icon: 'book-open',
        description: language,
      },
    ];

    const bgColor = EStyleSheet.value('$bgColorLight');

    const modal_radius = {
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    };

    const modal_styles = StyleSheet.create({
      appearanceModal: {
        height: height / 1.5,
        ...modal_radius,
        backgroundColor: bgColor,
      },

      languageModal: {
        height: height / 2,
        backgroundColor: bgColor,
        ...modal_radius,
      },
    });

    return (
      <>
        <View style={styles.container}>
          <View style={styles.top_header}>
            <Back goBack={this.goBack.bind(this)} />
            <Text type="bold" title>
              {settings}
            </Text>
          </View>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <View style={{flex: 1, paddingBottom: 100}}>
              <View style={styles.list_container}>
                {items.map((item, i) => {
                  return (
                    <ListItem
                      key={i}
                      {...item}
                      background={this.props.theme === 'light'}
                    />
                  );
                })}
              </View>
            </View>
          </ScrollView>
          <View style={{marginHorizontal: 15, marginVertical: 15}}>
            <Button text={logout} onPress={this.onLogout.bind(this)} />
          </View>
        </View>
        <Modal
          style={modal_styles.appearanceModal}
          ref="appearanceModal"
          position={'bottom'}
          onClosingState={() => this.handleCloseModal('appearanceModal')}>
          <Appearance
            handleCloseModal={() => this.handleCloseModal('appearanceModal')}
          />
        </Modal>

        <Modal
          style={modal_styles.languageModal}
          ref="languageModal"
          position={'bottom'}
          onClosingState={() => this.handleCloseModal('languageModal')}>
          <CLanguage
            handleCloseModal={() => this.handleCloseModal('languageModal')}
          />
        </Modal>
      </>
    );
  }
}
const mapPropsToState = state => {
  const {language} = state.Language;
  const {theme} = state.Theme;
  return {
    language,
    theme,
  };
};

export default connect(mapPropsToState)(Setting);
