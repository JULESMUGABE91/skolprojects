import React from "react";
import { Button } from "../Button";
import "./styles.css";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import { getStorage } from "../../utils/storage";
import filtersHandler from "../../utils/filtersHandler";
import { LoadingSpinner } from "../LoadingSpinner";
import moment from "moment";
import { connect } from "react-redux";
import pdf from "../../assets/pdf.png";
import { saveDownload } from "../../utils/download";

class Questionnaires extends React.Component {
  state = {
    error: {},
    isSubmitting: false,
    user: {},
    _id: "",
    data: [],
    limit: 10000,
    page: 1,
    fromDate: moment("2023-04-01").format("YYYY-MM-DD"),
    toDate: moment().add(1, "d").format("YYYY-MM-DD"),
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

  getData(isLoading) {
    const { user, limit, page, fromDate, toDate } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/user/single/performance";


    let request_body = filtersHandler({
      ...this.props.filters,
      limit,
      page,
      user:{value: this.props._id},
      start_date: fromDate,
      end_date: toDate,
    });

    const options = {
      method: "POST",
      url,
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };
    axios(options)
      .then((res) => {
        let { data, count } = res.data;

        this.setState({
          data: data,
          isLoading: false,
          totalPageCount: count,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  }

  handlePagination(page) {
    this.setState(
      {
        page,
      },
      () => {
        this.getData(true);
      }
    );
  }

  onChangeText(name, e) {
    let { error } = this.state;

    delete error[name];

    this.setState({
      [name]: e.target.value,
      error,
    });
  }

  handleSearch(e) {
    const search_text = e.target.value;
    let array = [];

    this.setState({
      search_text,
    });

    this.getData(true, search_text);

    this.setState({
      data: array,
    });
  }

  onDownload(item) {
    const { user } = this.state;

    this.setState({
      ["isSubmitting_" + item.index]: true,
    });

    let url = ENDPOINT + "/answer/report/pdf";

    delete this.props.filters.start_date;
    delete this.props.filters.end_date;

    let request_body = filtersHandler({
      ...this.props.filters,
      user: this.props._id,
    });

    request_body.survey = item.survey;
    request_body.identifier = item.identifier;

    if (this.props.filters.user?.value) {
      request_body.user = this.props.filters.user?.value;
    }

    const options = {
      method: "POST",
      url,
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let data = res.data;

        this.setState({
          ["isSubmitting_" + item.index]: false,
        });

        saveDownload({
          file: data,
          identifier: request_body.identifier,
          user: this.props.firstname + " " + this.props.lastname,
        });
      })
      .catch((error) => {
        this.setState({
          ["isSubmitting_" + item.index]: false,
        });

        toastMessage("error", error);
      });
  }

  render() {
    return (
      <div className="card">
        <div className="card-body"  style={{maxHeight: "60vh", overflowY:"auto"}}>
          {this.state.isLoading ? (
            <LoadingSpinner />
          ) : (
            <table className="table table-bordered" >
              <thead>
                <tr>
                  <th>File</th>
                  <th>Answers / Questions</th>
                  <th>CreatedAt</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(this.state.data).map((identifier, i) => {
                  console.log(this.state.data[identifier]);
                  return (
                    <tr className="list-questionnaire-download" key={i}>
                      <td>
                        <img src={pdf} />
                      </td>
                      <td>
                        {this.state.data[identifier].total} out of{" "}
                        {this.state.data[identifier].totalQuestions}
                      </td>
                      <td>
                        {moment(this.state.data[identifier].createdAt).format(
                          "lll"
                        )}
                      </td>
                      <td>
                        <Button
                          className="btn-primary"
                          icon="bx-cloud-download"
                          onPress={() =>
                            this.onDownload({
                              identifier,
                              ...this.state.data[identifier],
                              index: i,
                            })
                          }
                          isSubmitting={this.state[`isSubmitting_${i}`]}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
        <hr />
        <div className="card-footer d-flex align-content-center justify-content-end gap-3">
          <Button
            text="Close"
            className="btn-default btn-lg border"
            onPress={this.props.handleCloseModal}
          />
        </div>
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

export default connect(mapPropsToState)(Questionnaires);
