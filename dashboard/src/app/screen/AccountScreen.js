import React from "react";
import { Accounts } from "../components/Accounts";
import AccessRole from "../components/Accounts/AccessRole";
import { General } from "../components/Profile";
import { Tabs } from "../components/Tabs";
import { getStorage } from "../utils/storage";

class AccountScreen extends React.Component {
  state = {
    user: {},
  };

  componentDidMount = async () => {
    await this.getUserLoggedInInfo();
  };

  getUserLoggedInInfo = async () => {
    const user = await getStorage();
    this.setState({
      user,
    });
  };

  renderGeneral() {
    return (
      <div className="card-body">
        <General />
      </div>
    );
  }

  renderPermission() {
    return (
      <div className="card-body">
        <AccessRole {...this.state.user} />
      </div>
    );
  }

  renderAccount() {
    return (
      <div className="card-body">
        <Accounts />
      </div>
    );
  }
  render() {
    return (
      <div className="card">
        <div className="card-body">
          <General />
        </div>
      </div>
    );
  }
}

export default AccountScreen;
