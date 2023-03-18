import React from "react";
import { Questions } from "../components/Question";
import { Home } from "./common";

class QuestionScreen extends React.Component {
  render() {
    return (
      <div>
        <Home organization survey />
        <Questions />
      </div>
    );
  }
}

export default QuestionScreen;
