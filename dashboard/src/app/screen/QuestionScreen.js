import React from "react";
import { QuestionForm } from "../components/Question";
import { Home } from "./common";

class QuestionScreen extends React.Component {
  render() {
    return (
      <div>
        <Home organization survey />
        <QuestionForm />
      </div>
    );
  }
}

export default QuestionScreen;
