import React from "react";
import "./styles.css";

const Textarea = (props) => {
  return (
    <div className="form-group">
      {props.label && (
        <label>
          {props.label} {props.required && <span className="required">*</span>}
        </label>
      )}
      <textarea
        className={`form-control form-control-lg ${
          props.error && "form-control-error"
        }`}
        value={props.value}
        onChange={props.onChange}
        placeholder={props.placeholder}
        type={props.type}
      ></textarea>
      {props.error && <span className="text-danger">{props.error}</span>}
    </div>
  );
};

export default Textarea;
