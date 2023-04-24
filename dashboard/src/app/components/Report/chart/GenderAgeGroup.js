import React from "react";
import "../styles.css";
import { Bar, Pie } from "react-chartjs-2";
import toastMessage from "../../../utils/toastMessage";
import { connect } from "react-redux";
import { LoadingSpinner } from "../../LoadingSpinner";
import { colors } from "../../../constants/strings";
import { getStorage } from "../../../utils/storage";
import { ENDPOINT } from "../../../constants/api";
import axios from "axios";
import filtersHandler from "../../../utils/filtersHandler";
import { Button } from "../../Button";

const options = {
  legend: {
    position: "bottom",
    display: true,
  },
  maintainAspectRatio: false,
  offset: true,
};

class GenderAgeGroup extends React.Component {
  state = {
    data: [],
    chartData: [],
    user: {},
    user: {},
    title: "Respondents Per Gender",
    isLoading: true,
    isLoadingAgeGroup: true,
    ageGroupData: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getData(true);
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.filters !== this.props.filters) {
      this.getData(true);
    }
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  getData(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/summary/genderAgeGroup";

    let request_body = filtersHandler({
      ...this.props.filters,
    });

    const options = {
      method: "POST",
      url,
      // data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let data = res.data;

        this.handleChart(data);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  }

  handleChart(data) {
    try {
      let group = [],
        counts = [];

      for (let item of data) {
        const key = item.gender;
        if (item.gender && item.ageGroup) {
          if (!group[key]) {
            group[key] = {};
          }
          console.log("====================================");
          console.log(key);
          console.log("====================================");

          group[key] = { ...item };
        }
      }

      let labels = Object.keys(group);

      for (let el of labels) {
        counts.push(group[el].count);
      }

      let customLabels = labels.map(
        (label, index) => `${label} - ${counts[index]}`
      );

      this.setState({
        isLoading: false,
        data: {
          labels: customLabels,
          datasets: [
            {
              label: "Respondent per Age Group",
              data: counts,
              borderRadius: 15,
              backgroundColor: colors,
              borderColor: "rgba(0,0,0,1)",
              barPercentage: 0.2,
            },
          ],
        },
      });
    } catch (error) {
      toastMessage(error);
    }
  }

  returnTableHeaders() {
    return [
      {
        title: "Age Group",
        key: "ageGroup",
      },
      {
        title: "Gender",
        key: "gender",
      },
      {
        title: "Count",
        key: "count",
      },
    ];
  }

  render() {
    console.log("====================================");
    console.log(this.state.data);
    console.log("====================================");
    <div className="card-header chart-header">
      <h3>{this.state.title}</h3>
      {/* <Button
              className="btn-transparent btn-sm"
              icon="bx bx-link-external"
              onPress={() => this.props.handleOpenModal}
            /> */}
    </div>;
    return (
      <div className="chart-container">
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header chart-header">
                <h3>Respondent per Population</h3>
                <Button
                  className="btn-transparent btn-sm"
                  icon="bx bx-link-external"
                  onPress={() => this.props.handleOpenModal}
                />
              </div>

              {this.state.isLoading ? (
                <LoadingSpinner />
              ) : (
                <div className="card-body" style={{ height: 280 }}>
                  {this.state.isLoading ? (
                    <LoadingSpinner />
                  ) : (
                    <Bar data={this.state.data} options={options} />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;
  return { filters };
};

export default connect(mapStateToProps)(GenderAgeGroup);
