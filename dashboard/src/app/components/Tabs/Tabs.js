import React, { useEffect, useState } from "react";
import { Tabs, Tab } from "react-bootstrap";
import "./style.css";

const ControlledTabs = (props) => {
  const [key, setKey] = useState(
    props.options.length > 0 ? props.options[0].title.toLowerCase() : undefined
  );

  useEffect(() => {
    if (props.activeTab) {
      setKey(props.activeTab);
    }
  });

  return (
    <>
      <Tabs
        id="controlled-tab-example"
        activeKey={key}
        onSelect={(k) => setKey(k)}
        className="tab mb-2 flex-nowrap"
        style={props.style}
      >
        {props.options.map((item, i) => {
          return (
            <Tab key={i} eventKey={item.title.toLowerCase()} title={item.title}>
              {item.data}
            </Tab>
          );
        })}
      </Tabs>
    </>
  );
};

export default ControlledTabs;
