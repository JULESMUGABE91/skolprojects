import React from "react";
import { Button } from "../Button";

const DeviceInfo = (props) => {
  return (
    <div className="card">
      <div className="card-body table-responsive">
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Device ID</th>
              <th>Serial Number</th>
              <th>IMEI</th>
              <th>Status</th>
              <th>Available</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{props.device_id}</td>
              <td>{props.serial_number}</td>
              <td>{props.imei}</td>
              <td>{props.status}</td>
              <td>{props.available + ""}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card-footer d-flex align-content-center justify-content-end gap-3">
        <Button
          text="Close"
          className="btn-default btn-lg border"
          onPress={props.handleCloseModal}
        />
      </div>
    </div>
  );
};

export default DeviceInfo;
