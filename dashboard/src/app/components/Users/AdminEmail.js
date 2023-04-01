import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { connect } from "react-redux";
import { Modal } from "../Modal";
import NewAdminEmail from "./NewAdminEmail";

let copyData = [];

class AdminEmail extends React.Component {
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

  returnFilters() {
    let request_body = {};

    if (this.props?.filters && this.props?.filters?.organization) {
      request_body.organization = this.props?.filters?.organization.value;
    }

    return request_body;
  }

  getData(isLoading) {
    const { user, page, limit } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/user/admin_email_info";

    const options = {
      method: "GET",
      url,
      data: this.returnFilters(),
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

  onDelete = async (selected_data) => {
    if (window.confirm("Do you want to delete")) {
      let { data, user } = this.state;

      this.setState({
        data,
        isDeleting: true,
      });

      let url = ENDPOINT + "/user/admin_email_info";

      const options = {
        method: "DELETE",
        url,
        data: { id: selected_data._id },
        headers: {
          authorization: "Bearer " + user.token,
        },
      };

      axios(options)
        .then((res) => {
          const index = data.indexOf(selected_data);

          data.splice(index, 1);

          this.setState({
            isDeleting: false,
          });

          toastMessage("success", "DATA was deleted successful");
        })
        .catch((error) => {
          this.setState({
            isDeleting: false,
          });

          toastMessage("error", error);
        });
    }
  };

  render() {
    let headers = [
      {
        title: "Email Address",
        key: "email",
      },
      {
        title: "Organization",
        key: "organization.name",
      },
      {
        title: "Action",
        key: "action",
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
            this.handleShowModal("showModal", "Add", item);
          }}
          showAdd
          addButtonText="Add Email"
          handleAddPressed={(item) =>
            this.handleShowModal("showModal", "Edit", item)
          }
          actions={[
            {
              name: "Edit",
              onPress: (item) =>
                this.handleShowModal("showModal", "Edit", item),
            },
            {
              name: "Delete",
              onPress: (item) => this.onDelete(item),
            },
          ]}
        />
        <Modal
          handleClose={this.handleCloseModal.bind(this, "showModal")}
          show={this.state.showModal}
          title={this.state.modalTitle}
          showHeaderBottomBorder={false}
        >
          <NewAdminEmail
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

export default connect(mapPropsToState)(AdminEmail);
