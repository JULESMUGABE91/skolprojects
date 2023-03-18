import React from 'react';
import styles from './styles';
import {FlatList, TouchableOpacity, View} from 'react-native';
import {Text} from '../Text';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {connect} from 'react-redux';
import LocalStorage from '../../utils/storage';
import axios from 'axios';
import {APP_ID, ROOT_API} from '../../constants/strings';
import toastMessage from '../../utils/toastMessage';
import socket from '../../utils/socket';
import {Button} from '../Button';
import {Input} from '../Input';
import {Navbar} from '../Navbar';
import DatePicker from 'react-native-date-picker';
import moment from 'moment';
import SurveyItem from '../Survey/SurveyItem';
import {Empty} from '../Empty';
import {Loading} from '../Loading';
import {languages} from '../../constants/localization';

class SurveyHistory extends React.Component {
  state = {
    user: {},
    isLoading: true,
    data: [],
    start_date: moment().subtract(1, 'months').format('YYYY-MM-DD'),
    end_date: moment().add('d', 1).format('YYYY-MM-DD'),
    refreshing: false,
    start_open: false,
    end_open: false,
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user}, () => {
      this.getData(true);
    });

    socket.on('answer', () => {
      this.getData(true);
    });
  };

  setOpen(field, open) {
    console.log({field, open});
    this.setState({[field]: open});
  }

  setDate(field, date) {
    this.setState({[field]: moment(date).format('YYYY-MM-DD')}, () => {
      this.getData(true);
    });
  }

  getData(isLoading) {
    this.setState({isLoading, refreshing: false});

    const {user, start_date, end_date} = this.state;

    const options = {
      method: 'GET',
      url: `${ROOT_API}/user/survey`,
      params: {
        organization: APP_ID,
        user: this.state.user.user_id,
        start_date,
        end_date,
      },
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    axios(options)
      .then(data => {
        this.setState({
          isLoading: false,
          data: data.data,
          refreshing: false,
        });
      })
      .catch(error => {
        toastMessage(error);

        console.log(error);
        console.log(error.response);

        this.setState({isLoading: false, refreshing: false});
      });
  }

  onRefresh() {
    this.setState({refreshing: true}, () => {
      this.getData(false);
    });
  }

  render() {
    const {language} = this.props;
    const {no_survey_title, no_survey_description} = languages[language];

    return (
      <>
        <View style={styles.container}>
          <Navbar
            title="Survey History"
            back
            navigation={this.props.navigation}
          />
          <View style={styles.date_range}>
            <Input
              placeholder="Start Date"
              value={this.state.start_date}
              clickable
              onInputPressed={() => this.setOpen('start_open', true)}
              onPressRight={() => this.setOpen('start_open', true)}
              rightIcon="calendar"
            />
            <Input
              placeholder="Start Date"
              value={this.state.end_date}
              clickable
              onInputPressed={() => this.setOpen('end_open', true)}
              onPressRight={() => this.setOpen('end_open', true)}
              rightIcon="calendar"
            />
            <DatePicker
              modal
              open={this.state.start_open}
              date={new Date(this.state.start_date)}
              onConfirm={date => {
                this.setOpen('start_open', false);
                this.setDate('start_date', date);
              }}
              onCancel={() => {
                this.setOpen('start_open', false);
              }}
            />
            <DatePicker
              modal
              open={this.state.end_open}
              date={new Date(this.state.end_date)}
              onConfirm={date => {
                this.setOpen('end_open', false);
                this.setDate('end_date', date);
              }}
              onCancel={() => {
                this.setOpen('end_open', false);
              }}
            />
          </View>
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
                    {...item.survey}
                    showDate
                    // showResult
                    onPressItem={() =>
                      this.props.navigation.navigate('Dashboard', {
                        survey_id: item.survey._id,
                        survey_title: item.survey.title,
                      })
                    }
                  />
                );
              }}
              keyExtractor={item => item.id}
            />
          )}
        </View>
      </>
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

export default connect(mapPropsToState)(SurveyHistory);
