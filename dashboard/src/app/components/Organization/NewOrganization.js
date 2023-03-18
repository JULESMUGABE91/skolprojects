import React from "react";
import { Button } from "../Button";
import { Input, Select } from "../Input";

import "./styles.css";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import { getStorage } from "../../utils/storage";
import { availables } from "../../constants/strings";

class NewOrganization extends React.Component {
  state = {
    name: "",
    error: {},
    isSubmitting: false,
    user: {},
    _id: "",
    available: availables[0],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    if (this.props._id && this.props._id !== "") {
      this.setState({
        ...this.props,
        available: {
          label: this.props.available + "",
          value: this.props.available + "",
        },
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
    let { name, error } = this.state;

    if (name === "") {
      error.name = "Name is required";
    }

    this.setState({
      error,
    });
  }

  onSubmit = async () => {
    await this.validateForm();

    const { name, available, user, _id, error } = this.state;

    if (Object.keys(error).length === 0) {
      this.setState({
        isSubmitting: true,
      });

      let url = ENDPOINT + "/organization",
        method = "POST";

      let data = {
        name,
        available: available.value,
      };

      if (_id !== "") {
        url = ENDPOINT + "/organization";
        data.id = _id;
        method = "PUT";
      }

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

          toastMessage("success", `Data added successfully`);

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
                label="Name:"
                required
                className="form-control-lg"
                value={this.state.name}
                onChange={(e) => this.onChangeText("name", e)}
                error={this.state.error.name}
              />
            </div>
            <div className="col-md-12">
              <Select
                options={availables}
                label="Available:"
                className="form-control-lg "
                value={this.state.available}
                onChange={(e) => this.onChangeText("available", e)}
                error={this.state.error.available}
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

export default NewOrganization;
