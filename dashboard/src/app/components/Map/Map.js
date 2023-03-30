import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import "./styles.css";
import MapDataLoader from "./MapLoader";
import MapMarker from "./MapMarker";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";

const Map = (props) => {
  const createClusterCustomIcon = function (cluster, answer) {
    return L.divIcon({
      html: `<div class='marker-cluster-child' style='background-color:${
        answer.status === "incomplete" ? "#FD0C0C" : "#000000"
      } '><span>${cluster.getChildCount()}</span></div>`,
      className: "marker-cluster-custom",
      iconSize: L.point(40, 40, true),
    });
  };

  let group_answer_by_surveyor = {};

  for (let i = 0; i < props.data.length; i++) {
    const user = props.data[i].user._id;

    if (!group_answer_by_surveyor[user]) {
      group_answer_by_surveyor[user] = [];
    }

    group_answer_by_surveyor[user].push(props.data[i]);
  }

  const users = Object.keys(group_answer_by_surveyor);

  return (
    <div className="open-street-map-container">
      <MapContainer
        scrollWheelZoom={true}
        zoomControl={true}
        center={[-1.960539, 30.125772]}
        zoom={13}
        keyboard={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {props.data &&
          props.data.length > 0 &&
          users.map((user, a) => {
            return (
              <MarkerClusterGroup
                key={a}
                spiderfyDistanceMultiplier={1}
                showCoverageOnHover={false}
                zoomToBoundsOnClick
                maxClusterRadius={17}
                iconCreateFunction={(e) =>
                  createClusterCustomIcon(e, group_answer_by_surveyor[user])
                }
              >
                {group_answer_by_surveyor[user].map((marker, m) => {
                  return <MapMarker marker={marker} key={m} />;
                })}
              </MarkerClusterGroup>
            );
          })}
      </MapContainer>
      {props.isLoading && <MapDataLoader />}
      <div className="legend-mobile-btn">
        <div>
          <i className="bx bx-chevron-up"></i>
        </div>
      </div>
      {props.legend && (
        <div className={`legend `} style={{ ...props.legend.styles }}>
          {props.legend.items &&
            props.legend.items.map((item, i) => {
              return (
                <div className={`legend-item `} key={i}>
                  {item.color && (
                    <div
                      className={`icon-container ${item.className}`}
                      style={{ backgroundColor: item.color }}
                    >
                      <i className={`bx ${item.icon}`} />
                    </div>
                  )}
                  <span>{item.name}</span>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Map;
