import React from 'react';
import styles from '../styles';
import {View, Dimensions} from 'react-native';
import {Text} from '../../Text';
import {connect} from 'react-redux';
import {languages} from '../../../constants/localization';
import axios from 'axios';
import {ROOT_API} from '../../../constants/strings';
import LocalStorage from '../../../utils/storage';
import toastMessage from '../../../utils/toastMessage';
import moment from 'moment';
import {Loading} from '../../Loading';
// import PureChart from 'react-native-pure-chart';
import {BarChart} from 'react-native-gifted-charts';
import randomColor from '../../../utils/randomColor';

const {width} = Dimensions.get('window');

class AnswersChart extends React.Component {
  state = {
    isLoading: false,
    data: {},
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user}, () => {
      this.getData(true);
    });
  };

  getData(isLoading) {
    this.setState({isLoading});

    const {user} = this.state;

    const options = {
      method: 'POST',
      url: `${ROOT_API}/answer/fetch`,
      data: {
        ...this.props.filters,
        sort: 'asc',
      },
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    axios(options)
      .then(data => {
        if (data.data.length > 0) {
          let group_data = [];

          for (let el of data.data) {
            const date = moment(el.createdAt).format('lll');

            if (!group_data[date]) {
              group_data[date] = 0;
            }

            group_data[date] = group_data[date] + 1;
          }

          let results = [];

          for (let key of Object.keys(group_data)) {
            results.push({
              label: key,
              value: group_data[key],
              frontColor: randomColor(),
              topLabelComponent: () => (
                <View
                  style={{
                    height: 15,
                    backgroundColor: this.props.accent_color,
                    borderRadius: 10,
                    marginBottom: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    paddingHorizontal: 4,
                  }}>
                  <Text
                    type={'bold'}
                    style={{
                      color: this.props.primary_color,
                      fontSize: 8,
                    }}>
                    {group_data[key]}
                  </Text>
                </View>
              ),
              labelComponent: () => (
                <Text
                  style={{
                    fontSize: 10,
                    position: 'absolute',
                    width: 200,
                    top: -18,
                  }}>
                  {key}
                </Text>
              ),
            });
          }
          this.setState({
            data: results,
          });
        }

        this.setState({
          isLoading: false,
        });
      })
      .catch(error => {
        console.log(error.response.data);
        toastMessage(error);

        this.setState({isLoading: false});
      });
  }

  render() {
    const {language} = this.props;
    const {} = languages[language];

    return (
      <View>
        {Object.keys(this.state.data).length > 0 && (
          <View style={styles.header}>
            <Text type="bold">Responses per Day</Text>
          </View>
        )}
        <View style={[styles.chart_content]}>
          {this.state.isLoading ? (
            <Loading />
          ) : (
            this.state.data.length > 0 && (
              <BarChart
                // barBorderRadius={4}
                data={this.state.data}
                width={width}
                // rotateLabel
                // spacing={40}
                isAnimated
              />
            )
          )}
        </View>
      </View>
    );
  }
}

const mapPropsToState = state => {
  const {language} = state.Language;
  const {primary_color, accent_color} = state.Theme;
  return {
    language,
    primary_color,
    accent_color,
  };
};

export default connect(mapPropsToState)(AnswersChart);
