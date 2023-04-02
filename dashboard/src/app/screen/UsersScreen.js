import React from "react";
import { Home } from "./common";
import { Users } from "../components/Users";
import { Tabs } from "../components/Tabs";
import AdminEmail from "../components/Users/AdminEmail";

class UsersScreen extends React.Component {
  renderUsers = () => {
    return <Users />;
  };
  renderAdminEmail = () => {
    return <AdminEmail />;
  };
  render() {
    return (
      <div>
        <Home organization />
        <div>
          <Tabs
            options={[
              {
                title: "Users",
                data: this.renderUsers(),
              },
              {
                title: "Report Account",
                data: this.renderAdminEmail(),
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default UsersScreen;
