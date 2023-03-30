import React from 'react';
import {connect} from 'react-redux';
import {Container} from '../components/Container';
import {Navbar} from '../components/Navbar';
import {languages} from '../constants/localization';
import LocalStorage from '../utils/storage';
import {APP_ID, ROOT_API} from '../constants/strings';
import axios from 'axios';
import toastMessage from '../utils/toastMessage';
import {Loading} from '../components/Loading';
import {SurveyItem} from '../components/Survey';
import {FlatList, StyleSheet, View, Dimensions} from 'react-native';
import {onAddAnsweringSurvey} from '../actions/Survey';
import {Empty} from '../components/Empty';
import Modal from 'react-native-modalbox';
import EStyleSheet from 'react-native-extended-stylesheet';
import {AskPermission} from '../components/Location';
import socket from '../utils/socket';

const {height} = Dimensions.get('screen');
class HomeScreen extends React.Component {
  state = {
    isLoading: true,
    data: [],
    activeTab: 0,
  };

  componentDidMount = async () => {
    this.handleFetch(true);

    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        if (this?.props?.route?.params?.from === 'new') {
          this.handleFetch(true);
        }
      },
    );

    socket.on('survey', () => {
      this.handleFetch(false);
    });

    socket.on('answer', () => {
      this.handleFetch(false);
    });
  };

  handleFetch = async isLoading => {
    const user = await new LocalStorage().get();

    this.setState({user}, () => {
      this.getData(isLoading);
    });

    const {my_location} = this.props;

    const time = setTimeout(() => {
      if (!my_location.name) {
        this.handleOpenModal('locationmodal');
      } else {
        clearTimeout(time);
      }
    }, 5000);
  };

  handleOpenModal(modal) {
    if (!modal) return;

    if (!this.refs[modal]) return;

    this.refs[modal].open();
  }

  handleCloseModal(modal) {
    this.refs[modal].close();
  }

  getData(isLoading, tab) {
    this.setState({isLoading});

    const {user} = this.state;

    let body = {
      user: user.user_id,
      organization: APP_ID,
    };

    if (tab === 1) {
      body.tag = 'new';
    }

    if (tab === 2) {
      body.tag = 'inprogress';
    }

    if (tab === 3) {
      body.tag = 'completed';
    }

    const options = {
      method: 'POST',
      url: `${ROOT_API}/survey/fetch`,

      data: body,
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    axios(options)
      .then(data => {
        this.setState({isLoading: false, data: data.data, refreshing: false});
      })
      .catch(error => {
        console.log(error.status);
        toastMessage(error);

        this.setState({isLoading: false, refreshing: false});
      });
  }

  onPressSurvey = async data => {

    const {my_location} = this.props;

    if (!my_location || !my_location.name || my_location.name === '') {
      toastMessage('Please allow MySkol to access your location to continue');
      this.handleOpenModal('locationmodal');

      return;
    }

    await this.props.dispatch(onAddAnsweringSurvey(data));

    this.props.navigation.navigate('SurveyPreview', {data});
  };

  onRefresh() {
    this.setState({refreshing: true}, () => {
      this.getData(true);
    });
  }

  onSelectTab(activeTab) {
    this.setState({activeTab, data: []}, () => {
      this.getData(true, activeTab);
    });
  }

  render() {
    const {language} = this.props;
    const {surveys, no_survey_title, no_survey_description} =
      languages[language];

    const bgColor = EStyleSheet.value('$bgColorLight');

    const modal_radius = {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    };

    const modal_styles = StyleSheet.create({
      locationmodal: {
        height: height / 2.4,
        ...modal_radius,
        backgroundColor: bgColor,
      },
    });

    return (
      <>
        <Container>
          <Navbar
            title={surveys}
            navigation={this.props.navigation}
            handleRequestLocation={() => this.handleOpenModal('locationmodal')}
            location
            home
            add
            handleAddPress={() => this.props.navigation.navigate('SurveyForm')}
          />
          {this.state.isLoading ? (
            <View style={{flex: 1}}>
              <Loading />
            </View>
          ) : (
            <FlatList
              showsVerticalScrollIndicator={false}
              data={this.state.data}
              refreshing={this.state.refreshing}
              onRefresh={this.onRefresh.bind(this)}
              contentContainerStyle={{flexGrow: 1}}
              ListEmptyComponent={
                <View style={{flex: 1}}>
                  <Empty
                    title={no_survey_title}
                    description={no_survey_description}
                    icon="clipboard-list-outline"
                  />
                </View>
              }
              renderItem={({item}) => {
                return (
                  <SurveyItem
                    {...item}
                    onPressItem={() => this.onPressSurvey(item)}
                    showStartBtn
                    showStatus
                  />
                );
              }}
              keyExtractor={item => item.id}
            />
          )}
        </Container>
        <Modal
          style={modal_styles.locationmodal}
          ref="locationmodal"
          position={'bottom'}
          onClosingState={() => this.handleCloseModal('locationmodal')}>
          <AskPermission
            handleCloseModal={() => this.handleCloseModal('locationmodal')}
          />
        </Modal>
      </>
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

export default connect(mapPropsToState)(HomeScreen);
