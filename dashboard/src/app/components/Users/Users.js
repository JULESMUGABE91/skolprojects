import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { connect } from "react-redux";
import UpdateUser from "./UpdateUser";
import { Modal } from "../Modal";

let copyData = [];

class Users extends React.Component {
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

  returnFilters() {
    const { page, limit } = this.state;
    let request_body = {
      page,
      limit,
    };

    if (this.props?.filters && this.props?.filters?.organization) {
      request_body.organization = this.props?.filters?.organization.value;
    }

    return request_body;
  }

  getData(isLoading, search_text) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/user/fetch";

    let request_body = this.returnFilters();

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

        if (data.length !== 0) {
          copyData = data.slice(0);
        }
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

    // for (let i = 0; i < copyData.length; i++) {
    //   if (
    //     JSON.stringify(copyData[i])
    //       .toLowerCase()
    //       .indexOf(search_text.toLowerCase()) !== -1
    //   ) {
    //     array.push(copyData[i]);
    //   }
    // }

    // if (array.length === 0 && search_text !== "") {
    this.getData(true, search_text);
    // }

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
        title: "Email Address",
        key: "email",
      },
      {
        title: "Phone Number",
        key: "phone",
      },
      {
        title: "Account Type",
        key: "account_type",
      },
      {
        title: "Province",
        key: "province",
      },
      {
        title: "District",
        key: "district",
      },
      {
        title: "Sector",
        key: "sector",
      },
      {
        title: "Cell",
        key: "cell",
      },
      {
        title: "Village",
        key: "village",
      },
    ];

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
            this.handleShowModal("showModal", "Account", item);
          }}
        />
        <Modal
          handleClose={this.handleCloseModal.bind(this, "showModal")}
          show={this.state.showModal}
          title={this.state.modalTitle}
          showHeaderBottomBorder={false}
        >
          <UpdateUser
            handleCloseModal={this.handleCloseModal.bind(this, "showModal")}
            getData={this.getData.bind(this)}
            {...this.state.selected_data}
          />
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

export default connect(mapPropsToState)(Users);
