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
import { Select } from "../Input";
import { onFilter } from "../../action/Filters";

const questions = [
  { label: "Do you have 15 min to answer some questions" },
  { label: "Gender" },
  { label: "Where? Specify" },
  { label: "Age group" },
  { label: "What else you certainly never drink?" },
  {
    label:
      "When was the last time you drunk bottled beer? NOTE: Close interview if the answer is more than one month",
  },
  { label: "What is your third choice?" },
  {
    label:
      "Think about beer brands, could you please tell me the brand that comes to your mind FIRST? INTERVIEW: RECORD FIRST MENTIONED ON THE TOM COLUMN (a) SINGLE RESPONSE",
  },
  {
    label:
      "You have understood now we can start to describe different beers:SHOW CARD 1: BRAND...... SPECIFY ",
  },
  { label: "Show card 5 (Old/ Young)" },
  { label: "Which beer you certainly never drink?" },
  {
    label:
      "And which other brands do you know? Please mention all the beer brands you know even if only by name.DO NOT READ OUT THE BRANDS.",
  },
  {
    label:
      "I will now show you a card that describes different beers, can you indicate on a scale from 1 to 5 your thoughts.We will test to see if you understand.",
  },
  { label: "Now next Card - Show card 2 (Local/International)" },
  { label: "Show card 3 (Traditional/ Modern)" },
  { label: "Show Card 6 (Light/ Strong)" },
  { label: "Social Economic Group (SEG)" },
  {
    label:
      "How often do you drink beer? (READ OUT ALL POSSIBLE ANSWERS, SINGLE RESPONSE)",
  },
  { label: "When you drink, how many bottles do you drink?" },
  {
    label:
      'All other brands you know PROBE "any other?" THREE TIMESNOTE: IF THE NAME MENTIONED BY THE RESPONDENT IS NOT EXACTLY THE NAME / WORD AS IN THE PRECODED LIST (EG: "Knowless", THEN THE MENTIONED NAME COULD BE WRITTEN UNDER OTHERS',
  },
  {
    label:
      "For each of the brands I am going to read to you please tell me if you know this brand of beer even if you know it only by nameSHOW CARD 1: BRAND LIST ",
  },
  {
    label:
      "Which size of beer bottle do you usually order? (READ OUT, SINGLE RESPONSE)",
  },
  {
    label:
      "If you don't find your preferred beer, what other beer do you take?",
  },
  { label: "What is your preferred beer?" },
  { label: "Show card 4 (Low Quality/ High Quality)" },
  { label: "Show card 7 (Affordable/ Expensive" },
  { label: "Show Card 8 (Serious/ Fun)" },
  {
    label:
      "I declare that this interview has been carried out strictly in accordance with your specification and has been conducted within the ESOMAR Code of conduct with a person unknown to me.",
  },
];

let results = {};

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

  getData = async (isLoading) => {
    const { user } = this.state;

    let requestBody = filtersHandler(this.props.filters);

    delete requestBody.survey;

    let results = [];

    for (let qName of this.state.question || questions) {
      this.setState({
        isLoading: true,
      });

      requestBody.questionName = qName.label;
      const options = {
        method: "POST",
        url: ENDPOINT + "/answer/insight",
        data: requestBody,
        headers: {
          authorization: "Bearer " + user.token,
        },
      };

      await axios(options)
        .then((res) => {
          const data = res.data;

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
  };

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

  onChangeQuestion(e) {
    this.setState({ question: e });

    window.location.href = "/dashboard/surveys/answers/" + e.label;
  }

  render() {
    return (
      <div>
        {/* <div className="card">
          <div className="card-body">
            <div className="col-md-6">
              <Select
                label="Choose Question"
                options={questions}
                onChange={this.onChangeQuestion.bind(this)}
                value={this.state.question}
              />
            </div>
          </div>
        </div> */}
        <div className="chart-container row" style={{ marginTop: 20 }}>
          {Object.keys(this.state.data).length > 0
            ? Object.keys(this.state.data).map((q, i) => {
                if (this.state.data[q].question_type === "dropdown") {
                  return (
                    <div className="card" key={i} style={{ marginBottom: 15 }}>
                      <div className="card-header">
                        <h3>{q.replace(/ /g, "_")}</h3>
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
                                counts = [],
                                object_row = Object.keys(
                                  this.state?.data[q][head]?.data || []
                                );

                              for (let row of object_row) {
                                chart_data.push(
                                  parseFloat(
                                    (
                                      (this.state?.data[q][head]?.data[row]
                                        ?.count /
                                        this.state.data[q].total_respondent) *
                                      100
                                    ).toFixed(2)
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
                                  className={"col-md-6 well gap-1"}
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
                  <div
                    className={
                      this.state.data[q].labels.length > 15
                        ? "col-md-12"
                        : "col-md-6"
                    }
                  >
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
          {this.state.isLoading && <LoadingSpinner />}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;
  return { filters };
};

export default connect(mapStateToProps)(AnswerInsight);
