import React from "react";
import { Surveyor } from "../components/Performance";
import { Tabs } from "../components/Tabs";
import { Report, Summary } from "../components/Report";

class ReportScreen extends React.Component {
  renderSummary = () => {
    return <Summary />;
  };
  // renderReport = () => {
  //   return <Report />;
  // };
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
                title: "Summary",
                data: this.renderSummary(),
              },
              // {
              //   title: "Respondents",
              //   data: this.renderReport(),
              // },
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
