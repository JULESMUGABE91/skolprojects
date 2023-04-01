import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import { Doughnut } from "react-chartjs-2";

import "./styles.css";
import { getStorage } from "../../utils/storage";
import { connect } from "react-redux";

class Insight extends React.Component {
  state = {
    chart_data: [],
    isLoading: true,
    user: {},
    error: {},
    dropdown_answers: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getData(true);
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  returnFilters() {
    let request_body = {};

    if (this.props?.filters && this.props?.filters?.organization) {
      request_body.organization = this.props?.filters?.organization.value;
    }

    if (this.props?.filters && this.props?.filters?.survey) {
      request_body.survey = this.props?.filters?.survey.value;
    }

    if (this.props?.filters && this.props?.filters?.user) {
      request_body.user = this.props?.filters?.user.value;
    }

    return request_body;
  }

  getData(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/answer/insight";

    const options = {
      method: "POST",
      url,
      data: {
        ...this.returnFilters(),
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    console.log(options)

    axios(options)
      .then((res) => {
        let data = res.data;

        const chart_data = this.formatHorizontalBarChart(data);

        this.setState({
          chart_data,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  }

  formatHorizontalBarChart(data) {
    let labels = Object.keys(data),
      res = [],
      dropdown_answers = [];

    for (let el of labels) {
      let answers_data = [];

      for (let answer of Object.keys(data[el])) {
        if (data[el][answer].type === "dropdown") {
          dropdown_answers.push({
            question: el,
            answer,
            data: Object.values(data[el][answer]),
          });
        } else {
          answers_data.push(data[el][answer].count);
        }
      }

      if (answers_data.length > 0) {
        res.push({
          labels: Object.keys(data[el]),
          title: el,
          datasets: [
            {
              label: el,
              data: answers_data,
              backgroundColor: [
                "rgba(215, 35, 44, 0.8)",
                "rgba(253, 211, 0, 0.8)",
                "rgba(40,195,190,0.8)",
                "rgba(93,98,181,0.8)",
                "rgba(188,149,223,0.8)",
                "rgba(98,181,143,0.8)",
                "rgba(255,196,52,0.8)",
                "rgba(242,114,111,0.8)",
                "rgba(40,195,190,0.8)",
              ],
              borderWidth: 0,
            },
          ],
        });
      }
    }

    this.setState({ dropdown_answers });

    return res;
  }

  render() {
    return (
      <div className="row">
        {this.state.chart_data.map((chart) => {
          return (
            <div className="col-md-6" style={{ marginBottom: 15 }}>
              <div className="card" style={{ height: 400 }}>
                <div className="card-header chart_title">
                  <h1>{chart.title}</h1>
                </div>
                <div className="card-body">
                  <Doughnut
                    data={chart}
                    options={{
                      legend: { display: true, position: "left" },
                      datalabels: {
                        display: true,
                        color: "white",
                      },
                      tooltips: {
                        backgroundColor: "#5a6e7f",
                      },
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
        {this.state.dropdown_answers.map((el, t) => {
          return (
            <div className="col-md-12" style={{ marginBottom: 15 }}>
              <div className="card">
                <div className="card-header chart_title">
                  <h1>{el.question}</h1>
                </div>
                <div className="card-body">
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Answer</th>
                        <th>Selected Option</th>
                        <th>Count</th>
                      </tr>
                    </thead>
                    <tbody>
                      {el.data.map((item, i) => {
                        if (item.option) {
                          return (
                            <tr>
                              <td>{el.answer}</td>
                              <td>{item.option}</td>
                              <td>{item.count}</td>
                            </tr>
                          );
                        }
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
}

const mapPropsToState = (state) => {
  const { filters } = state.Filters;
  return {
    filters,
  };
};

export default connect(mapPropsToState)(Insight);
