import React from "react";
import "../styles.css";
import { Pie } from "react-chartjs-2";
import toastMessage from "../../../utils/toastMessage";
import { connect } from "react-redux";
import { LoadingSpinner } from "../../LoadingSpinner";
import { colors } from "../../../constants/strings";
import { Button } from "../../Button";
import { getStorage } from "../../../utils/storage";
import { ENDPOINT } from "../../../constants/api";
import axios from "axios";
import filtersHandler from "../../../utils/filtersHandler";
import Respondents from "./../../Respondent/Respondents";

const options = {
  legend: {
    position: "bottom",
    display: true,
  },
  maintainAspectRatio: false,
  offset: true,
};

class Gender extends React.Component {
  state = {
    data: [],
    chartData: [],
    user: {},
    user: {},
    title: "Respondents Per Gender",
    isLoadingGender: true,
    isLoadingAgeGroup: true,
    ageGroupData: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getRegionGenderData(true);
    this.getRegionGenderAgeGroupData(true);
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.filters !== this.props.filters) {
      this.getRegionGenderData(true);
      this.getRegionGenderAgeGroupData(true);
    }
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  getRegionGenderData(isLoadingGender) {
    const { user } = this.state;

    this.setState({
      isLoadingGender,
    });

    let url = ENDPOINT + "/summary/regionGender";

    let request_body = filtersHandler({
      ...this.props.filters,
    });

    const options = {
      method: "POST",
      url,
      data: request_body,
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

  getRegionGenderData(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/summary/regionGender";

    let request_body = filtersHandler({
      ...this.props.filters,
    });

    const options = {
      method: "POST",
      url,
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let data = res.data;

        this.handleGenderChart(data);
      })
      .catch((error) => {
        this.setState({
          isLoadingGender: false,
        });

        toastMessage("error", error);
      });
  }

  handleGenderChart(data) {
    let results = [];

    for (let dataKey of Object.keys(data)) {
      let dataItem = data[dataKey];

      let counts = [],
        labels = Object.keys(dataItem);

      for (let el of labels) {
        counts.push(dataItem[el]);
      }

      let customLabels = labels.map(
        (label, index) => `${label} - ${counts[index]}`
      );

      let chart = {
        labels: customLabels,
        title: dataKey,
        datasets: [
          {
            label: dataKey,
            data: counts,
            backgroundColor: colors,
          },
        ],
      };

      results.push(chart);
    }

    this.setState({
      isLoadingGender: false,
      data: results,
    });
  }

  getRegionGenderAgeGroupData(isLoadingAgeGroup) {
    const { user } = this.state;

    this.setState({
      isLoadingAgeGroup,
    });

    let url = ENDPOINT + "/summary/regionGenderAgeGroup";

    let request_body = filtersHandler({
      ...this.props.filters,
    });

    const options = {
      method: "POST",
      url,
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let data = res.data;

        this.setState({
          ageGroupData: data,
          isLoadingAgeGroup: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoadingAgeGroup: false,
        });

        toastMessage("error", error);
      });
  }

  render() {
    console.log("====================================");
    console.log(this.state.ageGroupData);
    console.log("====================================");
    // <div className="card-header chart-header">
    //         <h3>{this.state.title}</h3>
    //         {/* <Button
    //           className="btn-transparent btn-sm"
    //           icon="bx bx-link-external"
    //           onPress={() => this.props.handleOpenModal}
    //         /> */}
    //       </div>
    return (
      <div className="chart-container">
        <div className="col-md-12">
          <div className="row">
            {this.state.isLoadingGender ? (
              <LoadingSpinner />
            ) : (
              this.state.data.map((chart, c) => {
                return (
                  <div className="col-md-3" key={c}>
                    <div className="card">
                      <div className="card-header chart-header">
                        <h3>{chart.title}</h3>
                      </div>
                      <div className="card-body" style={{ height: 280 }}>
                        <Pie data={chart} options={options} />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
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

export default connect(mapStateToProps)(Gender);
