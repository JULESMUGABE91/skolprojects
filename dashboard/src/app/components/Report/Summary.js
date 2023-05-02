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
import SummaryModal from "./modal/SummaryModal";
import { Home } from "../../screen/common";
import Gender from "./chart/Gender";
import GenderAgeGroup from "./chart/GenderAgeGroup";

let copyData = [];

class Summary extends React.Component {
  state = {
    data: [],
    isLoading: true,
    user: {},
    page: 1,
    limit: 50,
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

  getData(isLoading) {
    const { user, limit, page } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/answer/responses";

    let request_body = filtersHandler({
      ...this.props.filters,
      limit,
      page,
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
        let { data, totalCount } = res.data;

        this.setState({
          data: data,
          isLoading: false,
          totalPageCount: totalCount,
        });

        copyData = data.slice(0);
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

  returnTableHeaders() {
    return [
      {
        title: "Question",
        key: "question",
      },
      {
        title: "Answer",
        key: "answer",
      },
    ];
  }

  downloadExcel() {
    const { user } = this.state;

    this.setState({
      isLoading: true,
    });

    let request_body = filtersHandler({
      ...this.props.filters,
      limit: 10000000,
      page: 1,
    });

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/responses",
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const data = res.data.data;

        for(let el of data){

        }

        this.setState(
          {
            csvData: data,
            isLoading: false,
          },
          () => {
            this.refs.csvDownload?.link.click();
          }
        );
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoading: false });
      });
  }

  downloadPDF() {
    const headers = this.returnTableHeaders();

    delete headers[headers.length - 1];

    const { user } = this.state;

    let request_body = filtersHandler({
      ...this.props.filters,
      limit: 10000000,
      page: 1,
    });


    this.setState({
      isLoading: true,
    });

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/responses",
      data: {
        ...request_body,
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const data = res.data.data;

        this.setState({ isLoading: false });

        exportPDF("Survey Responses", headers, data);
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoading: false });
      });
  }

  render() {
    return (
      <div>
        <Home organization />
        <div className="card" style={{ marginBottom: 15 }}>
          <div className="card-header">
            <h3>Total Number of Population Per Region</h3>
          </div>
          <div className="card-body">
            <Gender />
          </div>
        </div>
        <div className="row" style={{ marginBottom: 15 }}>
          <div className="col-md-12">
            <Table
              data={this.state.data}
              isSearch
              search_text={this.state.search_text}
              handleSearch={this.handleSearch.bind(this)}
              totalPageCount={this.state.totalPageCount}
              handlePagination={this.handlePagination.bind(this)}
              page={this.state.page}
              limit={this.state.limit}
              isLoading={this.state.isLoading}
              headers={this.returnTableHeaders()}
              rowPress={(item) => {
                this.handleShowModal("showModal", item.answer, item);
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
          </div>
        </div>
        {/* <div className="row" style={{ marginBottom: 15 }}>
          <div className="col-md-6">
            <did className="card">
              <div className="card-header">
                <h3>Frequency of Consumption Gender</h3>
              </div>
              <div className="card-body"></div>
            </did>
          </div>
          <div className="col-md-6">
            <did className="card">
              <div className="card-header">
                <h3>Frequency of Consumption Age Group</h3>
              </div>
              <div className="card-body"></div>
            </did>
          </div>
        </div> */}
        {/* <div className="row">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3>Total Number of Gender Per Region</h3>
              </div>
              <div className="card-body">

              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h3>Total Number of Gender Per Region</h3>
              </div>
              <div className="card-body"></div>
            </div>
          </div>
        </div> */}
        {/*
        <Modal
          handleClose={this.handleCloseModal.bind(this, "showModal")}
          show={this.state.showModal}
          title={this.state.modalTitle}
          showHeaderBottomBorder={false}
          size="lg"
        >
          <SummaryModal
            {...this.state.selected_data}
            handleCloseModal={this.handleCloseModal.bind(this, "showModal")}
          />
        </Modal> */}
        <CSVLink
          ref="csvDownload"
          filename={"Survey Responses"}
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

export default connect(mapPropsToState)(Summary);
