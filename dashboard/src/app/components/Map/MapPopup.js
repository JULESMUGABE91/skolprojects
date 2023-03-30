import React from "react";
import { Popup } from "react-leaflet";
import "./styles.css";
import moment from "moment";
import { Link } from "react-router-dom";

const MapPopup = (props) => {
  console.log(props);
  return (
    <Popup>
      <div className="bin-popup">
        <div className="right">
          <div className="item">
            <span>
              Surveyor:{" "}
              <b>
                {props.data.user.firstname + " " + props.data.user.lastname}
              </b>
            </span>
          </div>
          <div className="item">
            <span>
              Surveyor Contact: <b>{props.data.user.phone}</b>
            </span>
          </div>
          <div className="item">
            <span>
              Location:{" "}
              <b>{props?.data?.start_location?.address || "Unknown"}</b>
            </span>
          </div>
          {/* <div className="item">
            <span>
              End Location:{" "}
              <b>{props.data?.end_location?.address || "Unknown"}</b>
            </span>
          </div> */}

          <div className="item">
            <span>
              Status: <b>{props.data.status || "Completed"}</b>
            </span>
          </div>
          <div className="item">
            <span>
              Submitted:
              <b>{moment(props.data.createdAt).format("lll")}</b>
            </span>
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default MapPopup;
