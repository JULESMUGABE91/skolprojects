import React from "react";
import "./styles.css";

const Checkbox = (props) => {
  return (
    <label className="checkbox-container" onClick={props.handleCheck}>
      <div className={`icon-container ${props.checked && "checked"}`}>
        {props.checked && <i className="bx bx-check" />}
      </div>
      <span title={props.name}>{props.name}</span>
    </label>
  );
};

export default Checkbox;
