import { useState } from 'react';
import 'leaflet/dist/leaflet.css'
import 'leaflet-draw/dist/leaflet.draw.css'

import { MapContainer, TileLayer, FeatureGroup, Marker, Popup, useMapEvents, ZoomControl, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet';
import HikePopup from '../hike-popup/HikePopup';
import { EditControl } from 'react-leaflet-draw'

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
    // const [clickedCenter, setClickedCenter] = useState([41.9078596,-72.0528959])
    const [clickedCenter, setClickedCenter] = useState([45.07412045176881, 7.621063528883495])
    const [selected, setSelected] = useState(-1)
    const [flyIndex, setFlyIndex] = useState(-1)

    const OnClickSelectHike = (index) => {
        setSelected(index)
        setFlyIndex(index)
    }

    const FlyToSelected = (props) => {
        const map = useMap()
        if (props.index === -1)
            return;
        map.flyTo(props.dataset.filter(x => x.id === props.index)[0].positions[0], 14)
    }

    const _circleCreated = (e) => {
        props.setRadiusFilter([[e.layer.toGeoJSON().geometry.coordinates[1], e.layer.toGeoJSON().geometry.coordinates[0]], e.layer.getRadius() / 1000.0])
        console.log([[e.layer.toGeoJSON().geometry.coordinates[1], e.layer.toGeoJSON().geometry.coordinates[0]], e.layer.getRadius() / 1000.0])
    }

    const _circleEdited = (e) => {
        console.log(e)
    }

    const _circleDeleted = (e) => {
        console.log(e)
    }

    return (
        <div>
            <MapContainer center={clickedCenter} zoom={9}
                scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: true }} zoomControl={false}
                style={{ width: "auto", minHeight: "85vh", height: "85%" }}>
                <FeatureGroup>
                    <EditControl position="bottomright" draw={{
                        rectangle: false,
                        circle: true,
                        circlemarker: false,
                        marker: false,
                        polygon: false,
                        polyline: false
                    }} onCreated={e => _circleCreated(e)} onEdited={e => _circleEdited(e)} onDeleted={e => _circleDeleted(e)} />
                </FeatureGroup>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                />
                <FlyToSelected {...props} index={flyIndex} />
                <ZoomControl position='bottomright' />
                {
                    props.dataset.filter(x => x.gpxFile !== undefined || x.gpxFile !== "" || x.positions === null || x.positions === undefined || x.positions.length === 0).map((hike) => {
                        if (!hike?.positions?.[0]) {return null;}
                        if (selected === hike?.id) {
                            return (
                                <>
                                    <Marker
                                        key={hike.id}
                                        position={[hike?.positions[0][0], hike?.positions[0][1]]}>
                                        <Popup position={[hike?.positions[0][0], hike?.positions[0][1]]}>
                                            <HikePopup hike={hike} />
                                        </Popup>
                                    </Marker>
                                    <Polyline
                                        pathOptions={{ fillColor: 'red', color: 'blue' }}
                                        positions={hike?.positions}
                                    />
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <Marker
                                        key={hike?.id}
                                        position={[hike?.positions[0][0], hike?.positions[0][1]]}>
                                        <Popup position={[hike?.positions[0][0], hike?.positions[0][1]]}>
                                            <HikePopup hike={hike} OnClickSelectHike={OnClickSelectHike} />
                                        </Popup>
                                    </Marker>
                                </>
                            );
                        }
                    })
                }

            </MapContainer>
        </div>
    );
}
