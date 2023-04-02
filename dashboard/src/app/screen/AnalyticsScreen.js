import moment from "moment";
import React from "react";
import { PerGender, PerRegion, PerAgeGroup } from "../components/Chart";
import { Home } from "./common";

class AnalyticScreen extends React.Component {
  render() {
    return (
      <div>
        <Home isCountCard organization survey date user />
        <div style={{ position: "relative", marginTop: "1rem" }}>
          <div className="row">
            <div className="col-md-6">
              <PerGender />
            </div>
            <div className="col-md-6">
              <PerRegion />
            </div>
          </div>
          <div className="row" style={{ marginTop: 15 }}>
            <div className="col-md-12">
              <PerAgeGroup />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default AnalyticScreen;
