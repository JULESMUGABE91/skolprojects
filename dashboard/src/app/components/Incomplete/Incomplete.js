import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { connect } from "react-redux";
import filtersHandler from "../../utils/filtersHandler";
import { saveDownload } from "../../utils/download";

class Incomplete extends React.Component {
  state = {
    data: [],
    isLoading: true,
    user: {},
    page: 1,
    limit: 10,
    selected_data: {},
    error: {},
    totalCount: 0,
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getData(true);
  };

  componentDidUpdate(prevProps) {
    if (prevProps.filters !== this.props.filters) {
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
    const { user, page, limit } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/answer/incomplete/responses";

    const options = {
      method: "POST",
      url,
      data: {
        status: "incomplete",
        page,
        limit,
        ...filtersHandler(this.props.filters),
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let { data, totalCount } = res.data;

        this.setState({
          data,
          totalCount,
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

  handleShowModal(modal, modalTitle, selected_data = {}) {
    this.setState({
      [modal]: true,
      modalTitle: modalTitle,
      selected_data,
    });
  }

  handleCloseModal(modal) {
    this.setState({
      [modal]: false,
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

  onDownload(item) {
    const { user } = this.state;

    toastMessage("info", "Downloading...");

    let url = ENDPOINT + "/answer/report/pdf";

    let request_body = {
      identifier: item.identifier,
      survey: item.survey,
    };

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
          isSubmitting: false,
        });

        saveDownload({
          file: data,
          identifier: request_body.identifier,
          user: "Incomplete-",
        });

        toastMessage("info", "Download completed");
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isSubmitting: false,
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

  render() {
    let headers = [
      {
        title: "Download",
        type: "download_pdf",
      },
      {
        title: "Identifier",
        key: "identifier",
      },
      {
        title: "Status",
        key: "status",
      },
      {
        title: "Date",
        key: "createdAt",
        isMoment: true,
        formatTime: "lll",
      },
    ];

    return (
      <div className="card">
        <div className="card-body">
          <Table
            data={this.state.data}
            isLoading={this.state.isLoading}
            headers={headers}
            rowPress={(item) => this.onDownload(item)}
            totalPageCount={this.state.totalCount}
            handlePagination={this.handlePagination.bind(this)}
            page={this.state.page}
            limit={this.state.limit}
            handleDownloadFilePdf={(item) => {
              this.onDownload(item);
            }}
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

export default connect(mapPropsToState)(Incomplete);
