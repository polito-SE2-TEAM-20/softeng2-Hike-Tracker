import { useState } from 'react';
import 'leaflet/dist/leaflet.css'

import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl, Polyline } from 'react-leaflet'
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
    const [clickedCenter, setClickedCenter] = useState([45.07412045176881, 7.621063528883495])
    return (
        <div style={{ marginTop: "0px" }}>
            <MapContainer center={clickedCenter} zoom={9}
                scrollWheelZoom={{xs:false, sm:false, md: false, lg: true, xl: true}} zoomControl={false}
                style={{ width: "auto", minHeight: "100vh", height: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                />
                <ZoomControl position='bottomright' />
                {
                    props.dataset.map((hike) => {
                        console.log(hike)
                        return(<>
                            <Marker
                                key={Math.random()}
                                position={[hike[0][0], hike[0][1]]}>
                                <Popup position={[hike[0][0], hike[0][1]]}>
                                    <HikePopup elem={hike[0]} />
                                </Popup>
                            </Marker>
                            <Polyline
                                pathOptions={{ fillColor: 'red', color: 'blue' }}
                                positions={hike}
                            />
                        </>)
                    })
                }

            </MapContainer>
        </div>
    );
}
