import moment from "moment";
import React from "react";
import { Surveys } from "../components/Surveys";
import { Home } from "./common";

class SurveyScreen extends React.Component {
  render() {
    return (
      <div>
        <Home isCountCard organization />
        <div style={{ position: "relative", marginTop: "1rem" }}>
          <div className="card">
            <Surveys {...this.props.match} />
          </div>
        </div>
      </div>
    );
  }
}

export default SurveyScreen;
