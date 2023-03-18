import React from "react";
import { Respondents } from "../components/Respondent";
import { Home } from "./common";

class RespondentScreen extends React.Component {
  render() {
    return (
      <div>
        <Home organization survey question />
        <Respondents />
      </div>
    );
  }
}

export default RespondentScreen;
