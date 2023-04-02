import React from "react";
import "./styles.css";
import { Bar, Doughnut, Pie } from "react-chartjs-2";
import { getStorage } from "../../utils/storage";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import { connect } from "react-redux";
import { LoadingSpinner } from "../LoadingSpinner";
import { colors } from "../../constants/strings";
import filtersHandler from "../../utils/filtersHandler";

const options = {
  legend: {
    position: "left",
    display: true,
  },
  maintainAspectRatio: false,
  offset: true,
};

class AnswerInsight extends React.Component {
  state = {
    data: {},
    user: {},
    selected_alert: {},
    user: {},
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    await this.getData(true);
  };

  componentDidUpdate(prevProps) {
    if (this.state.user.token && prevProps.filters !== this.props.filters) {
      this.getData(true);
    }
  }

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

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/insight",
      data: filtersHandler(this.props.filters),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const data = res.data;

        let results = {};

        for (let key of Object.keys(data)) {
          if (data[key].question_type === "dropdown") {
            results[key] = data[key];
          } else {
            results[key] = this.formatChart(data[key], key);
          }
        }

        this.setState({
          isLoading: false,
          data: results,
        });
      })
      .catch((error) => {
        console.log(error);
        toastMessage("error", error);
        this.setState({ isLoading: false });
      });
  }

  formatChart(data, key) {
    let chart_data = [],
      counts = [],
      labels = Object.keys(data);

    for (let el of labels) {
      chart_data.push(data[el].percentage);
      counts.push(data[el].count);
    }

    let customLabels = labels.map(
      (label, index) => `${label} - ${counts[index]}: ${chart_data[index]}%`
    );

    return {
      labels: customLabels,
      datasets: [
        {
          label: key,
          data: chart_data,
          backgroundColor: colors,
        },
      ],
    };
  }

  returnChartList(data) {
    return (
      <ul className="chart-list">
        {data &&
          data.map((item, i) => {
            let title = item.split(":");
            return (
              <li key={i}>
                <div style={{ flex: 1, marginRight: 20 }}>
                  <span className="title">{title[0]}</span>
                </div>

                <span className="number">
                  <b>{title[1]}</b>
                </span>
              </li>
            );
          })}
      </ul>
    );
  }

  render() {
    return (
      <div className="chart-container row">
        {this.state.isLoading && <LoadingSpinner />}
        {Object.keys(this.state.data).length > 0
          ? Object.keys(this.state.data).map((q, i) => {
              if (this.state.data[q].question_type === "dropdown") {
                return (
                  <div className="card" key={i} style={{ marginBottom: 15 }}>
                    <div className="card-header">
                      <h3>{q}</h3>
                    </div>
                    <div className="card-body">
                      <div className="row">
                        {Object.keys(this.state.data[q]).map((head, h) => {
                          if (
                            head !== "question_type" &&
                            head !== "total_respondent"
                          ) {
                            let labels = Object.keys(
                              this.state?.data[q][head]?.data || []
                            );

                            let chart_data = [],
                              counts = [];

                            for (let row of Object.keys(
                              this.state?.data[q][head]?.data || []
                            )) {
                              chart_data.push(
                                Math.round(
                                  (this.state?.data[q][head]?.data[row]?.count /
                                    this.state.data[q].total_respondent) *
                                    100
                                )
                              );

                              counts.push(
                                this.state?.data[q][head]?.data[row]?.count
                              );
                            }

                            let customLabels = labels.map(
                              (label, index) =>
                                `${label} - ${counts[index]}: ${chart_data[index]}%`
                            );

                            let chart = {
                              labels: customLabels,
                              datasets: [
                                {
                                  label: head,
                                  data: chart_data,
                                  backgroundColor: colors,
                                },
                              ],
                            };

                            return (
                              <div
                                key={h}
                                className="col-md-6 well gap-1"
                                style={{
                                  marginBottom: 10,
                                  border: "1px solid #f2f2f2",
                                }}
                              >
                                <div className="card-body">
                                  <p key={h}>
                                    <b>{head}</b>
                                  </p>
                                  <div
                                    className="card-body"
                                    style={{ height: 280 }}
                                  >
                                    <Bar
                                      data={chart}
                                      options={{
                                        scales: {
                                          xAxes: [
                                            {
                                              barThickness: 30,
                                            },
                                          ],
                                          yAxes: [
                                            {
                                              ticks: {
                                                beginAtZero: true,
                                                min: 0,
                                              },
                                            },
                                          ],
                                        },
                                      }}
                                    />
                                  </div>
                                  {/* {this.returnChartList(customLabels)} */}
                                </div>
                              </div>
                            );
                          }
                        })}
                      </div>
                    </div>
                  </div>
                );
              }
              return (
                <div className="col-md-6">
                  <div className="card" key={i} style={{ marginBottom: 15 }}>
                    <div className="card-header">
                      <h3>{q}</h3>
                    </div>
                    <div className="card-body" style={{ height: 280 }}>
                      <Doughnut data={this.state.data[q]} options={options} />
                    </div>
                  </div>
                </div>
              );
            })
          : !this.state.isLoading && (
              <div className="alert alert-info">
                <div className="card-body">
                  <span>
                    No answers from{" "}
                    {this.props.filters &&
                      this.props.filters.survey &&
                      this.props.filters.survey.label}
                  </span>
                </div>
              </div>
            )}
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;
  return { filters };
};

export default connect(mapStateToProps)(AnswerInsight);
