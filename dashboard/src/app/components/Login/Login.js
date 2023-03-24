import React from "react";
import "./styles.css";
import { Button } from "../Button";
import Input from "../Input/Input";
import axios from "axios";
import toastMessage from "../../utils/toastMessage";
import { ENDPOINT } from "../../constants/api";
import { setStorage } from "../../utils/storage";
import countries from "../../constants/countries";
import { Select } from "../Input";
import logo from "../../assets/logo.png";
import { onFilter } from "../../action/Filters";
import { connect } from "react-redux";

class Login extends React.Component {
  state = {
    phone: "",
    otp_code: "",
    isSubmitting: false,
    error: {},
    selected_country: countries[0],
  };

  onChangeText(name, e) {
    let { error } = this.state,
      text = e.target.value;

    delete error[name];

    if (name === "phone" && text !== "") {
      text = parseInt(text);
    }

    this.setState({
      [name]: text,
      error,
    });
  }

  validateForm() {
    let { phone, otp_code, error, isOtpSent } = this.state;

    if (phone === "") {
      error.phone = "Phone number is required";
    }

    if (isOtpSent && otp_code === "") {
      error.otp_code = "OTP Code is required";
    }

    this.setState({
      error,
    });
  }

  onSubmit = async (e) => {
    e.preventDefault();
    await this.validateForm();

    let { phone, error, selected_country } = this.state;

    const formatted_phone = this.formattedPhone(
      selected_country.value + "" + phone
    );

    if (Object.keys(error).length === 0) {
      this.setState({ isSubmitting: true });

      const options = {
        method: "POST",
        url: `${ENDPOINT}/otp/send`,
        data: {
          phone: formatted_phone,
        },
      };

      axios(options)
        .then((data) => {
          this.setState({
            isSubmitting: false,
            isOtpSent: true,
          });
        })
        .catch((error) => {
          toastMessage("error", error);

          this.setState({
            isSubmitting: false,
            isOtpSent: false,
          });
        });
    }
  };

  reSendOTP(phone) {
    const options = {
      method: "POST",
      url: ENDPOINT + "/otp/send",
      data: {
        phone,
      },
    };

    axios(options)
      .then((res) => {
        this.setState({
          isSubmitting: false,
        });

        toastMessage("success", "OTP code sent successfully to " + phone);
      })
      .catch((error) => {
        this.setState({
          isSubmitting: false,
        });

        toastMessage("error", error);
      });
  }

  formattedPhone(phone) {
    let formatted = phone;

    formatted = phone.replace("+", "");

    return formatted;
  }

  onVerify = async () => {
    await this.validateForm();
    const { error, phone, selected_country, otp_code } = this.state;

    if (Object.keys(error).length === 0) {
      this.setState({
        isSubmitting: true,
      });

      const formatted_phone = this.formattedPhone(
        selected_country.value + "" + parseInt(phone)
      );

      const options = {
        method: "POST",
        url: `${ENDPOINT}/otp/verify`,
        data: {
          phone: formatted_phone,
          otp_code,
        },
      };

      axios(options)
        .then((data) => {
          this.onAuth();
        })
        .catch((error) => {
          this.setState({
            isSubmitting: false,
          });

          toastMessage("error", error);
        });
    }
  };

  onAuth = async () => {
    await this.validateForm();
    const { phone, selected_country } = this.state;

    const formatted_phone = this.formattedPhone(
      selected_country.value + "" + parseInt(phone)
    );

    this.setState({
      isSubmitting: true,
    });

    const options = {
      method: "POST",
      url: `${ENDPOINT}/user/phone-auth`,
      data: {
        phone: formatted_phone,
        isPhoneVerified: true,
      },
    };
    axios(options)
      .then((data) => {
        this.onSuccess(data.data);

        this.setState({
          isSubmitting: false,
          otp_code: "",
          phone: "",
        });
      })
      .catch((error) => {
        this.setState({
          isSubmitting: false,
        });

        toastMessage("Something went wrong please try again");
      });
  };

  onSuccess = async (data) => {
    try {
      await setStorage({
        ...data,
      });

      console.log(data);

      if (Object.keys(data?.organization || {}).length !== 0) {
        let org_obj = {
          label: data.organization.name,
          value: data.organization._id,
        };

        await this.props.dispatch(onFilter({ organization: org_obj }));

        window.location.href = "/dashboard/home";

        return;
      }

      if (data.account_type === "super_admin") {
        return (window.location.href = "/dashboard/home");
      }

      toastMessage(
        "error",
        "Your account does not allowed to access zawadi dashboard"
      );
    } catch (error) {
      toastMessage("error", "Something went wrong " + error);
    }
  };

  render() {
    return (
      <div className="login-container">
        <div className="container">
          <div
            className="row align-items-center justify-content-center gap-5"
            style={{ height: "70vh" }}
          >
            <center className="form-logo-header">
              <img src={logo} />
            </center>

            <div className="col-12 col-md-5">
              <div className="form-container card form-card">
                <div className="card-body">
                  <h3 className="md-2 mb-3" style={{ fontSize: 15 }}>
                    <b>Welcome to Zawadi</b>
                  </h3>
                  <form>
                    <Select
                      options={countries}
                      value={this.state.selected_country}
                      placeholder="Phone number"
                      onChange={(e) => this.onChangeText("selected_country", e)}
                      error={this.state.error.selected_country}
                      className="form-control-lg"
                    />
                    <Input
                      placeholder="Phone number"
                      value={this.state.phone}
                      onChange={(e) => this.onChangeText("phone", e)}
                      error={this.state.error.phone}
                      className="form-control-lg"
                    />
                    {this.state.isOtpSent ? (
                      <>
                        <Input
                          placeholder="OTP Code"
                          value={this.state.otp_code}
                          onChange={(e) => this.onChangeText("otp_code", e)}
                          error={this.state.error.otp_code}
                          className="form-control-lg"
                        />
                        <Button
                          text="Verify"
                          className="btn-lg btn-primary w-100"
                          isSubmitting={this.state.isSubmitting}
                          onPress={this.onVerify.bind(this)}
                        />
                      </>
                    ) : (
                      <Button
                        text="Login"
                        className="btn-lg btn-primary w-100"
                        isSubmitting={this.state.isSubmitting}
                        onPress={this.onSubmit.bind(this)}
                      />
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { filters } = state.Filters;

  return { filters };
};

export default connect(mapStateToProps)(Login);
