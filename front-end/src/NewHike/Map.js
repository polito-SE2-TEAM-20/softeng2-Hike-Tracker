import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react';
import { MapContainer, Polyline, TileLayer, useMap } from 'react-leaflet'
import './map.css';

const Inner = ({positionsState}) => {
    const map = useMap();

    useEffect(() => {
        if (!positionsState?.length) { return; }

        map.flyTo(positionsState[0])

    }, [positionsState]);
    
    return null;
}


const Map = props => {
    
    return(
        <MapContainer
                    className='map'
                     center={props.positionsState.length ? props.positionsState[0] : [45.4408474, 12.3155151]}

                    zoom={18}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

                    <Polyline
                        pathOptions={{ fillColor: 'red', color: 'blue' }}
                        positions={props.positionsState}
                    />
                    <Inner {...props}/>
                </MapContainer>
    )
    
}
export {Map}