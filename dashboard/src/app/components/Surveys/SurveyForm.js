import axios from "axios";
import React from "react";
import { connect } from "react-redux";
import { getStorage } from "../../utils/storage";
import { ENDPOINT } from "../../constants/api";
import toastMessage from "../../utils/toastMessage";
import { availables, audiences } from "../../constants/strings";
import { Button } from "../Button";
import { Input, Select } from "../Input";

class SurveyForm extends React.Component {
  state = {
    title: "",
    description: "",
    point: "",
    status: "Private",
    introduction: "",
    available: {
      label: "True",
      value: true,
    },
    error: {},
    audience: audiences[0],
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();

    let { filters } = this.props;

    if (filters && filters.organization) {
      this.setState({ organization: filters.organization });
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
    let { title, error, organization } = this.state;

    if (title === "") {
      error.title = "Title is required";
    }

    if (!organization) {
      error.organization = "Organization is required";
    }

    this.setState({
      error,
    });
  }

  onSubmit = async () => {
    await this.validateForm();

    const {
      title,
      description,
      point,
      available,
      user,
      _id,
      error,
      audience,
      introduction,
    } = this.state;
    const { filters } = this.props;

    if (Object.keys(error).length === 0) {
      this.setState({
        isSubmitting: true,
      });

      let url = ENDPOINT + "/survey/add",
        method = "POST";

      let data = {
        title,
        description,
        point,
        organization: filters.organization.value,
        status: audience.value,
        user: user._id,
        available: available.value,
        introduction,
      };

      if (_id && _id !== "") {
        url = ENDPOINT + "/survey/update";
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
    console.log("====================================");
    console.log([this.state.organization]);
    console.log("====================================");
    return (
      <div className="card">
        <div className="card-body">
          <div className="row">
            <div className="col-md-12">
              <Select
                options={[this.props?.filters?.organization] || []}
                label="Organization:"
                className="form-control-lg "
                value={this.state.organization}
                onChange={(e) => this.onChangeText("organization", e)}
                error={this.state.error.organization}
              />
            </div>
            <div className="col-md-12">
              <Input
                label="Title:"
                required
                className="form-control-lg"
                value={this.state.title}
                onChange={(e) => this.onChangeText("title", e)}
                error={this.state.error.title}
              />
            </div>
            <div className="col-md-12">
              <Input
                label="Description:"
                className="form-control-lg"
                value={this.state.description}
                onChange={(e) => this.onChangeText("description", e)}
                error={this.state.error.description}
              />
            </div>
            <div className="col-md-12">
              <Input
                label="Point:"
                className="form-control-lg"
                value={this.state.point}
                onChange={(e) => this.onChangeText("point", e)}
                error={this.state.error.point}
                type="number"
              />
            </div>
            <div className="col-md-12">
              <Input
                label="Introduction:"
                className="form-control-lg"
                value={this.state.introduction}
                onChange={(e) => this.onChangeText("introduction", e)}
                error={this.state.error.introduction}
              />
            </div>
            <div className="col-md-12">
              <Select
                options={audiences}
                label="Audience:"
                className="form-control-lg "
                value={this.state.audience}
                onChange={(e) => this.onChangeText("audience", e)}
                error={this.state.error.audience}
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
        <div className="card-footer">
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

export default connect(mapStateToProps)(SurveyForm);
