import React, { useContext, useEffect, useState } from 'react';
import GoogleMapReact from 'google-map-react';
import supercluster from 'points-cluster';

import './GoogleMap.css';
import UserPin from './mapobject/UserPin';
import Cluster from './mapobject/Cluster';
import { StateContext } from '../App';

function createMapOptions(maps) {
  return {
    zoomControlOptions: {
      position: maps.ControlPosition.LEFT_CENTER,
      style: maps.ZoomControlStyle.SMALL,
    },
  };
}

function GoogleMap({ users }) {
  const { mapOptions, setMapOptions } = useContext(StateContext);
  const [clusters, setClusters] = useState([]);
  const [getCluster, setClusterFn] = useState(() => mapOptions => []);

  // precalculate clusters if markers data has changed
  useEffect(() => {
    const newClusterFn = supercluster(users, {
      minZoom: 0,
      maxZoom: 16,
      radius: 60,
    });
    setClusterFn(() => newClusterFn);
  }, [users]);

  // Update clusters
  useEffect(() => {
    if (mapOptions && mapOptions.bounds) {
      const newClusters = getCluster(mapOptions).map(({ wx, wy, numPoints, points }) => ({
        lat: wy,
        lng: wx,
        numPoints: numPoints,
        id: `${numPoints}_${points[0]._id}`,
        points: points,
      }));
      setClusters(newClusters);
    }
  }, [mapOptions, getCluster]);

  return (
    <div className={'google-map'}>
      {mapOptions && (
        <GoogleMapReact
          bootstrapURLKeys={{ key: process.env.REACT_APP_GMAPS_API }}
          center={mapOptions.center}
          zoom={mapOptions.zoom}
          onChange={({ center, zoom, bounds }) => setMapOptions({ center, zoom, bounds })}
          yesIWantToUseGoogleMapApiInternals={true}
          options={createMapOptions}
        >
          {clusters.map((groups) => {
            if (groups.numPoints === 1) {
              return (
                <UserPin
                  lat={groups.points[0].lat}
                  lng={groups.points[0].lng}
                  username={groups.points[0].username}
                  avatar={groups.points[0].avatar}
                  key={groups.points[0]._id}
                  message={groups.points[0].latestMessage || null}
                />
              );
            } else {
              return (
                <Cluster
                  lat={groups.lat}
                  lng={groups.lng}
                  key={groups.id}
                  numPoints={groups.numPoints}
                />
              );
            }
          })}
        </GoogleMapReact>
      )}
    </div>
  );
}

export default GoogleMap;
