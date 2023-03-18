import React from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "react-leaflet-markercluster/dist/styles.min.css";
import "./styles.css";
import MapDataLoader from "./MapLoader";
import BinMarker from "./BinMarker";
import MarkerClusterGroup from "react-leaflet-markercluster";
import L from "leaflet";
import levelPerPercentage from "../../utils/levelPerPercentage";

const Map = (props) => {
  const createClusterCustomIcon = function (cluster, bins) {
    let levels = [];

    for (let i = 0; i < bins.length; i++) {
      levels.push(bins[i].level_percentage);
    }

    const max = Math.max(...levels);
    const { color } = levelPerPercentage(max);

    return L.divIcon({
      html: `<div class='marker-cluster-child' style='background-color:${color}'><span>${cluster.getChildCount()}</span></div>`,
      className: "marker-cluster-custom",
      iconSize: L.point(40, 40, true),
    });
  };

  let group_bins_by_address = {};

  for (let i = 0; i < props.data.length; i++) {
    const address = props.data[i].address && props.data[i].address.sector;

    if (!group_bins_by_address[address]) {
      group_bins_by_address[address] = [];
    }

    group_bins_by_address[address].push(props.data[i]);
  }

  const addresses = Object.keys(group_bins_by_address);

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
          addresses.map((addr, a) => {
            return (
              <MarkerClusterGroup
                key={a}
                spiderfyDistanceMultiplier={1}
                showCoverageOnHover={false}
                maxClusterRadius={35}
                iconCreateFunction={(e) =>
                  createClusterCustomIcon(e, group_bins_by_address[addr])
                }
              >
                {group_bins_by_address[addr].map((marker, m) => {
                  return <BinMarker marker={marker} key={m} />;
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
