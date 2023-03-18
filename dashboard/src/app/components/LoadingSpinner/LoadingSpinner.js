import React from "react";
import { Spinner } from "react-bootstrap";
import "./style.css";

const LoadingSpinner = (props) => {
  return (
    <div
      className={`spin-container ${props.className}`}
      style={props.width ? { width: props.width } : { width: "100%" }}
    >
      <Spinner variant="success" aria-hidden="true" animation="border" />
    </div>
  );
};

export default LoadingSpinner;
