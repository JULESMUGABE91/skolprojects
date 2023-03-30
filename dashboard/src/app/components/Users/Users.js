import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { onFilter } from "../../action/Filters";
import { connect } from "react-redux";
import formatSelectData from "../../utils/formatSelectData";
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
    const { user, page, limit } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/user/fetch";

    const options = {
      method: "POST",
      url,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let data = res.data;

        if (!data) {
          data = res.data;
        }

        this.setState({
          data: data,
          isLoading: false,
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

    for (let i = 0; i < copyData.length; i++) {
      if (
        JSON.stringify(copyData[i])
          .toLowerCase()
          .indexOf(search_text.toLowerCase()) !== -1
      ) {
        array.push(copyData[i]);
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
