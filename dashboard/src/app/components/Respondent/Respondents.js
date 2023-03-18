import axios from "axios";
import React from "react";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { connect } from "react-redux";

let copyData = [];

class Respondents extends React.Component {
  state = {
    data: [],
    isLoading: true,
    user: {},
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
    let request_body = {
      tags: ["phone_number", "gender", "textinput", "name", "idpassport"],
    };

    // if (this.props?.filters && this.props?.filters?.organization) {
    //   request_body.organization = this.props?.filters?.organization.value;
    // }

    // if (this.props?.filters && this.props?.filters?.survey) {
    //   request_body.survey = this.props?.filters?.survey.value;
    // }

    // if (this.props?.filters && this.props?.filters?.question) {
    //   request_body.question = this.props?.filters?.question.value;
    // }

    return request_body;
  }

  getData(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/respondent/fetch";

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
        console.log("====================================");
        console.log({ data: res.data });
        console.log("====================================");
        let headers = [];

        if (res.data.length > 0) {
          headers = {};
        }

        for (let el of data.data) {
        }
        this.setState({
          // data,
          isLoading: false,
        });

        if (data.length !== 0) {
          copyData = data.slice(0);
        }

        console.log({ copyData });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
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

  render() {
    let headers = [
      {
        title: "Name",
        key: "name",
      },
      {
        title: "Phone Number",
        key: "phone_number",
      },
      {
        title: "Gender",
        key: "gender",
      },
      {
        title: "ID/Passport",
        key: "id_passport",
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

export default connect(mapPropsToState)(Respondents);
