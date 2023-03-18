import React from "react";
import { Answers } from "../components/Answer";
import { Home } from "./common";

class AnswerScreen extends React.Component {
  render() {
    return (
      <div>
        <Home organization survey question />
        <Answers />
      </div>
    );
  }
}

export default AnswerScreen;
