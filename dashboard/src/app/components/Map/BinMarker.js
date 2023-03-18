

import React from "react";
import { Marker, useMap } from "react-leaflet";
import L from "leaflet";
import BinPopup from "./BinPopup";

export default function BinMarker(props) {
  const map = useMap();

  const level =
    !props.marker.just_collected &&
    props.marker.level_percentage >= 0 &&
    props.marker.level_percentage < 40
      ? "low_level"
      : !props.marker.just_collected &&
        props.marker.level_percentage >= 40 &&
        props.marker.level_percentage < 60
      ? "mid_low_level"
      : !props.marker.just_collected &&
        props.marker.level_percentage >= 60 &&
        props.marker.level_percentage < 80
      ? "mid_high_level"
      : !props.marker.just_collected && props.marker.level_percentage >= 80
      ? "full_level"
      : props.marker.just_collected
      ? "just_collected"
      : "empty_level";

  return (
    <div>
      <Marker
        icon={L.divIcon({
          className: "leaflet-data-marker",
          html: `<div class='bin-marker ${level}'>
               <i class='bx ${
                 level === "low_level"
                   ? "bx-trash-alt"
                   : level === "mid_low_level"
                   ? "bx-trash-alt"
                   : level === "mid_high_level"
                   ? "bx-trash-alt"
                   : level === "full_level"
                   ? "bxs-trash-alt"
                   : level === "just_collected" && "bxs-trash"
               }'></i>
              </div>`,
        })}
        position={[props.marker.latitude, props.marker.longitude]}
        eventHandlers={{
          click: (e) => {
            map.flyTo(e.latlng);
          },
        }}
      >
        <BinPopup data={props.marker} />
      </Marker>
    </div>
  );
}