import React from "react";
import { Home } from "./common";
import { Surveyor } from "../components/Performance";
import { Tabs } from "../components/Tabs";
import { Report } from "../components/Report";

class ReportScreen extends React.Component {
  renderReport = () => {
    return <Report />;
  };
  renderUsers = () => {
    return <Surveyor />;
  };
  render() {
    return (
      <div>
        <Home organization user survey date />
        <div>
          <Tabs
            options={[
              {
                title: "Respondents",
                data: this.renderReport(),
              },
              {
                title: "Performance",
                data: this.renderUsers(),
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default ReportScreen;
