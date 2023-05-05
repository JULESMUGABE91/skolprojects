import React from "react";
import { AnswerInsight } from "../components/Chart";
import { Home } from "./common";
import { Tabs } from "../components/Tabs";
import ClosedInterview from "../components/ClosedInterview/ClosedInterview";

class AnswerScreen extends React.Component {
  renderAnalytics() {
    return <AnswerInsight />;
  }

  renderClosed() {
    return <ClosedInterview />;
  }

  render() {
    return (
      <div>
        <Tabs
          options={[
            {
              title: "Statistics",
              data: this.renderAnalytics(),
            },
            {
              title: "Closed Interviews",
              data: this.renderClosed(),
            },
          ]}
        />
      </div>
    );
  }
}

export default AnswerScreen;
