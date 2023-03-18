import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { connect } from "react-redux";
import { onFilter } from "../../action/Filters";

let copyData = [];

class Surveys extends React.Component {
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
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/survey/fetch";

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
    await this.props.dispatch(
      onFilter({
        survey: {
          label: item.title,
          value: item._id,
        },
      })
    );

    window.location.href = "/dashboard/surveys/questions";
  };

  render() {
    let headers = [
      {
        title: "Title",
        key: "title",
      },
      {
        title: "Status",
        key: "status",
      },
      {
        title: "Points",
        key: "point",
      },
      {
        title: "Created By",
        key: "user.firstname",
      },
      {
        title: "Created At",
        key: "createdAt",
        isMoment: true,
        formatTime: "lll",
      },
    ];

    return (
      <div className="card-body">
        <Table
          data={this.state.data}
          isSearch
          page={this.state.page}
          limit={this.state.limit}
          search_text={this.state.search_text}
          handleSearch={this.handleSearch.bind(this)}
          isLoading={this.state.isLoading}
          rowPress={(item) => this.onRowPressed(item)}
          headers={headers}
        />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;

  return {
    filters,
  };
};

export default connect(mapStateToProps)(Surveys);
