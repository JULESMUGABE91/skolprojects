import React from "react";
import { Home } from "./common";
import { Users } from "../components/Users";

class UsersScreen extends React.Component {
  render() {
    return (
      <div>
        <Home organization />
        <div>
          <Users />
        </div>
      </div>
    );
  }
}

export default UsersScreen;
