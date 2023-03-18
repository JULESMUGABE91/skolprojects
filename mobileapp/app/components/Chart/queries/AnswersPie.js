import React from 'react';
import styles from '../styles';
import {View, Dimensions, ScrollView} from 'react-native';
import {Text} from '../../Text';
import {connect} from 'react-redux';
import {languages} from '../../../constants/localization';
import axios from 'axios';
import {ROOT_API} from '../../../constants/strings';
import LocalStorage from '../../../utils/storage';
import toastMessage from '../../../utils/toastMessage';
import moment from 'moment';
import {Loading} from '../../Loading';

import {PieChart} from 'react-native-chart-kit';
const screenWidth = Dimensions.get('window').width;

const chartConfig = {
  backgroundGradientFrom: '#fff',
  backgroundGradientFromOpacity: 1,
  backgroundGradientTo: '#fff',
  backgroundGradientToOpacity: 1,
  color: (opacity = 1) => `rgba(0, 0, 0, 0.8)`,
  strokeWidth: 3, // optional, default 3
  barPercentage: 0.8,
  useShadowColorFromDataset: false, // optional
  fillShadowGradientFrom: '#d7232c',
  fillShadowGradientTo: '#d7232c',
  fillShadowGradientToOpacity: 0.1,
  fillShadowGradientFromOpacity: 0.1,
  decimalPlaces: 0,
  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
};

class AnswersPie extends React.Component {
  state = {
    isLoading: true,
    data: {},
  };

  componentDidMount = async () => {
    const user = await new LocalStorage().get();

    this.setState({user}, () => {
      this.getData(true);
    });
  };

  getData = async isLoading => {
    this.setState({isLoading});

    const {user} = this.state;

    console.log(this.props);

    const options = {
      method: 'POST',
      url: `${ROOT_API}/answer/fetch`,
      data: {
        ...this.props.filters,
      },
      headers: {
        authorization: `Bearer ${user.token}`,
      },
    };

    axios(options)
      .then(data => {
        if (data.data.length > 0) {
          let group_data = {};

          for (let el of data.data) {
            const question = el.question._id + '__' + el.question.question;
            if (!group_data[question]) {
              group_data[question] = [];
            }

            group_data[question].push(el);
          }

          for (let el of Object.keys(group_data)) {
            let group_answers = {};

            for (let el_an of group_data[el] || []) {
              for (let an of el_an.answers) {
                let an_key = an._id + '___' + an.option;
                if (!group_answers[an_key]) {
                  group_answers[an_key] = 0;
                }

                group_answers[an_key] = group_answers[an_key] + 1;
              }
            }

            group_data[el]['group_answers'] = group_answers;
          }

          let chart_data = {};

          for (let el of Object.keys(group_data)) {
            const randomNum = () =>
              Math.floor(Math.random() * (235 - 52 + 1) + 52);

            const randomRGB = () =>
              `rgb(${randomNum()}, ${randomNum()}, ${randomNum()})`;

            if (!chart_data[el]) {
              chart_data[el] = [];
            }

            for (let an of Object.keys(group_data[el].group_answers)) {
              // let split_a = an.split('___');
              chart_data[el].push({
                name: an.split('___')[1],
                population: group_data[el].group_answers[an],
                color: randomRGB(),
                legendFontColor: '#7F7F7F',
                legendFontSize: 15,
              });
            }
          }

          this.setState({
            data: chart_data,
          });
        }

        this.setState({
          isLoading: false,
        });
      })
      .catch(error => {
        toastMessage(error);

        this.setState({isLoading: false});
      });
  };

  render() {
    const {language} = this.props;
    const {} = languages[language];
    return (
      <View style={{flex: 1}}>
        {this.state.isLoading ? (
          <Loading />
        ) : (
          Object.keys(this.state.data).map((question, c) => {
            return (
              <View style={styles.chart_content} key={c}>
                <View style={styles.header}>
                  <Text type="bold">{question.split('__')[1]}</Text>
                </View>
                <ScrollView
                  horizontal
                  style={{backgroundColor: 'white', height: 200}}>
                  {/* <View
                    style={{width: 1300, height: 200, backgroundColor: 'red'}}> */}
                  <PieChart
                    data={this.state.data[question]}
                    width={screenWidth}
                    height={200}
                    chartConfig={chartConfig}
                    accessor={'population'}
                    backgroundColor={'#fff'}
                    paddingLeft={'15'}
                    avoidFalseZero
                  />
                  {/* </View> */}
                </ScrollView>
              </View>
            );
          })
        )}
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

export default connect(mapPropsToState)(AnswersPie);
