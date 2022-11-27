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

async function getInformation(lat, lon) {
    let response = await fetch((`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`), {
      method: 'GET'
    });
    if (response.ok) {
      console.log(response)
      const informations = await response.json();
      console.log(informations);
      // setInformation(informations);
      return informations;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }
  
  const ChoosenPoint = ({latitude, longitude, setLatitude, setLongitude, setRegion, setProvince, setCity, setCountry}) =>{
  
  
    const map = useMap();
  
    var popup = L.popup();
  
    map.on('click', function(e) {
      let prov = [e.latlng.lat, e.latlng.lng];
      setLongitude(e.latlng.lng);
      setLatitude(e.latlng.lat);
      let punti = e.latlng;
  popup
      .setLatLng(punti)
      .setContent("You clicked the map at " + punti.toString())
      .openOn(map);
  });

          useEffect(()=>{
            if(latitude!== null && longitude!==null){
                getInformation(latitude, longitude)
          .then(informations => {
            setRegion(informations?.address?.state? informations.address.state : '');
            setProvince(informations?.address?.county? informations.address.county : '');
            setCountry(informations?.address?.country? informations.address.country : '');
            setCity(informations?.address?.village? informations.address.village: '');
          })
            }
        }, [latitude, longitude])

        useEffect(() => {
          if ((latitude===null || latitude==='') && (longitude===null || longitude ==='')) { 
            return; 
          }else{
            map.flyTo([latitude, longitude])
          }
      
          
      
      }, [latitude, longitude]);
  
  
  }



const MapHut = props => {

    let position = [props.latitude, props.longitude];

    return(
        <MapContainer 
                    
                    className='map'
                    center={props.latitude? [props.latitude, props.longitude] : [45.4408474, 12.3155151]}
                    zoom={13}
                    scrollWheelZoom={true}
                >
                    
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                   <ChoosenPoint {...props}/>
                     {props.latitude!== null && props.longitude!==null &&
                        (<>
                            <Marker
                                key={props.latitude}
                                position={[props.latitude, props.longitude]}>
                                <Popup position={[props.latitude, props.longitude]}>
                                   You selected here {props.latitude} , {props.longitude}
                                </Popup>
                            </Marker>
                        </>)
                    }
                  </MapContainer>
    )
    
}
export {MapHut}