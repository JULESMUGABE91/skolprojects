import React from "react";
import { Button } from "../Button";
import { Input, Select } from "../Input";

import "./styles.css";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import { getStorage } from "../../utils/storage";
import { setDefaultLevel, setLevels } from "./accessLevel";

class UpdateUser extends React.Component {
  state = {
    name: "",
    error: {},
    isSubmitting: false,
    user: {},
    _id: "",
    access_levels: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    if (this.props._id && this.props._id !== "") {
      this.setState({
        ...this.props,
        access_level: setDefaultLevel(this.state.user.account_type),
      });
    }
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  onChangeText(name, e) {
    let error = this.state.error;
    let value = e.target ? e.target.value : e;

    delete error[name];

    this.setState({
      error,
      [name]: value,
    });
  }

  validateForm() {
    let { access_level, error } = this.state;

    if (!access_level) {
      error.access_level = "Please select access level";
    } else if (!access_level.value || access_level.value === "") {
      error.access_level = "Please select access level";
    }

    this.setState({
      error,
    });
  }

  onSubmit = async () => {
    await this.validateForm();

    const { user, error, access_level } = this.state;

    if (Object.keys(error).length === 0) {
      this.setState({
        isSubmitting: true,
      });

      let url = ENDPOINT + "/user/update",
        method = "POST";

      let data = {
        id: this.props._id,
        account_type: access_level.value,
      };

      const options = {
        method,
        url,
        data,
        headers: {
          authorization: "Bearer " + user.token,
        },
      };

      axios(options)
        .then((data) => {
          this.setState({
            isSubmitting: false,
            name: "",
          });

          toastMessage("success", `Account updated successfully`);

          this.props.handleCloseModal();
          this.props.getData(true);
        })
        .catch((error) => {
          this.setState({
            isSubmitting: false,
          });

          toastMessage("error", error);
        });
    }
  };

  render() {
    return (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <Input
                label="First Name:"
                required
                className="form-control-lg"
                value={this.state.firstname}
                onChange={(e) => this.onChangeText("firstname", e)}
                error={this.state.error.firstname}
                disabled
              />
            </div>
            <div className="col-md-12">
              <Input
                label="Last Name:"
                required
                className="form-control-lg"
                value={this.state.lastname}
                onChange={(e) => this.onChangeText("lastname", e)}
                error={this.state.error.lastname}
                disabled
              />
            </div>
            <div className="col-md-12">
              <Input
                label="Phone Number:"
                required
                className="form-control-lg"
                value={this.state.phone}
                onChange={(e) => this.onChangeText("phone", e)}
                error={this.state.error.phone}
                disabled
              />
            </div>
            <div className="col-md-12">
              <Select
                options={setLevels(this.state.user.account_type)}
                label="Access Level:"
                className="form-control-lg "
                value={this.state.access_level}
                onChange={(e) => this.onChangeText("access_level", e)}
                error={this.state.error.access_level}
              />
            </div>
          </div>
        </div>
        <hr />
        <div className="card-footer d-flex align-content-center justify-content-end gap-3">
          <Button
            text="Close"
            className="btn-default btn-lg border"
            onPress={this.props.handleCloseModal}
          />
          <Button
            isSubmitting={this.state.isSubmitting}
            text="Submit"
            className="btn-primary btn-lg"
            onPress={this.onSubmit.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default UpdateUser;
