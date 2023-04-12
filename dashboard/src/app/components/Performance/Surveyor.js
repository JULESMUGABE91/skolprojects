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

class Surveyor extends React.Component {
  state = {
    data: [],
    isLoading: true,
    user: {},
    page: 1,
    limit: 10,
    selected_data: {},
    error: {},
    totalPageCount: 0,
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

  render() {
    let headers = [
      {
        title: "First Name",
        key: "firstname",
      },
      {
        title: "Last Name",
        key: "lastname",
      },
      {
        title: "Contact",
        key: "phone",
      },
      {
        title: "Total Respondent",
        key: "respondents",
      },
    ];

    if (
      this.state.user.account_type === "super_admin" ||
      this.state.user.account_type === "admin"
    ) {
      headers.push({
        title: "action",
        key: "action",
      });
    }

    return (
      <div>
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
          headers={headers}
          rowPress={(item) => {
            this.handleShowModal(
              "showModal",
              item.firstname + " " + item.lastname,
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
          <Questionnaires {...this.state.selected_data} handleCloseModal={this.handleCloseModal.bind(this, "showModal")}/>
        </Modal>
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
