import React from 'react';
import styles from './styles';
import {
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {Text} from '../Text';
import Feather from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import axios from 'axios';
import {APP_ID, ROOT_API} from '../../constants/strings';
import LocalStorage from '../../utils/storage';
import {Loading} from '../Loading';
import toastMessage from '../../utils/toastMessage';
import {Button} from '../Button';
import {VirtualizedList} from '../VirtualizedList';
import socket from '../../utils/socket';
import Modal from 'react-native-modalbox';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Convert} from '../Convert';
import randomColor from '../../utils/randomColor';

const {height} = Dimensions.get('screen');
class Reward extends React.Component {
  state = {
    isLoading: true,
    data: [],
    balance: 0,
    refreshing: true,
    selected_gift: {},
    gifts: [],
  };

  componentDidMount = async () => {
    this.handleFetch(true);

    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.handleFetch(false);
      },
    );

    socket.on('answer', () => {
      this.handleFetch(false);
    });
  };

  handleFetch = async isLoading => {
    const user = await new LocalStorage().get();

    this.setState({user}, () => {
      this.fetchData(isLoading);
    });
  };

  fetchData = async isLoading => {
    await this.getData(isLoading);
    await this.getGifts(isLoading);
  };

  getGifts(isLoadingGifts) {
    this.setState({isLoadingGifts, refreshing: false});

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

    return axios(options)
      .then(data => {
        this.setState({
          isLoadingGifts: false,
          gifts: data.data,
          refreshing: false,
        });
      })
      .catch(error => {
        toastMessage(error);

        this.setState({isLoadingGifts: false, refreshing: false});
      });
  }

  getData(isLoading) {
    this.setState({isLoading});

    const {user} = this.state;

    let body = {
      user: user.user_id,
      organization: APP_ID,
    };

    const options = {
      method: 'POST',
      url: `${ROOT_API}/reward/fetch`,

      data: body,
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    return axios(options)
      .then(data => {
        if (data.data.length > 0) {
          this.setState({balance: Math.round(data.data[0].total_reward)});
        }
        this.setState({isLoading: false, refreshing: false});
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

  onSelectGift(selected_gift) {
    this.setState({selected_gift});
  }

  handleOpenModal(modal, params) {
    this.refs[modal].open();

    this.setState({convert_data: params});
  }

  handleCloseModal(modal) {
    this.refs[modal].close();
  }

  convertGift() {
    const {selected_gift, balance} = this.state;

    if (!selected_gift._id) return toastMessage('Please select your gift');
    if (balance === 0) return toastMessage("You don't have enough points");

    this.handleOpenModal('convertModal', {
      balance,
      selected_gift,
    });
  }

  render() {
    const {language} = this.props;
    const {your_balance, points, available_points, convert} =
      languages[language];

    const gifts = [
      {
        image:
          'https://res.cloudinary.com/dwqhmch33/image/upload/v1676551765/skol/skol_malt.png',
        maxPoints: 10,
      },
      {
        image:
          'https://res.cloudinary.com/dwqhmch33/image/upload/v1676551801/skol/lager.png',
        maxPoints: 10,
      },
      {
        image:
          'https://res.cloudinary.com/dwqhmch33/image/upload/v1676551835/skol/Gatanu.png',
        maxPoints: 10,
      },
      {
        image:
          'https://www.skolbrewery.rw/wp-content/uploads/2017/11/virunga-gold.png',
        maxPoints: 10,
      },
      {
        image:
          'https://res.cloudinary.com/dwqhmch33/image/upload/v1676551869/skol/Panache.png',
        maxPoints: 10,
      },
    ];

    const bgColor = EStyleSheet.value('$bgColorLight');

    const modal_radius = {
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    };

    const modal_styles = StyleSheet.create({
      convertModal: {
        height: height / 2.4,
        ...modal_radius,
        backgroundColor: bgColor,
      },
    });

    return (
      <>
        <VirtualizedList
          refreshing={this.state.refreshing}
          onRefresh={this.onRefresh.bind(this)}
          style={{paddingHorizontal: 0}}>
          {this.state.isLoading ? (
            <View style={{flex: 1}}>
              <Loading />
            </View>
          ) : (
            <View>
              <View style={styles.card}>
                <View style={styles.title_container}>
                  <Text style={{flex: 1}}>{your_balance}</Text>
                  <Text primary type="bold">
                    {this.state.balance} {points}
                  </Text>
                </View>

                <View style={styles.card_container}>
                  <View style={styles.card_header}>
                    <Image
                      source={require('../../assets/logo.png')}
                      style={styles.logo}
                    />
                  </View>
                  <View style={styles.card_content}>
                    <Text title style={styles.balance_x} primary type="bold">
                      {this.state.balance} {points}
                    </Text>
                    <Text primary style={{opacity: 0.5}}>
                      {available_points}
                    </Text>
                  </View>
                </View>

                <View style={styles.convertion_container}>
                  <Text>
                    {this.state.balance} {points}
                  </Text>
                  <View style={styles.convert_serparator}>
                    <Feather
                      name="arrow-right"
                      style={styles.right_icon_convertion}
                    />
                  </View>
                  <Text type="bold" primary>
                    0 Skol
                  </Text>
                </View>
              </View>
              {this.state.isLoading ? (
                <Loading />
              ) : (
                this.state.gifts.length > 0 && (
                  <>
                    <View style={styles.gift_container}>
                      <View style={styles.gifttitle_container}>
                        <Text type="bold" style={styles.choose_gift}>
                          Choose Gift
                        </Text>
                      </View>
                      <View style={{padding: 15}}>
                        <FlatList
                          horizontal
                          showsHorizontalScrollIndicator={false}
                          data={this.state.gifts}
                          renderItem={({item}) => {
                            return (
                              <TouchableOpacity
                                onPress={() => this.onSelectGift(item)}>
                                <View
                                  style={[
                                    styles.gift_item,
                                    this.state.selected_gift._id ===
                                      item._id && {
                                      borderWidth: 2,
                                      borderColor: this.props.primary_color,
                                    },
                                  ]}>
                                  <View
                                    style={{
                                      flex: 1,
                                      alignItems: 'center',
                                      justifyContent: 'center',
                                    }}>
                                    {item.file !== '' && item.file ? (
                                      <ImageBackground
                                        source={{uri: item.file}}
                                        style={styles.gift_item_image_bg}
                                        blurRadius={100}
                                        resizeMode="cover">
                                        <Image
                                          source={{uri: item.file}}
                                          style={styles.gift_item_image}
                                          resizeMode="contain"
                                        />
                                      </ImageBackground>
                                    ) : (
                                      <View
                                        style={[
                                          styles.gift_item_image,
                                          {backgroundColor: randomColor()},
                                        ]}>
                                        <Text
                                          type={'bold'}
                                          style={styles.gift_item_name}>
                                          {item?.name.charAt()}
                                        </Text>
                                      </View>
                                    )}
                                  </View>
                                  <View style={styles.gift_item__footer}>
                                    <Text type="bold">{item.name}</Text>
                                  </View>
                                </View>
                              </TouchableOpacity>
                            );
                          }}
                          keyExtractor={item => item.id}
                        />
                      </View>
                    </View>

                    <View
                      style={{
                        // padding: 20,
                        // paddingBottom: 30,
                        backgroundColor: '#fff',
                        paddingHorizontal: 20,
                        paddingVertical: 15,
                      }}>
                      <Button
                        text={convert}
                        onPress={this.convertGift.bind(this)}
                      />
                    </View>
                  </>
                )
              )}
            </View>
          )}
        </VirtualizedList>
        <Modal
          style={modal_styles.convertModal}
          ref="convertModal"
          position={'bottom'}
          onClosingState={() => this.handleCloseModal('convertModal')}>
          <Convert
            handleCloseModal={() => this.handleCloseModal('convertModal')}
            balance={this.state.balance}
            total_balance={this.state.balance}
            selected_gift={this.state.selected_gift}
          />
        </Modal>
      </>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {primary_color} = state.Theme;
  return {
    language,
    primary_color,
  };
};

export default connect(mapPropsToState)(Reward);
