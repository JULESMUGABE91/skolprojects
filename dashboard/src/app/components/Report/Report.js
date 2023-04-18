import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { connect } from "react-redux";
import { Modal } from "../Modal";
import filtersHandler from "../../utils/filtersHandler";
import { CSVLink } from "react-csv";
import exportPDF from "../../utils/exportPDF";
import moment from "moment";
import reportFileName from "../../utils/reportFileName";
import ReportDownload from "./ReportDownload";
import { saveDownload } from "../../utils/download";

let copyData = [];

class Report extends React.Component {
  state = {
    data: [],
    isLoading: true,
    user: {},
    page: 1,
    limit: 10,
    selected_data: {},
    error: {},
    totalPageCount: 0,
    csvData: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getData(true);
  };

  componentDidUpdate = async (prevProps) => {
    if (prevProps.filters !== this.props.filters) {
      this.getData(true);
    }
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  getData(isLoading, search_text) {
    const { user, limit, page } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/answer/respondent";

    let request_body = filtersHandler({
      ...this.props.filters,
      limit,
      page,
    });

    if (this.props.filters.user?.value) {
      request_body.user = this.props.filters.user?.value;
    }

    if (search_text && search_text !== "") {
      request_body.search = search_text;
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
        // let { data, count } = res.data;
        let data = res.data;

        let results = [];

        for (let el of Object.keys(data.respondents)) {
          results.push({
            ...data.respondents[el],
            identifier: el,
            start_interview: moment(
              data.respondents[el].start_interview
            ).format("lll"),
            end_interview: moment(data.respondents[el].end_interview).format(
              "lll"
            ),
          });
        }

        this.setState({
          data: results,
          isLoading: false,
          // totalPageCount: count,
        });

        copyData = results.slice(0);
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

    for (let el of copyData) {
      if (
        JSON.stringify(el).toLowerCase().indexOf(search_text.toLowerCase()) !==
        -1
      ) {
        array.push(el);
      }
    }

    this.setState({
      data: array,
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

  downloadExcel = () => {
    const { data } = this.state;

    this.setState({
      isLoading: true,
    });

    this.setState(
      {
        isLoading: false,
        csvData: data,
      },
      () => {
        this.refs.csvDownload?.link.click();
      }
    );
  };

  downloadPDF = () => {
    const headers = this.returnTableHeaders();

    const { data } = this.state;

    exportPDF(reportFileName(this.props.filters), headers, data, "landscape");
  };

  returnTableHeaders() {
    return [
      {
        title: "File",
        type: "download_pdf",
      },
      {
        title: "Name",
        key: "respondent_name",
      },
      {
        title: "Phone Number",
        key: "respondent_phone_number",
      },
      {
        title: "Gender",
        key: "respondent_gender",
      },
      {
        title: "Address",
        key: "respondent_address",
      },
      // {
      //   title: "Surveyor Name",
      //   key: "surveyor",
      // },
      // {
      //   title: "Surveyor Contact",
      //   key: "surveyor_phone",
      // },
      {
        title: "Survey Location",
        key: "start_location",
      },
      {
        title: "Started Time",
        key: "start_interview",
        isMoment: true,
        formatTime: "lll",
      },
      {
        title: "End Time",
        key: "end_interview",
        isMoment: true,
        formatTime: "lll",
      },
    ];
  }

  onDownloadQuestionnaire(item) {
    const { user } = this.state;

    toastMessage("info", "Downloading...");

    let url = ENDPOINT + "/answer/report/pdf";

    delete this.props.filters.start_date;
    delete this.props.filters.end_date;

    let request_body = filtersHandler({
      ...this.props.filters,
      user: item.surveyor_id,
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

        saveDownload({
          file: data,
          identifier: request_body.identifier,
          user: item.respondent_name + " " + item.respondent_phone_number,
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
      <div>
        <Table
          data={this.state.data}
          isSearch
          search_text={this.state.search_text}
          handleSearch={this.handleSearch.bind(this)}
          totalPageCount={this.state.totalPageCount}
          handlePagination={this.handlePagination.bind(this)}
          handleDownloadFilePdf={(item) => {
            this.onDownloadQuestionnaire(item);
          }}
          page={this.state.page}
          limit={this.state.limit}
          isLoading={this.state.isLoading}
          headers={this.returnTableHeaders()}
          rowPress={(item) => {
            this.onDownloadQuestionnaire(item);
          }}
          filters={[
            {
              type: "refresh",
              title: "Refresh",
              icon: "bx bx-refresh",
              onPress: () => this.getData(true),
            },
            {
              type: "export",
              title: "Export",
              button_type: "dropdown",
              icon: "bx bxs-download",
              options: [
                {
                  name: "PDF",
                  onPress: this.downloadPDF.bind(this),
                },
                {
                  name: "CSV",
                  onPress: this.downloadExcel.bind(this),
                },
              ],
            },
          ]}
        />
        <Modal
          handleClose={this.handleCloseModal.bind(this, "showModal")}
          show={this.state.showModal}
          title={this.state.modalTitle}
          showHeaderBottomBorder={false}
        >
          <ReportDownload
            {...this.state.selected_data}
            handleCloseModal={this.handleCloseModal.bind(this, "showModal")}
          />
        </Modal>
        <CSVLink
          ref="csvDownload"
          filename={reportFileName(this.props.filters)}
          data={this.state.csvData}
        ></CSVLink>
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

export default connect(mapPropsToState)(Report);
