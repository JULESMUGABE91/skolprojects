import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import { Modal } from "../Modal";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import NewOrganization from "./NewOrganization";
import { onFilter } from "../../action/Filters";
import { connect } from "react-redux";
import formatSelectData from "../../utils/formatSelectData";

let copyData = [];

class Organizations extends React.Component {
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
    let request_body = {},
      { user } = this.state;

    if (
      user.account_type !== "super_admin" &&
      this.props?.filters &&
      this.props?.filters?.organization
    ) {
      request_body.id = this.props?.filters?.organization.value;
    }

    return request_body;
  }

  getData(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/organization";

    const options = {
      method: "GET",
      url,
      params: {
        ...this.returnFilters(),
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    console.log("====================================");
    console.log(options);
    console.log("====================================");

    axios(options)
      .then((res) => {
        let data = res.data;

        if (!data) {
          data = res.data;
        }

        let formatted = formatSelectData(data, "name", "_id");
        this.setState({
          data: formatted,
          isLoading: false,
        });

        if (data.length !== 0) {
          copyData = formatted.slice(0);
        }
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

  onChangeText(name, e) {
    let { error } = this.state;

    delete error[name];

    this.setState({
      [name]: e.target.value,
      error,
    });
  }

  onDelete = async () => {
    if (window.confirm("Do you want to delete")) {
      let { data, selected_data, user, error } = this.state;

      if (Object.keys(error).length === 0) {
        this.setState({
          data,
          isDeleting: true,
        });

        let url = ENDPOINT + "/organization";

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
    }
  };

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

  onRowPressed = async (item) => {
    await this.props.dispatch(
      onFilter({
        organization: {
          label: item.name,
          value: item._id,
        },
      })
    );

    window.location.href = "/dashboard/surveys/all_surveys";
  };

  render() {
    let headers = [
      {
        title: "Name",
        key: "name",
      },
      {
        title: "Available",
        key: "available",
      },
      // {
      //   title: "Action",
      //   key: "action",
      // },
    ];

    return (
      <div>
        <Table
          data={this.state.data}
          isSearch
          showAdd
          page={this.state.page}
          limit={this.state.limit}
          search_text={this.state.search_text}
          handleSearch={this.handleSearch.bind(this)}
          isLoading={this.state.isLoading}
          handlePagination={this.handlePagination.bind(this)}
          addButtonText="Add Organization"
          rowPress={(item) => {
            this.onRowPressed(item);
          }}
          headers={headers}
          handleAddPressed={this.handleShowModal.bind(
            this,
            "showModal",
            "Organization"
          )}
          // actions={[
          //   {
          //     name: "Edit",
          //     onPress: (item) =>
          //       this.handleShowModal("showModal", "Edit Organization", item),
          //   },
          //   {
          //     name: "Delete",
          //     onPress: this.handleShowModal.bind(
          //       this,
          //       "showDeleteModal",
          //       "Delete Organization"
          //     ),
          //   },
          // ]}
        />
        <Modal
          handleClose={this.handleCloseModal.bind(this, "showModal")}
          show={this.state.showModal}
          title={this.state.modalTitle}
          showHeaderBottomBorder={false}
        >
          <NewOrganization
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

export default connect(mapPropsToState)(Organizations);
