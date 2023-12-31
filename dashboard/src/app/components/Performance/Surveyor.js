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
import Questionnaires from "./Questionnaires";
import { CSVLink } from "react-csv";
import reportFileName from "../../utils/reportFileName";
import exportPDF from "../../utils/exportPDF";
import { Home } from "../../screen/common";

class Surveyor extends React.Component {
  state = {
    data: [],
    isLoading: true,
    user: {},
    page: 1,
    limit: 20,
    selected_data: {},
    error: {},
    totalPageCount: 0,
    csvData: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getData(true);
  };

  componentDidUpdate(prevProps){
    if(prevProps.filters  !== this.props.filters){
      this.getData(true)
    }
  }

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

    let url = ENDPOINT + "/user/performance";

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
        let data = res.data;
        this.setState({
          data: data,
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
    let headers = [
      {
        title: "First Name",
        key: "user_info.firstname",
      },
      {
        title: "Last Name",
        key: "user_info.lastname",
      },
      {
        title: "Contact",
        key: "user_info.phone",
      },
      {
        title: "Total Respondent",
        key: "count",
      },
    ];

    return headers;
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
          headers={this.returnTableHeaders()}
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
          rowPress={(item) => {
            this.handleShowModal(
              "showModal",
              item.user_info.firstname + " " + item.user_info.lastname,
              item
            );
          }}
        />
        <Modal
          handleClose={this.handleCloseModal.bind(this, "showModal")}
          show={this.state.showModal}
          title={this.state.modalTitle}
          showHeaderBottomBorder={false}
        >
          <Questionnaires
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

export default connect(mapPropsToState)(Surveyor);
