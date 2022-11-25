import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react';
import '../NewHike/map.css';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet';

import HikePopup from '../components/hike-popup/HikePopup';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const Inner = ({latitude, longitude}) => {
    const map = useMap();

    var popup = L.popup();





useEffect(() => {
    if (!latitude && !longitude) { return; }

    map.flyTo([latitude, longitude])

}, [latitude, longitude] );

}






const MapHut = props => {

    let position = [props.latitude, props.longitude];

    return(
        <MapContainer
                    className='map'
                    center={[props.latitude, props.longitude].length ? [props.latitude, props.longitude].length/2 : [45.4408474, 12.3155151]}
                    zoom={13}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Inner {...props}/>
                    
                </MapContainer>
    )
    
}
export {MapHut}