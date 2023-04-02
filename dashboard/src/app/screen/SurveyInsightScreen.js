import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import { CardCount } from "../components/CardCount";
import { Insight } from "../components/Surveys";
import { ENDPOINT } from "../constants/api";
import { getStorage } from "../utils/storage";
import toastMessage from "../utils/toastMessage";
import { Home } from "./common";

class SurveyInsightScreen extends React.Component {
  state = {
    route: "",
  };

  state = {
    user: {},
    total_accounts: 0,
    total_surveys: 0,
    total_gifts: 0,
    route: "",
    total_question: 0,
    total_surveyed: 0,
    users: [],
  };

  componentDidMount = async () => {
    const user = await getStorage();

    await this.setState({ user });

    this.getResponses(true);
    this.getQuestion(true);
    this.getSurveyed(true);
  };

  componentDidUpdate(prevProps) {
    if (this.state.user.token && prevProps.filters !== this.props.filters) {
      this.getResponses(true);
      this.getQuestion(true);
      this.getSurveyed(true);
    }
  }

  returnFilters() {
    let request_body = {
      organization: "63fdf074095f8bc0e023ee15",
      survey: "63ffb22a731970d4c34689d2",
    };

    // if (this.props?.filters && this.props?.filters?.organization) {
    //   request_body.organization = this.props?.filters?.organization._id;
    // }

    // if (this.props?.survey && this.props?.filters?.survey) {
    //   request_body.survey = this.props?.filters?.survey._id;
    // }

    return request_body;
  }

  getAccounts() {
    const { user } = this.state;

    const options = {
      method: "POST",
      url: ENDPOINT + "/user/fetch",
      data: this.returnFilters(),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_accounts = res.data.length;
        this.setState({ total_accounts });
      })
      .catch((error) => {
        toastMessage("error", error);
      });
  }

  getResponses() {
    const { user } = this.state;

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/fetch",
      data: this.returnFilters(),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_response = res.data.length;
        this.setState({ total_response });
      })
      .catch((error) => {
        toastMessage("error", error);
      });
  }

  getQuestion() {
    const { user } = this.state;

    const options = {
      method: "POST",
      url: ENDPOINT + "/question/fetch",
      data: this.returnFilters(),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_question = res.data.length;
        this.setState({ total_question });
      })
      .catch((error) => {
        toastMessage("error", error);
      });
  }

  getSurveyed() {
    const { user } = this.state;

    const options = {
      method: "GET",
      url: ENDPOINT + "/user/survey",
      data: {
        ...this.returnFilters(),
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_surveyed = res.data.length;
        this.setState({ total_surveyed });
      })
      .catch((error) => {
        toastMessage("error", error);
      });
  }

  handlePressCount(route) {
    this.setState({ route });
  }

  render() {
    return (
      <div>
        <Home organization survey date />
        <div className="row">
          <div
            className="col-6 col-md-4"
            onClick={this.handlePressCount.bind(this, "/dashboard/bin_devices")}
          >
            <CardCount
              title="Total Responses"
              total={this.state.total_response}
            />
          </div>
          <div
            className="col-6 col-md-4"
            onClick={this.handlePressCount.bind(
              this,
              "/dashboard/schedules/served_schedules"
            )}
          >
            <CardCount
              title="Total Questions"
              total={this.state.total_question}
            />
          </div>
          <div
            className="col-6 col-md-4"
            onClick={this.handlePressCount.bind(
              this,
              "/dashboard/schedules/pending_schedules"
            )}
          >
            <CardCount
              title="Total Surveyed"
              total={this.state.total_surveyed}
            />
          </div>
        </div>
        <div style={{ position: "relative", marginTop: "1rem" }}>
          <Insight {...this.props.match} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;

  return {
    filters,
  };
};

export default connect(mapStateToProps)(SurveyInsightScreen);
