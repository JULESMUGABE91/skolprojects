import React from "react";
import "./styles.css";
import { Pie } from "react-chartjs-2";
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

class PerGender extends React.Component {
  state = {
    data: [],
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
      url: ENDPOINT + "/answer/respondent/gender",
      data: filtersHandler(this.props.filters),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const data = res.data;

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

        this.setState({
          isLoading: false,
          data: {
            labels: customLabels,
            datasets: [
              {
                label: "Respondent Per Gender",
                data: chart_data,
                backgroundColor: colors,
              },
            ],
          },
        });
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <div className="chart-container">
        <div className="card">
          <div className="card-header">
            <h3>Respondents Per Gender</h3>
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

export default connect(mapStateToProps)(PerGender);
