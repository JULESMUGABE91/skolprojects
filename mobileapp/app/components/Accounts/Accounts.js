import React from 'react';
import styles from './styles';
import {FlatList, TouchableOpacity, View, Image} from 'react-native';
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
import {Input} from '../Input';
import randomColor from '../../utils/randomColor';

let copyData = [];

class Accounts extends React.Component {
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

    socket.on('user', () => {
      this.getData(false);
    });

    this.focusListener = this.props.navigation.addListener(
      'focus',
      async () => {
        this.getData(true);
      },
    );
  };

  getData(isLoading) {
    this.setState({isLoading, refreshing: false});

    const {user} = this.state;

    let body = {
      organization: APP_ID,
    };

    const options = {
      method: 'POST',
      url: `${ROOT_API}/user/fetch`,
      data: body,
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

        copyData = data.data.slice(0);
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

  handleSearch(e) {
    let text = e,
      array = [];

    this.setState({search_text: text});

    for (let el of copyData) {
      console.log(el);
      if (JSON.stringify(el).toLowerCase().indexOf(text.toLowerCase()) !== -1) {
        array.push(el);
      }
    }

    this.setState({data: array});
  }

  render() {
    return (
      <>
        <View style={styles.container}>
          <Navbar
            handleAddPress={() => this.props.navigation.navigate('NewProvider')}
            title="Accounts"
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
              ListHeaderComponent={
                <View style={styles.search_container}>
                  <Input
                    placeholder="Search..."
                    value={this.state.search_text}
                    onChangeText={this.handleSearch.bind(this)}
                    leftIcon="search"
                  />
                </View>
              }
              ListEmptyComponent={
                <View style={{flex: 1}}>
                  <Empty
                    title="No available at the moment"
                    description="Accounts will be listed here"
                    icon="user"
                  />
                </View>
              }
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate('AccountInfo', {...item})
                    }>
                    <View style={styles.account_item}>
                      <View
                        style={[
                          styles.account_item_image_container,
                          {backgroundColor: randomColor()},
                        ]}>
                        {item.file !== '' && item.file ? (
                          <Image
                            source={{uri: item.file}}
                            style={styles.account_item_image}
                          />
                        ) : (
                          <Text
                            type="bold"
                            style={styles.account_item_placeholder}>
                            {item?.name
                              ? item.name.charAt()
                              : item.firstname
                              ? item.firstname.charAt(0)
                              : ''}
                          </Text>
                        )}
                      </View>
                      <View style={styles.account_item_info}>
                        <View style={styles.account_item_info}>
                          <Text type="bold" sbtitle>
                            {item.name
                              ? item.name
                              : item.firstname
                              ? item.firstname + ' ' + item.lastname
                              : item.phone}
                          </Text>
                          <View style={styles.item_type_container}>
                            <View style={styles.type_item}>
                              <Text style={styles.type_txt}>
                                {item.account_type}
                              </Text>
                            </View>
                            <View style={styles.type_item}>
                              <Text style={styles.type_txt}>{item.badge}</Text>
                            </View>
                          </View>
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

export default connect(mapPropsToState)(Accounts);
