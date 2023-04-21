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
import { Modal } from "../Modal";
import { ChartTableModal } from "./modal";
import { Button } from "../Button";

const options = {
  legend: {
    position: "left",
    display: true,
  },
  maintainAspectRatio: false,
  offset: true,
};

class PerRegion extends React.Component {
  state = {
    data: [],
    user: {},
    title: "Respondent Per Region",
    responses: [],
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

  handleOpenModal(modal) {
    this.setState({ [modal]: true });
  }

  handleCloseModal(modal) {
    this.setState({ [modal]: false });
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
      url: ENDPOINT + "/answer/respondent/region",
      data: filtersHandler(this.props.filters),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const data = res.data;

        let chart_data = [],
          responses = [],
          counts = [],
          labels = Object.keys(data);

        for (let key of labels) {
          chart_data.push(data[key].percentage);
          counts.push(data[key].count);

          responses.push({
            name: key,
            count: data[key].count,
            percentage: data[key].percentage + "%",
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
                label: "Respondent Per Region",
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

export default connect(mapStateToProps)(PerRegion);
