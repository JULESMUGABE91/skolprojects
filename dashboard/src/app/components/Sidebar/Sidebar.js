import React from "react";
import { Link } from "react-router-dom";
import { menus } from "../../constants/sidebar-menus";
import Logo from "../../assets/logo.png";
import "./styles.css";
import { getStorage } from "../../utils/storage";
import { connect } from "react-redux";
import toastMessage from "../../utils/toastMessage";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import { onAddCounts } from "../../action/Notification";
import { onToggle } from "../../action/ToggleSidebar";

class Sidebar extends React.Component {
  state = {
    sidebar_menus: menus.slice(0),
  };

  componentDidMount = async () => {
    const user = await getStorage();
    if (user.access_role) {
      const { denied_menu } = user.access_role;

      this.handleAccessMenu(denied_menu);
    }
    document.addEventListener(
      "click",
      this.handleClickOutside.bind(this),
      true
    );
  }

  handleAccessMenu(denied_menu) {
    let group_menus = {};

    for (let i = 0; i < menus.length; i++) {
      if (!group_menus[menus[i].group]) {
        group_menus[menus[i].group] = [];
      }

      if (menus[i].items) {
        group_menus[menus[i].group].push(...menus[i].items);
      } else {
        group_menus[menus[i].group] = menus[i];
      }
    }

    for (let i = 0; i < denied_menu.length; i++) {
      let g = denied_menu[i].value.split("/")[0];

      let name = denied_menu[i].value.split("/")[1];

      let items = group_menus[g];

      for (let sub = 0; sub < items.length; sub++) {
        if (items[sub].name === name) {
          items.splice(sub, 1);
        }
      }

      if (items.length === 0) {
        delete group_menus[g];
      } else {
        group_menus[g].items = items;
      }
    }

    let allowed_menus = [],
      sidebar_menus = [];

    let keys = Object.keys(group_menus);

    for (let i = 0; i < keys.length; i++) {
      allowed_menus.push(keys[i]);
    }

    for (let i = 0; i < menus.length; i++) {
      if (allowed_menus.includes(menus[i].group)) {
        if (menus[i].items) {
          menus[i].items = group_menus[menus[i].group];
        }
        sidebar_menus.push(menus[i]);
      }
    }

    this.setState({
      sidebar_menus,
    });
  }

  toggleMenu(index) {
    let menu = this.state.sidebar_menus[index];

    menu.show = !menu.show;

    this.state.sidebar_menus[index] = menu;

    this.setState({
      sidebar_menus: this.state.sidebar_menus,
    });
  }

  toggleSidebar() {
    this.props.dispatch(onToggle(false));
  }

  handleClickOutside(event) {
    const { innerWidth } = window;

    if (
      this.refs.sidebar &&
      !this.refs.sidebar.contains(event.target) &&
      innerWidth < 750
    ) {
      this.props.dispatch(onToggle(false));
    }
  }

  render() {
    const { location, show_sidebar } = this.props;

    let pathname = location && location.pathname ? location.pathname : "";

    return (
      <div
        id="sidebar dashboard-sidebar"
        className={`sidebar ${show_sidebar ? "show" : "hide"}`}
        ref="sidebar"
      >
        <div className="header">
          <div className="logo">
            <img src={Logo} />
          </div>
          <span className="name">
            <b>Zawadi</b>
          </span>
          <div className="mobile-close" onClick={this.toggleSidebar.bind(this)}>
            <i className="bx bxs-arrow-from-right"></i>
          </div>
        </div>

        <div className="middle">
          <ul>
            {this.state.sidebar_menus.map((menu, m) => {
              return (
                <li key={m}>
                  {menu.title !== "" && menu.items ? (
                    <div
                      className="menu-item-header"
                      onClick={menu.items && this.toggleMenu.bind(this, m)}
                    >
                      <h1
                        className={
                          pathname.includes(
                            menu.group.toLowerCase().replace(" ", "_")
                          )
                            ? "text-primary"
                            : ""
                        }
                      >
                        <i className={`bx ${menu.icon} left-icon`} />
                        {menu.group}
                      </h1>
                      {menu.items && (
                        <div className="menu-header-right-icon">
                          <i className="bx bx-chevron-down" />
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link className="menu-item-header" to={menu.route}>
                      <h1
                        className={
                          pathname.includes(
                            menu.group.toLowerCase().replace(" ", "_")
                          )
                            ? "text-primary"
                            : ""
                        }
                      >
                        <i className={`bx ${menu.icon} left-icon`} />
                        {menu.group}
                      </h1>
                      {menu.items && (
                        <div className="menu-header-right-icon">
                          <i className="bx bx-chevron-down" />
                        </div>
                      )}
                    </Link>
                  )}

                  <div className={`sub-menus ${menu.show ? "show" : ""}`}>
                    {menu.items &&
                      menu.items.map((item, i) => {
                        return (
                          <Link
                            key={i}
                            to={
                              "/dashboard/" +
                              menu.group.toLowerCase() +
                              "/" +
                              item.name.replace(" ", "_").toLowerCase()
                            }
                            title={item.name}
                            className={
                              pathname.includes(
                                menu.group.toLowerCase() +
                                  "/" +
                                  item.name.toLowerCase().replace(" ", "_")
                              )
                                ? "active"
                                : ""
                            }
                          >
                            <div className="sidebar-item-icon">
                              <i className={item.icon}></i>
                            </div>
                            <span>{item.name}</span>
                            {menu.group === "Alerts" &&
                              this.props.counts?.alert_bin_unresolved > 0 &&
                              item.name == "Waste Bin Levels" && (
                                <div className="sidebar-notification-count">
                                  <span>
                                    {this.props.counts.alert_bin_unresolved > 9
                                      ? "+9"
                                      : this.props.counts.alert_bin_unresolved}
                                  </span>
                                </div>
                              )}
                            {menu.group === "Alerts" &&
                              item.name == "Sensor State" &&
                              this.props.counts?.count_alertsensor_unresolved >
                                0 && (
                                <div className="sidebar-notification-count">
                                  <span>
                                    {this.props.counts
                                      .count_alertsensor_unresolved > 9
                                      ? "+9"
                                      : this.props.counts
                                          .count_alertsensor_unresolved}
                                  </span>
                                </div>
                              )}
                            {menu.group === "Schedules" &&
                              item.name == "Pending Schedules" &&
                              this.props.counts?.count_pending_schedule > 0 && (
                                <div className="sidebar-notification-count">
                                  <span>
                                    {this.props.counts.count_pending_schedule >
                                    9
                                      ? "+9"
                                      : this.props.counts
                                          .count_pending_schedule}
                                  </span>
                                </div>
                              )}
                          </Link>
                        );
                      })}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { notifications, counts } = state.Notification;
  const { show_sidebar } = state.ToggleSidebar;

  return { notifications, counts, show_sidebar };
};

export default connect(mapStateToProps)(Sidebar);
