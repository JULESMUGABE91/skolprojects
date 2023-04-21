import axios from "axios";
import moment from "moment";
import React from "react";
import { connect } from "react-redux";
import { Link, Redirect } from "react-router-dom";
import { CardCount } from "../../components/CardCount";
import { Header } from "../../components/Header";
import { ENDPOINT } from "../../constants/api";
import { getStorage } from "../../utils/storage";
import toastMessage from "../../utils/toastMessage";
import filtersHandler from "../../utils/filtersHandler";

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

    this.getRespondent(true);
    this.getSurveys(true);
    this.getQuestion(true);
    this.getSurveyed(true);
    this.getIncomplete(true);
  };

  componentDidUpdate(prevProps) {
    if (this.state.user.token && prevProps.filters !== this.props.filters) {
      this.getRespondent(true);
      this.getSurveys(true);
      this.getQuestion(true);
      this.getSurveyed(true);
      this.getIncomplete(true);
    }
  }

  getIncomplete(isLoadingStatus) {
    const { user } = this.state;

    this.setState({ isLoadingStatus });

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/incomplete",
      data: {
        status: "incomplete",
        ...filtersHandler(this.props.filters),
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_incomplete = res.data;
        this.setState({ total_incomplete, isLoadingStatus: false });
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoadingStatus: false });
      });
  }

  getRespondent(isLoadingRespondent) {
    const { user } = this.state;

    this.setState({ isLoadingRespondent });

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/respondent",
      data: filtersHandler(this.props.filters),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_respondent = res.data.total;
        this.setState({ total_respondent, isLoadingRespondent: false });
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoadingRespondent: false });
      });
  }

  getAccounts() {
    const { user } = this.state;

    const options = {
      method: "POST",
      url: ENDPOINT + "/user/fetch",
      data: filtersHandler(this.props.filters),
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

  getSurveys(isLoadingSurvey) {
    const { user } = this.state;

    this.setState({ isLoadingSurvey });

    const options = {
      method: "POST",
      url: ENDPOINT + "/survey/fetch",
      data: filtersHandler(this.props.filters),
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_surveys = res.data.length;
        this.setState({ total_surveys, isLoadingSurvey: false });
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoadingSurvey: false });
      });
  }

  getQuestion(isLoadingQuestion) {
    const { user } = this.state;

    this.setState({
      isLoadingQuestion,
    });

    let request_body = filtersHandler(this.props.filters);

    delete request_body.user;
    delete request_body.start_date;
    delete request_body.end_date;

    const options = {
      method: "POST",
      url: ENDPOINT + "/question/fetch",
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const total_question = res.data.length;
        this.setState({ total_question, isLoadingQuestion: false });
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({
          isLoadingQuestion: false,
        });
      });
  }

  getSurveyed() {
    const { user } = this.state;

    this.setState({ isLoadingSurveyed: true });

    const options = {
      method: "GET",
      url: ENDPOINT + "/user/survey",
      params: {
        ...filtersHandler(this.props.filters),
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };
    console.log(options);

    axios(options)
      .then((res) => {
        const total_surveyed = res.data.length;
        this.setState({ total_surveyed, isLoadingSurveyed: false });
      })
      .catch((error) => {
        toastMessage("error", error);

        this.setState({ isLoadingSurveyed: false });
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

    if (this.props.user) {
      list_filters.push({
        name: "user",
        isDropdown: true,
        selected:
          this.props.filters && this.props.filters.user
            ? this.props.filters.user.label
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
              <Link to="/dashboard/home/report">
                <CardCount
                  title="Total Respondent"
                  total={
                    this.state.isLoadingRespondent
                      ? "..."
                      : this.state.total_respondent
                  }
                />
              </Link>
            </div>
            <div className="col-6 col-md-3">
              <Link to="/dashboard/surveys/all_surveys">
                <CardCount
                  title="Total Surveys"
                  total={
                    this.state.isLoadingSurvey
                      ? "..."
                      : this.state.total_surveys
                  }
                />
              </Link>
            </div>
            <div className="col-6 col-md-3">
              <Link to="/dashboard/surveys/questions">
                <CardCount
                  title="Total Questions"
                  total={
                    this.state.isLoadingQuestion
                      ? "..."
                      : this.state.total_question
                  }
                />
              </Link>
            </div>
            <div className="col-6 col-md-3">
              {/* <Link to="/dashboard/home/report"> */}
              <CardCount
                title="Incomplete Questionnaires"
                total={
                  this.state.isLoadingStatus
                    ? "..."
                    : this.state.total_incomplete
                }
              />
              {/* </Link> */}
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
