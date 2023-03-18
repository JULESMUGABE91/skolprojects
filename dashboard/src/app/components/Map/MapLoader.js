import React from "react";
import { Spinner } from "react-bootstrap";
import "./styles.css";

const MapDataLoader = () => {
  return (
    <div className="map-loading-data">
      <Spinner
        variant="success"
        aria-hidden="true"
        animation="border"
        // size="sm"
      />
    </div>
  );
};

export default MapDataLoader;
