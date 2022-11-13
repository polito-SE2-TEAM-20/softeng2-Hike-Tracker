import 'leaflet/dist/leaflet.css'
import { MapContainer, Polyline, TileLayer } from 'react-leaflet'
import './map.css';
const Map = props => {
    
    return(
        <MapContainer
                    className='map'
                    // should be changed into center={positionsState[0]}
                    // center= {props.positionsState[0]}
                     center={props.positionsState.length ? props.positionsState[0] : [40.7317535212683, -73.99685430908403]}

                    zoom={9}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polyline
                        pathOptions={{ fillColor: 'red', color: 'blue' }}

                        // should be changed into postitions={positionsState}
                        positions={props.positionsState}
                    />
                </MapContainer>
    )
    
}
export {Map}