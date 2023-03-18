import React from "react";
import "./styles.css";

const CardCount = (props) => {
  return (
    <div className="card card-count">
      <div className="card-body">
        <h1>{props.title}</h1>
        <p className="total">{props.total}</p>
      </div>
    </div>
  );
};

export default CardCount;
