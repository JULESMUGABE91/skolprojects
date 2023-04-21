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
import { Button } from "../Button";
import { Modal } from "../Modal";
import { ChartTableModal } from "./modal";

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
    responses: [],
    title: "Respondents Per Gender",
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

  handleOpenModal(modal) {
    this.setState({ [modal]: true });
  }

  handleCloseModal(modal) {
    this.setState({ [modal]: false });
  }

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
          responses = [],
          labels = Object.keys(data);

        for (let el of labels) {
          chart_data.push(data[el].percentage);
          counts.push(data[el].count);

          responses.push({
            name: el,
            count: data[el].count,
            percentage: data[el].percentage + "%",
          });
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
          <div className="card-header chart-header">
            <h3>{this.state.title}</h3>
            <Button
              className="btn-transparent btn-sm"
              icon="bx bx-link-external"
              onPress={() => this.handleOpenModal("showModal")}
            />
          </div>
          <div className="card-body" style={{ height: 280 }}>
            {this.state.isLoading ? (
              <LoadingSpinner />
            ) : (
              <Pie data={this.state.data} options={options} />
            )}
          </div>
        </div>
        <Modal
          handleClose={this.handleCloseModal.bind(this, "showModal")}
          show={this.state.showModal}
          title={this.state.title}
          showHeaderBottomBorder={false}
        >
          <ChartTableModal
            handleCloseModal={this.handleCloseModal.bind(this, "showModal")}
            data={this.state.responses}
            title={this.state.title}
          />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;
  return { filters };
};

export default connect(mapStateToProps)(PerGender);
