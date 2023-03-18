import React from "react";
import { Link } from "react-router-dom";
import { Input } from "../Input";
import { LoadingSpinner } from "../LoadingSpinner";
import "./styles.css";

const DropdownContent = (props) => {
  return (
    <div className="search-dropdown">
      <div>
        {props.isSearchable && (
          <div className="search-drop-input">
            <Input
              placeholder="Search..."
              value={props.search_text}
              onChange={props.onChangeSearch}
            />
            <div className="clear-drop-search">
              <Link to="#" onClick={props.onReset}>
                <span>
                  <b>Reset filters</b>
                </span>
              </Link>
            </div>
          </div>
        )}

        <div className="content">
          {props.isLoading ? (
            <LoadingSpinner />
          ) : props.isList ? (
            <ul>
              {props.options &&
                props.options.map((item, i) => {
                  let default_key = props.default_key
                    ? props.default_key
                    : "value";

                  const active = props.isMulti
                    ? props.selected_item &&
                      props.selected_item.includes(item[default_key]) &&
                      "active"
                    : props.selected_item &&
                      props.selected_item[default_key] === item[default_key] &&
                      "active";

                  return (
                    <li
                      className={`search-item ${active}`}
                      key={i}
                      onClick={() => props.onSelectDropdownItem(item)}
                    >
                      <div className={`custom-checkbox ${active}`}>
                        {active === "active" && <i className="bx bx-check" />}
                      </div>
                      <span>{item.label}</span>
                      {/* <i className="bx bx-chevron-right" /> */}
                    </li>
                  );
                })}
            </ul>
          ) : (
            <div>{props.children}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DropdownContent;
