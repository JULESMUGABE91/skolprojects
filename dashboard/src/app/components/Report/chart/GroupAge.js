import React from "react";
import "../styles.css";
import { Pie } from "react-chartjs-2";
import toastMessage from "../../../utils/toastMessage";
import { connect } from "react-redux";
import { LoadingSpinner } from "../../LoadingSpinner";
import { colors } from "../../../constants/strings";
import { Button } from "../../Button";

const options = {
  legend: {
    position: "left",
    display: true,
  },
  maintainAspectRatio: false,
  offset: true,
};

class GroupAge extends React.Component {
  state = {
    data: [],
    chartData: [],
    user: {},
    user: {},
    title: "Respondents Per Group Age",
  };

  componentDidMount = async () => {
    this.setState({ data: this.props.data }, () => {
      this.handleChart(true);
    });
  };

  handleChart(isLoading) {
    this.setState({
      isLoading,
    });

    const { age, count } = this.props.data;

    let chart_data = [],
      counts = [],
      responses = [],
      labels = Object.keys(age);

    for (let el of labels) {
      let percentage = Math.round((Number(age[el]) / count) * 100);

      chart_data.push(percentage);
      counts.push(age[el]);
    }

    let customLabels = labels.map(
      (label, index) => `${label} - ${counts[index]}: ${chart_data[index]}%`
    );

    this.setState({
      isLoading: false,
      responses,
      data: {
        labels: customLabels,
        datasets: [
          {
            label: "Respondent Per Group Age",
            data: chart_data,
            backgroundColor: colors,
          },
        ],
      },
    });
  }

  render() {
    return (
      <div className="chart-container">
        <div className="card">
          <div className="card-header chart-header">
            <h3>{this.state.title}</h3>
            {/* <Button
              className="btn-transparent btn-sm"
              icon="bx bx-link-external"
              onPress={() => this.props.handleOpenModal}
            /> */}
          </div>
          <div className="card-body" style={{ height: 280 }}>
            {this.state.isLoading ? (
              <LoadingSpinner />
            ) : (
              <Pie data={this.state.data} options={options} />
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

export default connect(mapStateToProps)(GroupAge);
