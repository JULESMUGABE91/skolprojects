import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import { DeleteModal, Modal } from "../Modal";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { CSVLink } from "react-csv";
import exportPDF from "../../utils/exportPDF";

let copyAccount = [];
class SubAccounts extends React.Component {
  state = {
    data: [],
    isLoading: true,
    user: {},
    page: 1,
    limit: 10,
    selected_account: {},
    error: {},
    csvData: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getAccounts(true);
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  getAccounts(isLoading) {
    const { user, page, limit } = this.state;

    this.setState({
      isLoading,
    });

    let body = {
      page,
      limit,
    };

    let url = "";

    if (user.account_type === "user_account") {
      url = ENDPOINT + "/get_user_subaccount";

      body.user_id = [user.id];
      body.ref_account = [user.id];
    }

    if (user.account_type === "admin_account") {
      url = ENDPOINT + "/get_user_account";
    }

    const options = {
      method: "POST",
      url,
      data: {
        ...body,
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let { data, count } = res.data;

        if (!data) {
          data = res.data;
        }
        this.setState({
          data,
          isLoading: false,
          totalPageCount: count,
        });

        if (data.length !== 0) {
          copyAccount = data.slice(0);
        }
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  }

  handleShowModal(modal, modalTitle, selected_account = {}) {
    this.setState({
      [modal]: true,
      modalTitle: selected_account.email
        ? selected_account.email + " 's account"
        : modalTitle,
      selected_account,
      delete_password: "",
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
        this.getAccounts(true);
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

  validateDelete() {
    let { error, delete_password } = this.state;

    if (delete_password === "") {
      error.delete_password = "Your password is mandatory to confirm delete";
    }

    this.setState({
      error,
    });
  }

  onDelete = async () => {
    let { data, selected_account, user, error, delete_password } = this.state;

    await this.validateDelete();

    if (Object.keys(error).length === 0) {
      this.setState({
        data,
        isDeleting: true,
      });

      let url = "";

      if (user.account_type === "user_account") {
        url = ENDPOINT + "/delete_user_subaccount";
      }

      if (user.account_type === "admin_account") {
        url = ENDPOINT + "/delete_user_account";
      }

      const options = {
        method: "POST",
        url,
        data: { id: selected_account._id, password: delete_password },
        headers: {
          authorization: "Bearer " + user.token,
        },
      };

      const index = data.indexOf(selected_account);

      data.splice(index, 1);

      axios(options)
        .then((res) => {
          this.setState({
            isDeleting: false,
          });

          toastMessage("success", "Account was deleted successful");
          this.handleCloseModal("showDeleteModal");
        })
        .catch((error) => {
          this.setState({
            isDeleting: false,
          });

          toastMessage("error", error);
        });
    }
  };

  handleSearch(e) {
    const search_text = e.target.value;

    let array = [];

    this.setState({
      search_text,
    });

    if (search_text === "") {
      this.setState({
        data: copyAccount,
      });

      return;
    }

    for (let i = 0; i < copyAccount.length; i++) {
      if (
        JSON.stringify(copyAccount[i])
          .toLowerCase()
          .indexOf(search_text.toLowerCase()) !== -1
      ) {
        array.push(copyAccount[i]);
      }
    }

    this.setState({
      data: array,
    });
  }

  downloadExcel = () => {
    const { user } = this.state;

    this.setState({
      isLoading: true,
    });

    let body = {};

    let url = "";

    if (user.account_type === "user_account") {
      url = ENDPOINT + "/get_user_subaccount";

      body.user_id = [user.id];
      body.ref_account = [user.id];
    }

    if (user.account_type === "admin_account") {
      url = ENDPOINT + "/get_user_account";
    }

    const options = {
      method: "POST",
      url,
      data: {
        ...body,
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let { data } = res.data;

        if (!data) {
          data = res.data;
        }

        let result = [];

        for (let i = 0; i < data.length; i++) {
          delete data[i].access_role;
          delete data[i].passcode;
          delete data[i]._v;

          result.push(data[i]);
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
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  };

  downloadPDF = () => {
    const headers = this.returnTableHeaders();

    const { user } = this.state;

    this.setState({
      isLoading: true,
    });

    let body = {};

    let url = "";

    if (user.account_type === "user_account") {
      url = ENDPOINT + "/get_user_subaccount";

      body.user_id = [user.id];
      body.ref_account = [user.id];
    }

    if (user.account_type === "admin_account") {
      url = ENDPOINT + "/get_user_account";
    }

    const options = {
      method: "POST",
      url,
      data: {
        ...body,
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let { data } = res.data;

        if (!data) {
          data = res.data;
        }
        exportPDF("Accounts", headers, data);
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  };

  returnTableHeaders() {
    let headers = [
      {
        title: "Email",
        key: "email",
      },
    ];

    if (this.state.user.account_type === "admin_account") {
      headers.push({
        title: "Role",
        key: "account_role",
      });
    }

    if (this.state.user.account_type === "user_account") {
      headers.push(
        {
          title: "Contact",
          key: "contact",
        },
        {
          title: "Role",
          key: "account_role",
        },
        {
          title: "Referer",
          key: "ref_account",
        }
      );
    }

    headers.push({
      title: "Action",
      key: "action",
    });

    return headers;
  }

  render() {
    let actions = [
      {
        name: "Edit",
        onPress: (item) =>
          this.handleShowModal("showModal", "Edit Account", item),
      },
      {
        name: "Access Level",
        onPress: this.handleShowModal.bind(
          this,
          "showModal",
          "Account's Access Level"
        ),
      },
      {
        name: "Delete",
        onPress: this.handleShowModal.bind(
          this,
          "showDeleteModal",
          "Delete Account"
        ),
      },
    ];

    return (
      <div>
        <Table
          data={this.state.data}
          isSearch
          showAdd
          page={this.state.page}
          search_text={this.state.search_text}
          handleSearch={this.handleSearch.bind(this)}
          totalPageCount={this.state.totalPageCount}
          isLoading={this.state.isLoading}
          handlePagination={this.handlePagination.bind(this)}
          addButtonText="New Account"
          rowPress={this.handleShowModal.bind(this, "showModal", "Account")}
          headers={this.returnTableHeaders()}
          handleAddPressed={this.handleShowModal.bind(
            this,
            "showModal",
            "Account"
          )}
          actions={actions}
          filters={[
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
          handleClose={this.handleCloseModal.bind(this, "showDeleteModal")}
          show={this.state.showDeleteModal}
          title={this.state.modalTitle}
        >
          <DeleteModal
            handleCloseModal={this.handleCloseModal.bind(
              this,
              "showDeleteModal"
            )}
            error={this.state.error.delete_password}
            delete_password={this.state.delete_password}
            onDelete={this.onDelete.bind(this)}
            onChangePassword={this.onChangeText.bind(this)}
            isDeleting={this.state.isDeleting}
          />
        </Modal>
        <CSVLink
          ref="csvDownload"
          filename={"Accounts" + new Date().getTime()}
          data={this.state.csvData}
        ></CSVLink>
      </div>
    );
  }
}

export default SubAccounts;
