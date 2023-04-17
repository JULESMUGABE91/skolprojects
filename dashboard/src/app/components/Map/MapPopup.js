import React from "react";
import { Popup } from "react-leaflet";
import "./styles.css";
import moment from "moment";
import { Button } from "../Button";

const MapPopup = (props) => {
  console.log(props.data?.user);
  return (
    <Popup>
      <div className="bin-popup">
        <div className="right">
          {props.data?.user && (
            <>
              <div className="item">
                <span>
                  Surveyor:{" "}
                  <b>
                    {props.data?.user?.firstname +
                      " " +
                      props?.data?.user?.lastname}
                  </b>
                </span>
              </div>
              <div className="item">
                <span>
                  Surveyor Contact: <b>{props.data.user.phone}</b>
                </span>
              </div>
            </>
          )}
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
          <div>
            <Button
              className="btn-primary"
              text="Download Report"
              isSubmitting={props.isDownloading}
              onPress={props.onDownload}
            />
          </div>
        </div>
      </div>
    </Popup>
  );
};

export default MapPopup;
