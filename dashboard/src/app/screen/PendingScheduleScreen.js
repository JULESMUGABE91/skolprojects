import React from "react";
import { Home } from "./common";
import { Tabs } from "../components/Tabs";
import { Schedules } from "../components/Schedules";

class PendingScheduleScreen extends React.Component {
  renderAll() {
    return <Schedules status="pending" />;
  }

  renderOnTime() {
    return <Schedules status="pending" schedule_status="ontime" />;
  }

  renderOverDue() {
    return <Schedules status="pending" schedule_status="late" />;
  }
  render() {
    return (
      <div>
        <Home date location type level />
        <div>
          <Tabs
            options={[
              {
                title: "All",
                data: this.renderAll(),
              },
              {
                title: "On Time",
                data: this.renderOnTime(),
              },
              {
                title: "Over Due",
                data: this.renderOverDue(),
              },
            ]}
          />
        </div>
      </div>
    );
  }
}

export default PendingScheduleScreen;
