import React from 'react';
import {TouchableOpacity, View} from 'react-native';
import styles from './styles';

import DatePicker from 'react-native-date-picker';

class DateRange extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      date: this.props.date || new Date(),
    };
  }

  setOpen(open) {
    this.setState({open});
  }

  setDate(date) {
    this.setState({date});
  }
  render() {
    return (
      <View style={styles.date_container}>
        <DatePicker
          modal
          open={this.state.open}
          date={this.state.date}
          onConfirm={date => {
            this.setOpen(false);
            this.setDate(date);
          }}
          onCancel={() => {
            setOpen(false);
          }}
        />
      </View>
    );
  }
}

export default DateRange;
