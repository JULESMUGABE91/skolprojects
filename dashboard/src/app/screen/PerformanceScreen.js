import React from "react";
import { Home } from "./common";
import { Surveyor } from "../components/Performance";
import { Tabs } from "../components/Tabs";

class PerformanceScreen extends React.Component {
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
                title: "Surveyors",
                data: this.renderUsers(),
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default PerformanceScreen;
