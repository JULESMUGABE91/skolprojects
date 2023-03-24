import React from "react";
import "./styles.css";

const renderSelectedText = (items) => {
  let title = "";

  if (Array.isArray(items)) {
    let c = items.length;

    title = `${items[0]} ${
      c === 2
        ? ", " + items[1]
        : c > 2
        ? ", " + items[1] + " (+" + (c - 2) + ")"
        : ""
    }`;
  } else {
    title = items;
  }

  return title && title.trim() !== "undefined" ? title : "";
};

const Button = (props) => {
  return (
    <button
      onClick={!props.isSubmitting ? props.onPress : null}
      className={`btn ${props.className} ${
        props.isSubmitting && "btn-disabled"
      }`}
      id={props.id ? props.id : "dropdownMenuButton1"}
      data-bs-toggle="dropdown"
      // aria-expanded="false"
      // data-bs-auto-close={props.autoCloseType}
    >
      {props.isSubmitting ? (
        <i className="bx bx-loader bx-spin"></i>
      ) : (
        <>
          {props.icon && <i className={`bx ${props.icon}`}></i>}
          <span style={props.withOpacity && { opacity: 0.7 }}>
            {props.text}
          </span>
        </>
      )}
      {props.selected && (
        <>
          <span className="selected_item">
            {renderSelectedText(props.selected) !== ""
              ? ": " + renderSelectedText(props.selected)
              : ""}
          </span>
        </>
      )}
    </button>
  );
};

export default Button;
