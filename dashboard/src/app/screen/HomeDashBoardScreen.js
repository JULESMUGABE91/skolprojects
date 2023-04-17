import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import { Navbar } from "../components/Navbar";
import { Sidebar } from "../components/Sidebar";
import { ENDPOINT } from "../constants/api";
import { clearStorage, getStorage } from "../utils/storage";
import toastMessage from "../utils/toastMessage";
import socket from "../utils/socketIO";
import { onToggle } from "../action/ToggleSidebar";
class DashboardLayout extends React.Component {
  state = {
    user: {},
  };
  componentDidMount = async () => {
    const user = await getStorage();

    if (!user.token) {
      // window.location.href = "/login";
      return;
    } else {
      this.setState({
        user,
      });
    }

    const { innerWidth } = window;

    if (innerWidth < 750) {
      this.props.dispatch(onToggle(false));
    }

    window.addEventListener("resize", this.handleResize.bind(this));
    window.addEventListener("message", (data) => {
      console.log("====================================");
      console.log("from webview", data);
      console.log("====================================");
    });
  };

  componentDidUpdate(nextProps) {
    if (this.props.location.pathname !== nextProps.location.pathname) {
      const { innerWidth } = window;

      if (innerWidth < 750) {
        this.props.dispatch(onToggle(false));
      }
    }
  }

  handleResize() {
    const { innerWidth } = window;

    if (innerWidth > 750) {
      this.props.dispatch(onToggle(true));
    } else {
      this.props.dispatch(onToggle(false));
    }
  }

  onLogout = async () => {
    await clearStorage();
    this.props.dispatch({ type: "ON_USER_LOGOUT" });

    window.location.href = "/login";
  };

  render() {
    let { location } = this.props;

    let pathname = location && location.pathname ? location.pathname : "";

    let title = "";

    if (pathname !== "") {
      const last_t = pathname.split("/");

      title = last_t[last_t.length - 1].replace("_", " ");
    }

    return (
      <div className="main-layout-dashboard">
        <Sidebar {...this.props} />
        <div className="dash-container-wrapper">
          <Navbar
            onLogout={this.onLogout.bind(this)}
            title={title}
            user={this.state.user}
          />
          <div className="dash-content">{this.props.children}</div>
        </div>
      </div>
    );
  }
}

export default connect(null)(DashboardLayout);
