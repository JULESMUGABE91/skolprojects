import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { onToggle } from "../../action/ToggleSidebar";
import "./styles.css";

class Navbar extends React.Component {
  componentDidMount() {
    window.addEventListener("scroll", this.onScroll.bind(this), {
      passive: true,
    });
  }

  onScroll() {
    const scrollY = window.pageYOffset;
    const { innerWidth } = window;

    const navbar_dashboard = document.getElementById("dashboard-navbar");

    if (navbar_dashboard?.classList) {
      let nav_class_list = navbar_dashboard.classList;

      if (innerWidth < 750 && scrollY > 0) {
        if (navbar_dashboard) {
          nav_class_list.add("navbar_scrolled_style");
        }
      } else {
        nav_class_list.remove("navbar_scrolled_style");
      }
    }
  }

  toggleSidebar() {
    let isChecked = this.props.show_sidebar ? false : true;

    this.props.dispatch(onToggle(isChecked));
  }

  render() {
    let name = "",
      props = this.props;

    if (props.user && props.user.firstname) {
      name = props.user.firstname + " " + props.user.lastname;
    }

    let isUUID = /^[0-9a-fA-F]{24}$/;

    return (
      <nav className="dashboard-navbar">
        <div className="d-container d-left">
          <div className="d-toggle" onClick={this.toggleSidebar.bind(this)}>
            <i className="bx bx-menu" />
          </div>
          <h1>
            <span>{this.props.show_sidebar}</span>
            {!props.title.match(isUUID) && props.title}
          </h1>
        </div>
        <div className="d-container d-right">
          <div className="d-menu-item">
            <div className="dropdown">
              <Link
                className="dropdown-toggle"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
                to="#"
              >
                <div className="user-photo">{name.charAt(0).toUpperCase()}</div>
                <span
                  className="username-nav"
                  style={{ textTransform: "capitalize" }}
                >
                  {name}
                </span>
              </Link>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <Link to="/dashboard/accounts" className="dropdown-item">
                    My Account
                  </Link>
                </li>
                <li>
                  <Link
                    className="dropdown-item"
                    to="#"
                    onClick={props.onLogout}
                  >
                    Logout
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    );
  }
}

const mapStateToProps = (state) => {
  const { notifications } = state.Notification;
  const { show_sidebar } = state.ToggleSidebar;
  return { notifications, show_sidebar };
};

export default connect(mapStateToProps)(Navbar);
