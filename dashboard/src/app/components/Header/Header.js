import React from "react";
import "./styles.css";
import { Button } from "../Button";
import { WasteType, Organization, WasteLevel, DateRange } from ".";
import UserAccounts from "./UserAccounts";
import Survey from "./Survey";
import Question from "./Question";

const Header = (props) => {
  const { filters } = props;
  if (!filters) {
    return <></>;
  }

  return (
    <div className="main-filters d-grid  d-md-flex align-items-center">
      <div className={`row main-filters`}>
        {filters.map((item, i) => {
          return (
            <div
              key={i}
              className={`${item.isDropdown && "dropdown"}  col-auto`}
            >
              <Button
                className={`btn-default bordered btn-sm ${
                  item.isDropdown && " dropdown-toggle dropdown-toggle-split"
                }`}
                text={item.name}
                selected={
                  item.selected ? item.selected : item.isDropdown ? ["All"] : ""
                }
                autoCloseType={item.autoCloseType}
                id={item.clickBehaviorId}
                withOpacity
              />
              {item.isDropdown && item.name === "organization" && (
                <ul
                  className="dropdown-menu col-xs-12"
                  aria-labelledby="dropdownMenuClickableInside"
                >
                  <Organization />
                </ul>
              )}
              {item.isDropdown && item.name === "survey" && (
                <ul
                  className="dropdown-menu col-xs-12"
                  aria-labelledby="dropdownMenuClickableInside"
                >
                  <Survey />
                </ul>
              )}
              {item.isDropdown && item.name === "user_account" && (
                <ul
                  className="dropdown-menu col-xs-12"
                  aria-labelledby="dropdownMenuClickableInside"
                >
                  <UserAccounts />
                </ul>
              )}
              {item.isDropdown && item.name === "question" && (
                <ul
                  className="dropdown-menu col-xs-12"
                  aria-labelledby="dropdownMenuClickableInside"
                >
                  <Question />
                </ul>
              )}
              {item.isDropdown && item.name === "date" && (
                <ul
                  className="dropdown-menu col-xs-12"
                  aria-labelledby="dropdownMenuClickableInside"
                >
                  <DateRange />
                </ul>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Header;
