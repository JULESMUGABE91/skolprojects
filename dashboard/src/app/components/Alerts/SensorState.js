import React from "react";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import socket from "../../utils/socketIO";
import { Modal } from "../Modal";
import { BinInfo } from "../Bins";
import { DeviceInfo } from "../Devices";

class SensorState extends React.Component {
  state = {
    data: [],
    page: 1,
    limit: 10,
    selected_bin: {},
    selected_device: {},
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    await this.getData(true);

    socket.on("alert", (new_alert) => {
      const alerts = this.state.data;

      for (let i = 0; i < alerts.length; i++) {
        if (alerts[i]._id == new_alert._id) {
          alerts[i] = new_alert;
        }
      }
      this.setState({
        data: alerts,
      });
    });
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
        status: this.props.status,
        page: this.state.page,
        limit: this.state.limit,
        type: "sensor_state",
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const { data, count } = res.data;

        this.setState({
          data,
          isLoading: false,
          totalPageCount: count,
        });
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoading: false });
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

  handleOpenModal(modal, selected_item) {
    let selected_bin = {},
      selected_device = {},
      modalTitle = "";

    if (modal === "showDeviceModal") {
      selected_device = selected_item;
      modalTitle = selected_item.device_id;
    } else {
      selected_bin = selected_item;
      modalTitle = selected_item.bin_id.bin_id;
    }

    this.setState({
      [modal]: true,
      // selected_bin,
      selected_device,
      modalTitle,
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
        alert: this.props.status === "resolved" ? "On" : "off",
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
            isSearch
            totalPageCount={this.state.totalPageCount}
            page={1}
            isLoading={this.state.isLoading}
            headers={[
              {
                title: "Status",
                key: "alert",
                type: "sensor_status",
              },
              {
                title: "Timestamp",
                key: "createdAt",
                isMoment: true,
                formatTime: "lll",
              },
              {
                title: "Bin Id",
                key: "bin_id.bin_id",
                type: "link",
                onPress: this.handleOpenModal.bind(this, "showModal"),
              },
              // {
              //   title: "Device Id",
              //   key: "s",
              //   type: "link",
              //   onPress: this.handleOpenModal.bind(this, "showDeviceModal"),
              // },
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
        >
          <BinInfo
            {...this.state.selected_bin}
            handleCloseModal={this.handleCloseModal.bind(this, "showModal")}
          />
        </Modal>
        <Modal
          handleClose={this.handleCloseModal.bind(this, "showDeviceModal")}
          show={this.state.showModal}
          title={this.state.modalTitle}
        >
          <DeviceInfo
            {...this.state.selected_device}
            handleCloseModal={this.handleCloseModal.bind(
              this,
              "showDeviceModal"
            )}
          />
        </Modal>
      </div>
    );
  }
}

export default SensorState;
