import React from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import MapPopup from "./MapPopup";

export default function MapMarker(props) {
  const map = useMap();

  const status = props.marker.status;

  return (
    <div>
      <Marker
        icon={L.divIcon({
          className: "leaflet-data-marker",
          html: `<div class='map-marker ${status}'>
               <i class='bx ${
                 status === "incomplete" ? "bx bxs-user" : "bx bx-user"
               }'></i>
              </div>`,
        })}
        position={props.marker.end_location.coordinates}
        // eventHandlers={{
        //   click: (e) => {
        //     map.flyTo(e.latlng);
        //   },
        // }}
      >
        <MapPopup
          data={props.marker}
          isDownloading={props.isDownloading}
          onDownload={props.onDownload}
        />
      </Marker>
    </div>
  );
}
