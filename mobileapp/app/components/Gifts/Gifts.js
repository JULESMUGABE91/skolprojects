import React from 'react';
import styles from './styles';
import {
  FlatList,
  TouchableOpacity,
  View,
  Image,
  ImageBackground,
} from 'react-native';
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
import randomColor from '../../utils/randomColor';

class Gifts extends React.Component {
  state = {
    user: {},
    isLoading: true,
    data: [],
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user}, () => {
      this.getData(true);
    });

    socket.on('gift', () => {
      this.getData(true);
    });
  };

  getData(isLoading) {
    this.setState({isLoading, refreshing: false});

    const {user} = this.state;

    const options = {
      method: 'GET',
      url: `${ROOT_API}/gift`,
      params: {
        organization: APP_ID,
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

        this.setState({isLoading: false, refreshing: false});
      });
  }

  onRefresh() {
    this.setState({refreshing: true}, () => {
      this.getData(false);
    });
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <Navbar
            handleAddPress={() => this.props.navigation.navigate('NewGift')}
            add
            title="Zawadi"
            back
            navigation={this.props.navigation}
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
                    title="No Gift at the moment"
                    description={'Please come back later'}
                    icon="gift-open-outline"
                  />
                </View>
              }
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('NewGift', {
                        ...item,
                      })
                    }>
                    <View style={styles.gift_item}>
                      <View
                        style={[
                          styles.gift_item_image_container,
                          {backgroundColor: randomColor()},
                        ]}>
                        {item.file !== '' && item.file ? (
                          <ImageBackground
                            source={{uri: item.file}}
                            blurRadius={10}>
                            <Image
                              source={{uri: item.file}}
                              style={styles.gift_item_image}
                              resizeMode="contain"
                            />
                          </ImageBackground>
                        ) : (
                          <Text
                            type="bold"
                            style={styles.gift_item_placeholder}>
                            {item?.name?.charAt(0)}
                          </Text>
                        )}
                      </View>
                      <View style={styles.gift_item_info}>
                        <View>
                          <Text title type="bold">
                            {item.name}
                          </Text>
                        </View>
                        {item.description !== '' && item.description && (
                          <Text textDisabled>{item.description}</Text>
                        )}
                        <View style={styles.gift_item_points}>
                          <Text smtitle textDisabled>
                            Min {item.min_point}
                          </Text>
                          <View
                            style={{
                              width: 10,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}>
                            <Text>-</Text>
                          </View>
                          <Text textDisabled smtitle>
                            Max {item.max_point}
                          </Text>
                        </View>
                      </View>
                      <MaterialCommunityIcons name="chevron-right" />
                    </View>
                  </TouchableOpacity>
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

export default connect(mapPropsToState)(Gifts);
