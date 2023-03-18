import React from 'react';
import {Image, View, FlatList} from 'react-native';
import {connect} from 'react-redux';
import styles from './styles';
import {languages} from '../../constants/localization';
import {Input} from '../Input';
import {ListItem} from '../List';
import {Provinces, Districts, Sectors, Cells, Villages} from 'rwanda';
import {Back} from '../Back';

let copyData = [];

class Rwanda extends React.Component {
  state = {
    type: '',
    search_text: '',
    data: [],
  };

  componentDidMount() {
    this.getData(this.props?.params?.type || 'province');
  }

  getData(type) {
    let data = [];
    if (type === 'province') {
      data = Provinces();
    }

    if (type === 'district') {
      data = Districts(this.props?.params?.province);
    }

    if (type === 'sector') {
      data = Sectors(
        this.props?.params?.province,
        this.props?.params?.district,
      );
    }

    if (type === 'cell') {
      data = Cells(
        this.props?.params?.province,
        this.props?.params?.district,
        this.props?.params?.sector,
      );
    }

    if (type === 'village') {
      data = Villages(
        this.props?.params?.province,
        this.props?.params?.district,
        this.props?.params?.sector,
        this.props?.params?.cell,
      );
    }

    copyData = data.slice(0);

    this.setState({data});
  }

  onSearch(e) {
    this.setState({search_text: e});

    let data = [];

    for (let item of copyData) {
      if (item.toLowerCase().indexOf(e.toLowerCase()) !== -1) {
        data.push(item);
      }
    }

    this.setState({
      data,
    });
  }

  onSelect(item) {
    if (this.props?.params?.onSelect) {
      this.props?.params?.onSelect(
        this.props?.params?.type || 'province',
        item,
      );

      this.props.navigation.goBack();
    }
  }

  onClearSearch() {
    this.setState({
      search_text: '',
      data: copyData,
    });
  }

  render() {
    const {language} = this.props;
    const {search_text} = languages[language];
    return (
      <View style={styles.container}>
        <>
          <View style={styles.header}>
            <Back goBack={() => this.props.navigation.goBack()} />
            <View style={{flex: 1}}>
              <Input
                placeholder={search_text}
                search_text={this.state.search_text}
                onChangeText={e => this.onSearch(e)}
                clear
                onClear={this.onClearSearch.bind(this)}
              />
            </View>
          </View>
          <FlatList
            data={this.state.data}
            keyboardShouldPersistTaps="always"
            renderItem={({item}) => {
              return (
                <ListItem
                  title={item}
                  onPress={this.onSelect.bind(this, item)}
                  background
                  right_icon="chevron-right"
                />
              );
            }}
            keyExtractor={item => item.id}
          />
        </>
      </View>
    );
  }
}

const mapPropsToState = state => {
  const {primary_color} = state.Theme;
  const {language} = state.Language;
  return {
    primary_color,
    language,
  };
};

export default connect(mapPropsToState)(Rwanda);
