import React from "react";
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
        <div>
          <Tabs
            options={[
              {
                title: "Report Data",
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
