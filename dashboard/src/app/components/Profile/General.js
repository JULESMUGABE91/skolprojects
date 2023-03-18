import React from "react";
import { Button } from "../Button";
import { Input, Switch } from "../Input";
import profilePhoto from "../../assets/user-placeholder.png";

import "./style.css";
import { getStorage, setStorage } from "../../utils/storage";
import { onToggleAllNotification } from "../../action/Notification";
import { connect } from "react-redux";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";

class General extends React.Component {
  state = {
    user: {},
  };

  componentDidMount = async () => {
    const user = await getStorage();

    this.setState({
      user,
    });
  };

  handleNotificationToggle = (e) => {
    const { user } = this.state;
    this.props.dispatch(onToggleAllNotification(e.target.checked));

    const options = {
      method: "POST",
      url: ENDPOINT + "/update_user_account",
      data: {
        id: user.id,
        notification: e.target.checked,
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        toastMessage("error", error);
      });
  };

  render() {
    return (
      <div className="row">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6">
              <Input
                label="First Name"
                required
                className="form-control-lg"
                value={this.state.user.firstname}
                disabled
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Last Name"
                required
                className="form-control-lg"
                value={this.state.user.lastname}
                disabled
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Phone number"
                required
                className="form-control-lg"
                value={this.state.user.phone}
                disabled
              />
            </div>
            <div className="col-md-6">
              <Input
                label="Role"
                required
                disabled
                className="form-control-lg"
                value={this.state.user.account_type}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default General;
