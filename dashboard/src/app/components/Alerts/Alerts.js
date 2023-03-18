import React from "react";
import Table from "../Table/Table";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import socket from "../../utils/socketIO";
import { Modal } from "../Modal";
import BinInfo from "../Bins/BinInfo";
import { connect } from "react-redux";
import {
  onAddNotification,
  onClearCount,
  onReadNotification,
} from "../../action/Notification";
import { Home } from "../../screen/common";
import { CSVLink } from "react-csv";
import exportPDF from "../../utils/exportPDF";

let copyData = [];
class Alerts extends React.Component {
  state = {
    data: [],
    page: 1,
    limit: 10,
    selected_bin: {},
    csvData: [],
    user: {},
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    await this.getData(true);

    socket.on("alert", (new_alert) => {
      const alerts = this.state.data;

      this.props.dispatch(
        onAddNotification({
          title: new_alert.bin_id.bin_id,
          body: new_alert.alert,
          level: new_alert.level,
          date: new_alert.createdAt,
          id: new_alert._id,
          isAlert: true,
          type: this.props.type,
        })
      );

      for (let i = 0; i < alerts.length; i++) {
        if (alerts[i]._id == new_alert._id) {
          alerts[i] = new_alert;
        }
      }
      this.setState({
        data: alerts,
      });
    });

    //clear counts
    if (this.props.type === "bin_level") {
      this.props.dispatch(onClearCount("alert_bin_unresolved"));
    }
    if (this.props.type === "sensor_state") {
      this.props.dispatch(onClearCount("count_alertsensor_unresolved"));
    }
  };

  componentDidUpdate(prevProps) {
    if (this.state.user.token && prevProps.filters !== this.props.filters) {
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
    const { filters } = this.props;

    let request_body = {};

    if (filters && filters.locations && filters.locations.length > 0) {
      request_body.sectors = filters.locations;
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

    if (filters && filters.start_date && filters && filters.end_date) {
      request_body.start_date = new Date(filters.start_date).getTime();
      request_body.end_date = new Date(filters.end_date).getTime();
    }

    return request_body;
  }

  getData(isLoading) {
    const { user, page, limit } = this.state;
    const { bin_id, type, status } = this.props;

    this.setState({
      isLoading,
    });

    let request_body = this.returnFilters();

    request_body.status = status;
    request_body.page = page;
    request_body.limit = limit;
    request_body.type = type;
    request_body.bin_id = bin_id;

    const options = {
      method: "POST",
      url: ENDPOINT + "/get_alert_incident_info",
      data: request_body,
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

        if (data.length > 0) {
          copyData = data.slice(0);
        }
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

  handleSearch(e) {
    const search_text = e.target.value;

    this.setState({ search_text });

    let array = [];

    for (let i = 0; i < copyData.length; i++) {
      if (
        JSON.stringify(copyData[i])
          .toLowerCase()
          .indexOf(search_text.toLowerCase()) !== -1
      ) {
        array.push(copyData[i]);
      }
    }

    this.setState({ data: array });
  }

  downloadExcel() {
    const { user } = this.state;
    const { bin_id, type, status } = this.props;

    this.setState({
      isLoading: true,
    });

    let request_body = this.returnFilters();

    request_body.status = status;
    request_body.type = type;
    request_body.bin_id = bin_id;

    const options = {
      method: "POST",
      url: ENDPOINT + "/get_alert_incident_info",
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const data = res.data;

        let result = [];

        for (let i = 0; i < data.length; i++) {
          delete data[i].info;
          delete data[i]._v;

          if (data[i].address) {
            data[i].address = data[i].address.geolocation;
          }

          if (data[i].bin_id) {
            data[i].bin_id = data[i].bin_id.bin_id;
          }

          if (data[i].device_id) {
            data[i].device_id = data[i].device_id.imei;
          }

          result.push({
            ...data[i],
          });
        }

        this.setState(
          {
            csvData: result,
            isLoading: false,
          },
          () => {
            this.refs.csvDownload?.link.click();
          }
        );
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoading: false });
      });
  }

  downloadPDF() {
    const headers = this.returnTableHeaders();

    const { user } = this.state;
    const { bin_id, type, status } = this.props;

    this.setState({
      isLoading: true,
    });

    let request_body = this.returnFilters();

    request_body.status = status;
    request_body.type = type;
    request_body.bin_id = bin_id;

    const options = {
      method: "POST",
      url: ENDPOINT + "/get_alert_incident_info",
      data: request_body,
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        const data = res.data;

        this.setState({ isLoading: false });

        exportPDF(
          this.props.type === "bin_level" ? "Bin Levels" : "Sensor state",
          headers,
          data
        );
      })
      .catch((error) => {
        toastMessage("error", error);
        this.setState({ isLoading: false });
      });
  }

  returnTableHeaders() {
    let headers = [
      this.props.type === "sensor_state"
        ? {
            title: "Updated At",
            key: "updatedAt",
            isMoment: true,
            formatTime: "lll",
          }
        : {
            title: "Levels",
            key: "level",
            type: "level",
          },
      {
        title: "Created At",
        key: "createdAt",
        isMoment: true,
        formatTime: "lll",
      },
      {
        title: "Location",
        key: "bin_id.address.geolocation",
      },
      // this.props.type==="sensor_state" && {
      //   title: "Device Id",
      //   key: "device_id.device_id",
      //   type: "link",
      //   onPress: this.handleOpenModal.bind(this, "showModal"),
      // },
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
    ];
    return headers;
  }

  render() {
    return (
      <>
        <Home date location level={this.props.type === "bin_level"} />
        <div className="card">
          <div className="card-body">
            <Table
              data={this.state.data}
              no_bordered
              isSearch
              style={{ marginBottom: 0 }}
              totalPageCount={this.state.totalPageCount}
              page={this.state.page}
              limit={this.state.limit}
              search_text={this.state.search_text}
              handleSearch={this.handleSearch.bind(this)}
              isLoading={this.state.isLoading}
              handlePagination={this.handlePagination.bind(this)}
              headers={this.returnTableHeaders()}
              actions={[
                {
                  name:
                    this.props.status === "resolved"
                      ? "Unresolved"
                      : "Resolved",
                  onPress: this.onUpdateAlert.bind(this),
                },
              ]}
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
          <CSVLink
            ref="csvDownload"
            filename={this.props.type + new Date().getTime()}
            data={this.state.csvData}
          ></CSVLink>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state) => {
  const { notifications } = state.Notification;
  const { filters } = state.Filters;

  return { notifications, filters };
};

export default connect(mapStateToProps)(Alerts);
