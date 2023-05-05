import React from "react";
import { AnswerInsight } from "../components/Chart";
import { Home } from "./common";

class AnswerScreen extends React.Component {
  render() {
    return (
      <div>
        <div style={{ marginBottom: 15 }}>
          <Home organization survey question user date isCountCard />
        </div>
        <AnswerInsight />
      </div>
    );
  }
}

export default AnswerScreen;
