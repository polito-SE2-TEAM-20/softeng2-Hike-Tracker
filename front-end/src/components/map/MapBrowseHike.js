import { useState } from 'react';
import 'leaflet/dist/leaflet.css'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl } from 'react-leaflet'
import L from 'leaflet';
import HikePopup from '../hike-popup/HikePopup';
import sampledata from '../../extra/sample-data/sample-data.json'
import { Paper } from '@mui/material'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


export const LocationMarker = () => {
  const [position, setPosition] = useState(null)
  const map = useMapEvents({
    click() {
      map.locate()
    },
    locationfound(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}

export const MapBrowseHike = (props) => {
  return (
    <div style={{ marginTop:"0px" }}>
        <MapContainer center={[43.046182, 12.407823]} zoom={7}
          scrollWheelZoom={false} zoomControl={false}
          style={{ width: "auto", minHeight: "100vh", height: "100%" }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
          />
          <ZoomControl position='bottomright' />
          {
            sampledata.map((elem) => {
              if (elem.address.country === "Italy")
                return (
                  <Marker
                    key={elem.id}
                    position={[elem.gps.latitude, elem.gps.longitude]}>
                    <Popup position={[elem.gps.latitude, elem.gps.longitude]}>
                      <HikePopup elem={elem} />
                    </Popup>
                  </Marker>
                )
            })
          }
        </MapContainer>
    </div>
  );
}
