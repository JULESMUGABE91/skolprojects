import axios from "axios";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { Redirect } from "react-router-dom";
import { CardCount } from "../../components/CardCount";
import { Header } from "../../components/Header";
import { ENDPOINT } from "../../constants/api";
import { getStorage } from "../../utils/storage";
import toastMessage from "../../utils/toastMessage";

class Home extends React.Component {
  state = {
    user: {},
    total_accounts: 0,
    total_respondent: 0,
    total_surveys: 0,
    total_gifts: 0,
    route: "",
    total_question: 0,
    total_surveyed: 0,
    total_incomplete: 0,
    users: [],
  };

  componentDidMount = async () => {
    const user = await getStorage();

    await this.setState({ user });

    this.getAccounts(true);
    this.getIncomplete(true);
    this.getSurveys(true);
    this.getRespondent(true);
    this.getQuestion(true);
    this.getSurveyed(true);
  };

  componentDidUpdate(prevProps) {
    if (this.state.user.token && prevProps.filters !== this.props.filters) {
      this.getAccounts(true);
      this.getRespondent(true);
      this.getSurveys(true);
      this.getQuestion(true);
      this.getSurveyed(true);
      this.getIncomplete(true);
    }
  }

  returnFilters() {
    let request_body = {};

    if (this.props?.filters && this.props?.filters?.organization) {
      request_body.organization = this.props?.filters?.organization.value;
    }

    if (this.props?.filters && this.props?.filters?.survey) {
      request_body.survey = this.props?.filters?.survey.value;
    }

    return request_body;
  }

  getIncomplete(isLoadingStatus) {
    const { user } = this.state;

    this.setState({ isLoadingStatus });

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/status",
      data: {
        status: "incomplete",
        ...this.returnFilters(),
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_incomplete = res.data.count;
        this.setState({ total_incomplete, isLoadingStatus });
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoadingStatus });
      });
  }

  getRespondent(isLoadingRespondent) {
    const { user } = this.state;

    this.setState({ isLoadingRespondent });

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/respondent",
      data: this.returnFilters(),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_respondent = res.data.total;
        this.setState({ total_respondent, isLoadingRespondent });
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoadingRespondent });
      });
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

  getSurveys() {
    const { user } = this.state;

    const options = {
      method: "POST",
      url: ENDPOINT + "/survey/fetch",
      data: this.returnFilters(),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_survey = res.data.length;
        this.setState({ total_survey });
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
      params: {
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
    if (this.state.route !== "") {
      return <Redirect to={this.state.route} />;
    }

    let list_filters = [];

    if (this.props.organization) {
      list_filters.push({
        name: "organization",
        isDropdown: true,
        selected:
          this.props.filters &&
          this.props.filters.organization &&
          this.props.filters.organization.value
            ? this.props.filters.organization.label
            : ["All"],
        clickBehaviorId: "dropdownMenuClickableInside",
        autoCloseType: "outside",
      });
    }

    if (this.props.survey) {
      list_filters.push({
        name: "survey",
        isDropdown: true,
        selected:
          this.props.filters &&
          this.props.filters.survey &&
          this.props.filters.survey.value
            ? this.props.filters.survey.label
            : ["All"],
        clickBehaviorId: "dropdownMenuClickableInside",
        autoCloseType: "outside",
      });
    }

    if (this.props.question) {
      list_filters.push({
        name: "question",
        isDropdown: true,
        selected:
          this.props.filters &&
          this.props.filters.question &&
          this.props.filters.question.value
            ? this.props.filters.question.label
            : ["All"],
        clickBehaviorId: "dropdownMenuClickableInside",
        autoCloseType: "outside",
      });
    }

    if (this.props.user_account) {
      list_filters.push({
        name: "user_account",
        isDropdown: true,
        selected:
          this.props.filters &&
          this.props.filters.users &&
          this.props.filters.users.length > 0
            ? this.props.filters.users
            : ["All"],
        clickBehaviorId: "dropdownMenuClickableInside",
        autoCloseType: "outside",
      });
    }

    if (this.props.date) {
      list_filters.push({
        name: "date",
        position: "right",
        isDropdown: true,
        selected: [
          moment(this.props.filters.start_date).format("DD-MM-YYYY"),
          moment(this.props.filters.end_date).format("DD-MM-YYYY"),
        ],
        clickBehaviorId: "dropdownMenuClickableInside",
        autoCloseType: "outside",
      });
    }
    return (
      <div>
        <Header filters={list_filters} />
        <hr />
        {this.props.isCountCard && (
          <div className="row">
            <div className="col-6 col-md-3">
              <CardCount
                title="Total Respondent"
                total={this.state.total_respondent}
              />
            </div>
            <div className="col-6 col-md-3">
              <CardCount title="Total Survey" total={this.state.total_survey} />
            </div>
            <div className="col-6 col-md-3">
              <CardCount
                title="Total Questions"
                total={this.state.total_question}
              />
            </div>
            <div className="col-6 col-md-3">
              <CardCount
                title="Incomplete Survey"
                total={this.state.total_incomplete}
              />
            </div>
          </div>
        )}
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

export default connect(mapStateToProps)(Home);
