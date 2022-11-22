import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react';
import './map.css';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet';


delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function getDiaDist(puntiDaTrack){
    return Math.sqrt(Math.pow(puntiDaTrack.x,2) + Math.pow(puntiDaTrack.y,2))
  }
  
  function getDistance(p1,p2){
    return getDiaDist({x:p1.x - p2.x, y:p1.y - p2.y})
  }
  
  function getNearestPoint(arr,point){
    let min = Infinity;
    let result = arr[0]
    arr.forEach(a => {
      let dist = getDistance(a,point);
      if(dist > min){
        min = dist
        result = a;
      }
    })
    return result;
  }
{/*
const Punti = ({positionsState, puntiDaTrack}) =>{
    if(puntiDaTrack){

    console.log(puntiDaTrack);
    console.log(positionsState);


    getNearestPoint(positionsState, puntiDaTrack);
    console.log(getNearestPoint(positionsState, puntiDaTrack));
    let nearest = (getNearestPoint(positionsState, puntiDaTrack));
    //console.log(nearest);
    //console.log(nearest[0]);
    // let object = {lat: nearest[0], lng: nearest[1]} ;
    // console.log(object);
    //setReferencePoints(object);

    //popup
    //.setLatLng(object)
    //.setContent("You clicked the map at " + object.toString())
    //.openOn(map);
//var marker = L.marker(object).addTo(map)
    }

}*/}
  


const Inner = ({positionsState, setPuntiDaTrack, setReferencePoints, puntiDaTrack}) => {
    const map = useMap();

    var popup = L.popup();

    console.log(positionsState);
    map.on('click', function(e) {
        setPuntiDaTrack(e.latlng);
        console.log(e.latlng);


    });
    

{/*
        map.on('click', onMapClick);

function onMapClick(e) {
    setPuntiDaTrack(e.latlng);
    console.log(e.latlng);
    console.log(e.latlng.lat);
    popup
        .setLatLng(e.latlng)
        .setContent("You clicked the map at " + e.latlng.toString())
        .openOn(map);
    var marker = L.marker(e.latlng).addTo(map)
}
*/}




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