import React from "react";
import "./styles.css";

class Input extends React.Component {
  state = {
    showPassword: false,
  };

  onShowPassword() {
    this.setState({
      showPassword: !this.state.showPassword,
    });
  }
  render() {
    const props = this.props;
    return (
      <div className="form-group">
        {props.label && (
          <label>
            {props.label}{" "}
            {props.required && <span className="required">*</span>}
          </label>
        )}
        <div className="input-container">
          <input
            className={`form-control ${
              ((props.error && !props.error.type) ||
                (props.error && props.error.type === "weak")) &&
              "form-control-error"
            } ${props.className}`}
            value={props.value}
            onChange={props.onChange}
            placeholder={props.placeholder}
            type={
              props.type === "password"
                ? this.state.showPassword
                  ? "text"
                  : "password"
                : props.type
            }
            disabled={props.disabled}
            autocomplete={props.autocomplete}
          />
          <div className="right-container">
            {props.type === "password" && (
              <div
                className="icon-input-container"
                onClick={this.onShowPassword.bind(this)}
              >
                <i
                  className={`bx bx-${
                    this.state.showPassword ? "show" : "hide"
                  }`}
                ></i>
              </div>
            )}
          </div>
        </div>
        {props.error && props.error.type ? (
          <span
            className={
              props.error.type === "strong"
                ? "text-primary"
                : props.error.type === "medium"
                ? "text-warning"
                : "text-danger"
            }
          >
            {props.error.message}
          </span>
        ) : (
          <span className="text-danger">{props.error}</span>
        )}
        {/* {props.password_checker && props.password_checker.type && (
          <span
            className={
              props.password_checker.type === "strong"
                ? "text-primary"
                : props.password_checker.type === "medium"
                ? "text-warning"
                : "text-danger"
            }
          >
            {props.password_checker.message}
          </span>
        )} */}
      </div>
    );
  }
}

export default Input;
