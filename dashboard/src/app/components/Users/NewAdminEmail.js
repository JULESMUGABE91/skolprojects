import React from "react";
import { Button } from "../Button";
import { Input, Select } from "../Input";

import "./styles.css";
import { ENDPOINT } from "../../constants/api";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import { getStorage } from "../../utils/storage";
import validateEmail from "../../utils/validateEmail";
import { connect } from "react-redux";
import formatSelectData from "../../utils/formatSelectData";

class NewAdminEmail extends React.Component {
  state = {
    email: "",
    error: {},
    isSubmitting: false,
    user: {},
    _id: "",
    organizations: [],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    this.getOrganizationData(true);

    if (this.props.filters && this.props.filters.organization) {
      this.setState({ organization: this.props.filters.organization });
    }

    if (this.props._id && this.props._id !== "") {
      this.setState({
        ...this.props,
        organization: {
          label: this.props.organization.name,
          value: this.props.organization._id,
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

  returnFilters() {
    let request_body = {},
      { user } = this.state;

    if (
      user.account_type !== "super_admin" &&
      this.props?.filters &&
      this.props?.filters?.organization
    ) {
      request_body.id = this.props?.filters?.organization.value;
    }

    return request_body;
  }

  getOrganizationData(isLoading) {
    const { user } = this.state;

    this.setState({
      isLoading,
    });

    let url = ENDPOINT + "/organization";

    const options = {
      method: "GET",
      url,
      params: {
        ...this.returnFilters(),
      },
      headers: {
        authorization: "Bearer " + user.token,
      },
    };

    axios(options)
      .then((res) => {
        let data = res.data;

        if (!data) {
          data = res.data;
        }

        let formatted = formatSelectData(data, "name", "_id");
        this.setState({
          organizations: formatted,
          isLoading: false,
        });
      })
      .catch((error) => {
        this.setState({
          isLoading: false,
        });

        toastMessage("error", error);
      });
  }

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
    let { email, error, organization } = this.state;

    if (email === "") {
      error.email = "Email address is required";
    }
    if (!validateEmail(email)) {
      error.email = "Invalid email address";
    }

    if (!organization) {
      error.organization = "Organization is required";
    }

    console.log('====================================');
    console.log(organization);
    console.log('====================================');

    this.setState({
      error,
    });
  }

  onSubmit = async () => {
    await this.validateForm();

    const { user, error, email, _id, organization } = this.state;

    if (Object.keys(error).length === 0) {
      this.setState({
        isSubmitting: true,
      });

      let data = {
        email,
        organization: organization.value,
      };

      console.log('====================================');
      console.log(data);
      console.log('====================================');

      let url = ENDPOINT + "/user/admin_email_info",
        method = "POST";

      if (_id && _id !== "") {
        url = ENDPOINT + "/user/admin_email_info";
        method = "PUT";

        data.id = _id;
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

          toastMessage(
            "success",
            `Data ${_id && _id !== "" ? "updated" : "added"} successfully`
          );

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
              <Select
                options={this.state.organizations}
                label="Organization:"
                className="form-control-lg "
                value={this.state.organization}
                onChange={(e) => this.onChangeText("organization", e)}
                error={this.state.error.organization}
                isLoading={this.state.isLoading}
              />
            </div>
            <div className="col-md-12">
              <Input
                label="Email Address:"
                required
                className="form-control-lg"
                value={this.state.email}
                onChange={(e) => this.onChangeText("email", e)}
                error={this.state.error.email}
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

const mapStateToProps = (state) => {
  const { filters } = state.Filters;
  return {
    filters,
  };
};

export default connect(mapStateToProps)(NewAdminEmail);
