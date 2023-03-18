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
import {Navbar} from '../Navbar';
import {Empty} from '../Empty';
import {Loading} from '../Loading';
import randomColor from '../../utils/randomColor';

class Providers extends React.Component {
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

    socket.on('provider', () => {
      this.getData(true);
    });
  };

  getData(isLoading) {
    this.setState({isLoading, refreshing: false});

    const {user} = this.state;

    const options = {
      method: 'GET',
      url: `${ROOT_API}/provider`,
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

  handleItemSelected(item) {
    console.log(this.props);
    if (this.props?.getSelectedItem) {
      this.props?.getSelectedItem({
        ...item,
      });
      this.props.handleCloseModal();
    } else {
      this.props.navigation.navigate('NewProvider', {
        ...item,
      });
    }
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
            handleAddPress={() => this.props.navigation.navigate('NewProvider')}
            add
            title="Gift Providers"
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
                    title="No provider available at the moment"
                    description={'Please come back later'}
                    icon="home-city-outline"
                  />
                </View>
              }
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => this.handleItemSelected(item)}>
                    <View style={styles.provider_item}>
                      <View
                        style={[
                          styles.provider_item_image_container,
                          {backgroundColor: randomColor()},
                        ]}>
                        {item.file !== '' && item.file ? (
                          <ImageBackground
                            source={{uri: item.file}}
                            blurRadius={300}
                            style={{borderRadius: 8}}>
                            <Image
                              source={{uri: item.file}}
                              style={styles.provider_item_image}
                              resizeMode="center"
                            />
                          </ImageBackground>
                        ) : (
                          <Text
                            type="bold"
                            style={styles.provider_item_placeholder}>
                            {item?.name?.charAt(0)}
                          </Text>
                        )}
                      </View>
                      <View style={styles.provider_item_info}>
                        <View>
                          <Text type="bold">{item.name}</Text>
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

export default connect(mapPropsToState)(Providers);
