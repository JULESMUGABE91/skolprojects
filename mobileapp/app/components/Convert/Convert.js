import React from 'react';
import styles from './styles';
import {View} from 'react-native';
import {Text} from '../Text';
import Feather from 'react-native-vector-icons/Feather';
import {connect} from 'react-redux';
import {languages} from '../../constants/localization';
import axios from 'axios';
import {ROOT_API} from '../../constants/strings';
import LocalStorage from '../../utils/storage';
import {Loading} from '../Loading';
import toastMessage from '../../utils/toastMessage';
import {Button} from '../Button';
import {Input} from '../Input';
import QRCode from 'react-native-qrcode-svg';

class Convert extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isGenerating: true,
      data: [],
      balance: '',
      error: {},
    };
  }

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user, balance: this.props.balance});
  };

  onChangeText(field, e) {
    let {error, balance} = this.state;
    let {total_balance} = this.props;
    delete error[field];

    if (field === 'balance' && balance <= total_balance) {
      this.setState({
        [field]: e,
        error,
      });
    } else if (field === 'balance') {
      this.setState({
        balance: total_balance,
        error,
      });
    } else {
      this.setState({
        [field]: e,
        error,
      });
    }
  }

  render() {
    const {language} = this.props;
    const {} = languages[language];

    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.header_title} type="bold">
            Purchase from Point
          </Text>
        </View>
        <View style={styles.content}>
          <Input
            label="Points"
            placeholder="Balance"
            value={this.state.balance + ''}
            onChangeText={e => this.onChangeText('balance', e)}
            keyboardType="number-pad"
          />
          <View style={styles.qr_container}>
            <Text type="bold" style={{marginVertical: 20}}>
              Scan QR
            </Text>
            <QRCode
              value={
                this.props?.selected_gift?.image + '_____' + this.state.balance
              }
            />
          </View>
        </View>
      </View>
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

export default connect(mapPropsToState)(Convert);
