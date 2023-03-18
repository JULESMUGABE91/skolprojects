import React from "react";

const Switch = (props) => {
  return (
    <label className="switch">
      <input
        type="checkbox"
        checked={props?.checked}
        onChange={props?.onChange}
      />
      <span class="slider"></span>
    </label>
  );
};

export default Switch;
