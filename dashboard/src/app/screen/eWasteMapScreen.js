import React from "react";
import Map from "../components/Map/Map";
import { Home } from "./common";
import { getStorage } from "../utils/storage";
import socket from "../utils/socketIO";
import { ENDPOINT } from "../constants/api";
import axios from "axios";
import { connect } from "react-redux";

class eWasteMapScreen extends React.Component {
  state = {
    user: {},
    data: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    await this.getData(true);

    socket.on("waste_level", (bin) => {
      const bins = this.state.data;

      for (let i = 0; i < bins.length; i++) {
        if (bins[i]._id == bin._id) {
          bins[i] = bin;
        }
      }
      this.setState({
        data: bins,
      });
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
    const { filters } = this.props;

    this.setState({
      isLoading,
    });

    let request_body = {
      target: "last",
    };

    if (filters && filters.locations) {
      request_body.sectors =
        filters.locations.length > 0 ? filters.locations : undefined;
    }

    if (
      filters &&
      (filters.level_min || filters.level_min === 0) &&
      filters.level_max
    ) {
      request_body.start_level_percentage =
        filters.level_min !== "" ? filters.level_min : undefined;

      request_body.end_level_percentage =
        filters.level_max !== "" ? filters.level_max : undefined;
    }

    if (filters && filters.just_collected) {
      request_body.just_collected = true;
    }

    if (filters && filters.types) {
      request_body.types = filters.types.length > 0 ? filters.types : undefined;
    }

    const options = {
      method: "POST",
      url: ENDPOINT + "/get_wastelevel_info",
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let response_data = res.data,
          data = [];

        for (let i = 0; i < response_data.length; i++) {
          response_data[i].last.address = response_data[i].bin[0].address;
          data.push({
            ...response_data[i].last,
            bin:
              response_data[i].bin && response_data[i].bin.length > 0
                ? response_data[i].bin[0]
                : {},
          });
        }

        this.setState({
          isLoading: false,
          data,
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
          color: "#7A7D7A",
          icon: "bx-trash-alt",
          name: "Low Waste Level",
        },
        {
          color: "rgb(121, 2, 121)",
          icon: "bx-trash",
          name: "Mid Low Level",
        },
        {
          color: "#000000",
          icon: "bx-trash",
          name: "Mid High Level",
        },
        {
          color: "#FD0C0C",
          icon: "bxs-trash-alt",
          name: "Almost Full Level",
        },
        {
          color: "#0530C6",
          icon: "bxs-trash",
          name: "Just Collected",
        },
        {
          color: "transparent",
          icon: "bxs-trash",
          name: "N Grouped Bins",
          className: "n_group",
        },
      ],
    };

    return (
      <div>
        <Home isCountCard location type level />
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

export default connect(mapStateToProps)(eWasteMapScreen);
