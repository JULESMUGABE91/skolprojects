import React from "react";
import { ResetPassword } from "../components/ResetPassword";

class ResetPasswordScreen extends React.Component {
  state = {
    username: "",
  };

  componentDidMount() {
    const { match } = this.props;

    if (match && match.params && match.params.username) {
      this.setState({
        username: match.params.username,
      });
    }
  }

  render() {
    return (
      <div>
        <ResetPassword username={this.state.username} />
      </div>
    );
  }
}

export default ResetPasswordScreen;
