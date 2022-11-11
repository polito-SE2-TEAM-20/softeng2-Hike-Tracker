import { useState } from 'react';
import 'leaflet/dist/leaflet.css'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl } from 'react-leaflet'
import L from 'leaflet';
import sampledata from '../../sample-data/sample-data.json'

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

export const Map = () => {
  return (
    <MapContainer center={[45.07417348802877, 7.620956240528321]} zoom={13} 
    scrollWheelZoom={false} zoomControl={false} 
    style={{ width: "100vw", height: "100vh" }}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <ZoomControl position='bottomright' />

      {
        sampledata.map((elem) => {
          if(elem.address.country === "Italy")
          return (
            <Marker
              key={elem.id}
              position={[elem.gps.latitude, elem.gps.longitude]}>
            </Marker>
          )
        })
      }
    </MapContainer>
  );
}
