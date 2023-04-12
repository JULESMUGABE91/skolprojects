import React from "react";
import Map from "../components/Map/Map";
import { Home } from "./common";
import { getStorage } from "../utils/storage";
import socket from "../utils/socketIO";
import { ENDPOINT } from "../constants/api";
import axios from "axios";
import { connect } from "react-redux";
import filtersHandler from "../utils/filtersHandler";
import { saveDownload } from "../utils/download";
import toastMessage from "../utils/toastMessage";

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

  getData(isLoading) {
    const { user } = this.state;
    this.setState({
      isLoading,
    });

    let request_body = filtersHandler(this.props.filters);

    const options = {
      method: "POST",
      url: ENDPOINT + "/answer/group_user",
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    console.log(options);

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

  onDownload = async (marker) => {
    const { identifier, survey, organization } = marker;

    const { user } = this.state;

    this.setState({
      isDownloading: true,
    });

    toastMessage("info", "Downloading...");

    let url = ENDPOINT + "/answer/report/pdf";

    const options = {
      method: "POST",
      url,
      data: {
        identifier,
        user: marker.user._id,
        organization,
        survey,
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then(async (res) => {
        let data = res.data;

        await saveDownload({
          file: data,
          identifier,
          user: marker.user.firstname + " " + marker.user.lastname,
        });

        this.setState({
          isDownloading: false,
        });

        toastMessage("success", "Download is completed");
      })
      .catch((error) => {
        this.setState({
          isDownloading: false,
        });

        toastMessage("error", error);
      });
  };

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
        <Home isCountCard organization survey user date />
        <div style={{ position: "relative", marginTop: "1rem" }}>
          <Map
            isLoading={this.state.isLoading}
            isDownloading={this.state.isDownloading}
            onDownload={(params) => this.onDownload(params)}
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
