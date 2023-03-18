import React from "react";
import { Button } from "../Button";
import { Input } from "../Input";
import validateEmail from "../../utils/validateEmail";

import "./style.css";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";

class AdminRegister extends React.Component {
  state = {
    email: "",
    password: "",
    error: {},
    isSubmitting: false,
  };

  onChangeText(name, e) {
    let error = this.state.error;

    delete error[name];

    this.setState({
      error,
      [name]: e.target.value,
    });
  }
  validateForm() {
    let { email, error, password } = this.state;

    if (email === "") {
      error.email = "Email address is required";
    } else if (!validateEmail(email)) {
      error.email = "Invalid email address";
    }

    if (password === "") {
      error.password = "Password is required";
    }
  }

  onSubmit = async () => {
    await this.validateForm();

    const { email, password, error } = this.state;

    if (Object.keys(error).length === 0) {
      this.setState({
        isSubmitting: true,
      });

      const options = {
        method: "POST",
        url: ENDPOINT + "/admin_register",
        data: {
          email,
          password,
        },
      };

      axios(options)
        .then((data) => {
          this.setState({
            isSubmitting: false,
            email: "",
            password: "",
          });

          toastMessage("success", "Admin account was created successfully");
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
      <div className="row">
        <div className="col-md-8">
          <div className="row">
            <div className="col-md-6">
              <Input
                label="Email Address"
                required
                required
                className="form-control-lg mb-4"
                value={this.state.email}
                onChange={(e) => this.onChangeText("email", e)}
                error={this.state.error.email}
              />
            </div>
            <div className="col-md-6">
              <Input
                type="password"
                label="Password:"
                required
                className="form-control-lg mb-4"
                value={this.state.password}
                onChange={(e) => this.onChangeText("password", e)}
                error={this.state.error.password}
              />
            </div>
            <div className="col-md-3">
              <Button
                isSubmitting={this.state.isSubmitting}
                text="Submit"
                className="btn-primary w-100 btn-lg"
                onPress={this.onSubmit.bind(this)}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AdminRegister;
