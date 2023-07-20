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
import { Home } from "../../screen/common";

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
    headers: [],
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
      headers: [],
      data: [],
    });

    let url = ENDPOINT + "/answer/responses";

    let request_body = filtersHandler({
      ...this.props.filters,
      limit,
      page,
    });

    if (this.props.filters.user && this.props.filters?.user?.value) {
      request_body.user = this.props.filters?.user?.value;
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
        let { data, totalCount, headers } = res.data;

        this.setState({
          data: data,
          headers: headers,
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

  getReport = async (type) => {
    const { user, limit, page } = this.state;

    toastMessage("info", "Downloading...");

    let url = ENDPOINT + "/responses/export";

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

    return await axios(options)
      .then((res) => {
        const { message, filePath } = res.data;

        this.readFileAndDownload({ type, filePath, message });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  };

  downloadExcel = async () => {
    try {
      await this.getReport("csv");
    } catch (error) {
      toastMessage("error", error);
    }
  };

  downloadPDF = async () => {
    try {
      await this.getReport("pdf");
    } catch (error) {
      toastMessage("error", error);
    }
  };

  readFileAndDownload(item) {
    toastMessage("info", "Downloading...");

    const { user } = this.state;
    const { type, filePath, message } = item;

    let url = ENDPOINT + "/file/read/" + type + "?file=" + filePath;

    const options = {
      method: "GET",
      url,
      responseType: "blob",
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let data = res.data;

        console.log(data);

        toastMessage("success", message);

        // create file link in browser's memory
        const href = URL.createObjectURL(data);

        // create "a" HTML element with href to file & click
        const link = document.createElement("a");
        link.href = href;
        link.setAttribute(
          "download",
          new Date().getTime() + "surveyResponses." + type
        ); //or any other extension
        document.body.appendChild(link);
        link.click();

        // clean up "a" element & remove ObjectURL
        document.body.removeChild(link);
        URL.revokeObjectURL(href);
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  }

  handleChangeLimit(e) {
    this.setState({
      limit: e.target.value === "" ? 10 : Number(e.target.value),
    });
  }

  render() {
    return (
      <div>
        <Home organization user survey date />
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
          controlPagination
          handleChangeLimit={this.handleChangeLimit.bind(this)}
          rowPress={() => console.log("Nothing to do")}
          headers={this.state.headers.map((el) => {
            return {
              title: el,
              key: el,
            };
          })}
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
                // {
                //   name: "PDF",
                //   onPress: this.downloadPDF.bind(this),
                // },
                {
                  name: "CSV",
                  onPress: this.downloadExcel.bind(this),
                },
              ],
            },
          ]}
        />
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
