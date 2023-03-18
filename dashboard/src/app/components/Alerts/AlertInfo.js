import React from "react";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import { Modal } from "../Modal";
import BinInfo from "../Bins/BinInfo";

class AlertInfo extends React.Component {
  state = {
    data: [],
    selected_bin: {},
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    await this.getData(true);
  };

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

    const options = {
      method: "POST",
      url: ENDPOINT + "/get_alert_incident_info",
      data: {
        id: this.props.id ? this.props.id : this.props._id,
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const data = res.data;

        this.setState({
          data,
          isLoading: false,
        });
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoading: false });
      });
  }

  handleOpenModal(modal, selected_bin) {
    this.setState({
      [modal]: true,
      selected_bin: selected_bin.bin_id ? selected_bin.bin_id : {},
      modalTitle: selected_bin.bin_id
        ? "Bin #" + selected_bin.bin_id.bin_id
        : "",
    });
  }

  handleCloseModal(modal) {
    this.setState({
      [modal]: false,
    });
  }

  onUpdateAlert(alert) {
    let { data, user } = this.state;
    for (let i = 0; i < data.length; i++) {
      if (data[i]._id === alert._id) {
        delete data[i];
      }
    }

    this.setState({ data });

    const options = {
      method: "POST",
      url: ENDPOINT + "/update_alert_incident_info",
      data: {
        id: alert._id,
        status: this.props.status === "resolved" ? "unresolved" : "resolved",
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((data) => {
        this.getData(false);
      })
      .catch((error) => {
        toastMessage("error", "Failed to update alert");
      });
  }

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <Table
            data={this.state.data}
            no_bordered
            isLoading={this.state.isLoading}
            headers={[
              {
                title: "Levels",
                key: "level",
                type: "level",
              },
              {
                title: "Timestamp",
                key: "date",
                isMoment: true,
                formatTime: "lll",
              },
              {
                title: "Location",
                key: "bin_id.address.geolocation",
              },
              {
                title: "Bin Id",
                key: "bin_id.bin_id",
                type: "link",
                onPress: this.handleOpenModal.bind(this, "showModal"),
              },
              {
                title: "Alert",
                key: "alert",
              },
              {
                title: "Action",
                key: "action",
              },
            ]}
            actions={[
              {
                name:
                  this.props.status === "resolved" ? "Unresolved" : "Resolved",
                onPress: this.onUpdateAlert.bind(this),
              },
            ]}
          />
        </div>
        <Modal
          handleClose={this.handleCloseModal.bind(this, "showModal")}
          show={this.state.showModal}
          title={this.state.modalTitle}
          size="lg"
        >
          <BinInfo
            {...this.state.selected_bin}
            handleCloseModal={this.handleCloseModal.bind(this, "showModal")}
          />
        </Modal>
      </div>
    );
  }
}

export default AlertInfo;
