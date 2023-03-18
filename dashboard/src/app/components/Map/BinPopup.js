import React from "react";
import { Popup } from "react-leaflet";
import "./styles.css";
import { Circular } from "../Progress";
import moment from "moment";
import { Link } from "react-router-dom";

const BinPopup = (props) => {
  return (
    <Popup>
      <div className="bin-popup">
        <div className="left">
          <Circular
            percentage={
              props.data.level_percentage ? props.data.level_percentage : 0
            }
            strokeWidth={10}
            showPercentageText
          />
        </div>
        <div className="right">
          <div className="item">
            <span>
              Bin ID: <b>{props.data.bin.bin_id}</b>
            </span>
          </div>
          <div className="item">
            <span>
              IMEI: <b>{props.data.imei}</b>
            </span>
          </div>
          <div className="item">
            <span>
              Serial number: <b>{props.data.serial_number}</b>
            </span>
          </div>
          <div className="item">
            <span>
              Location:{" "}
              <b>
                {props.data.bin &&
                  props.data.bin.address &&
                  props.data.bin.address.geolocation}
              </b>
            </span>
          </div>
          <div className="item">
            <span>
              Type: <b>{props.data.type}</b>
            </span>
          </div>
          {/* <div className="item">
            <span>
              Sensor: <b className="text-primary">connected</b>
            </span>
          </div> */}
          <div className="item">
            <span>
              Last updated on:
              <b>{moment(props.data.updatedAt).format("lll")}</b>
            </span>
          </div>
          <hr />
          <Link
            to={`/dashboard/alerts/waste_bin levels/${props.data._id}`}
            className="btn btn-bordered radius20 text-primary"
          >
            View Alerts
          </Link>
        </div>
      </div>
    </Popup>
  );
};

export default BinPopup;
