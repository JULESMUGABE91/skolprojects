import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { onFilter } from "../../action/Filters";
import { connect } from "react-redux";

let copyData = [];

class Questions extends React.Component {
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

  componentDidUpdate(prevProps) {
    if (prevProps.filters !== this.props.filters) {
      this.getData(true);
    }
  }

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

    if (this.props?.filters && this.props?.filters?.survey) {
      request_body.survey = this.props?.filters?.survey.value;
    }

    return request_body;
  }

  getData(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/question/fetch";

    const options = {
      method: "POST",
      url,
      data: {
        ...this.returnFilters(),
      },
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
          data,
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
    await this.props.dispatch(onFilter({ organization: item }));

    window.location.href = "/dashboard/home/all_surveys";
  };

  render() {
    let headers = [
      {
        title: "Question",
        key: "question",
      },
      {
        title: "Organization",
        key: "organization.name",
      },
      {
        title: "Survey",
        key: "survey.title",
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
          handleAddPressed={this.handleShowModal.bind(
            this,
            "showModal",
            "Organization"
          )}
        />
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

export default connect(mapPropsToState)(Questions);
