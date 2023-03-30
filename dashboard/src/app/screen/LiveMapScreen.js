import React from "react";
import Map from "../components/Map/Map";
import { Home } from "./common";
import { getStorage } from "../utils/storage";
import socket from "../utils/socketIO";
import { ENDPOINT } from "../constants/api";
import axios from "axios";
import { connect } from "react-redux";

class LiveMapScreen extends React.Component {
  state = {
    user: {},
    data: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    await this.getData(true);

    socket.on("answer", () => {
      this.getData(false);
    });
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

    if (this.props?.filters && this.props?.filters?.user) {
      request_body.user = this.props?.filters?.user.value;
    }

    return request_body;
  }

  getData(isLoading) {
    const { user } = this.state;
    this.setState({
      isLoading,
    });

    let request_body = this.returnFilters();

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/group_user",
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        this.setState({
          isLoading: false,
          data: res.data,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });
      });
  }

  render() {
    const legend = {
      styles: {
        right: 0,
        top: 0,
        margin: 25,
      },
      items: [
        {
          color: "#000000",
          icon: "bx-user",
          name: "Completed Survey",
        },
        {
          color: "#FD0C0C",
          icon: "bxs-user",
          name: "Incomplete Survey",
        },
      ],
    };

    return (
      <div>
        <Home isCountCard organization survey user />
        <div style={{ position: "relative", marginTop: "1rem" }}>
          <Map
            isLoading={this.state.isLoading}
            legend={legend}
            data={this.state.data}
            type="bin_level"
          />
        </div>
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

export default connect(mapStateToProps)(LiveMapScreen);
