import React from "react";
import { AnswerInsight } from "../components/Chart";
import { Home } from "./common";

class AnswerScreen extends React.Component {
  render() {
    return (
      <div>
        <Home organization survey question user date isCountCard />
        <AnswerInsight />
      </div>
    );
  }
}

export default AnswerScreen;
