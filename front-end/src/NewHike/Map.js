import 'leaflet/dist/leaflet.css'
import { useEffect } from 'react';
import './map.css';
import { useState } from 'react';
import 'leaflet/dist/leaflet.css'
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, ZoomControl, Polyline, useMap } from 'react-leaflet'
import L from 'leaflet';

import HikePopup from '../components/hike-popup/HikePopup';

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

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

function getDiaDist(puntiDaTrack) {
  return Math.sqrt(Math.pow(puntiDaTrack.x, 2) + Math.pow(puntiDaTrack.y, 2))
}

function getDistance(p1, p2) {
  return getDiaDist({ x: p1[0] - p2[0], y: p1[0] - p2[0] })
}

function getDistanceFromLatLonInKm(p1, p2) {
  var p = 0.017453292519943295;    //This is  Math.PI / 180
  var c = Math.cos;
  var a = 0.5 - c((p2[0] - p1[0]) * p) / 2 +
    c(p1[0] * p) * c(p2[0] * p) *
    (1 - c((p2[1] - p1[1]) * p)) / 2;
  var R = 6371; //  Earth distance in km so it will return the distance in km
  var dist = 2 * R * Math.asin(Math.sqrt(a));
  return dist;
}


function getNearestPoint(arr, point) {
  let min = Infinity;
  let result = arr[0]
  arr.forEach(a => {
    // let dist = getDistance(a,point);
    let dist = getDistanceFromLatLonInKm(a, point)
    if (dist < min) {
      min = dist
      result = a;
    }
  })
  return result;
}



const Inner = ({ positionsState, setPuntiDaTrack, setReferencePoint, puntiDaTrack, referencePointLat, referencePointLon, setReferencePointAdd }) => {
  const map = useMap();

  var popup = L.popup();
  setPuntiDaTrack(null);
  const [punti, setPunti] = useState(null);
  if (positionsState?.length !== 0) {

    map.on('click', function (e) {
      let prov = [e.latlng.lat, e.latlng.lng];
      setPuntiDaTrack(prov);
      setPunti(e.latlng);


    });
  }
  useEffect(() => {
    if (puntiDaTrack) {
      if (positionsState?.length) {
        getNearestPoint(positionsState, puntiDaTrack);
        let nearest = (getNearestPoint(positionsState, puntiDaTrack));
        let point = positionsState.filter(el => (el[0]===nearest[0] && el[1]===nearest[1]));
        let object = { lat: nearest[0], lon: nearest[1], altitude: point[0][2] }
        punti.lat = nearest[0];
        punti.lng = nearest[1];
        setReferencePoint(object);

         L.popup({
          className: "popup-address",
      }).setLatLng(punti)
          .setContent(`<p>You clicked the map at <br/> ( ${punti.lat} , ${punti.lng}) </p>`)
          .openOn(map);
      }
    }
  }, [puntiDaTrack])


  useEffect(() => {
    if (!positionsState?.length) { return; }

    map.flyTo(positionsState[0])

  }, [positionsState]);

{/*
  useEffect(() => {
    if (startPointLat !== null && startPointLon !== null && startPointLat !== '' && startPointLon !== '') {
      return (<>
        <Marker
          key={startPointLat}
          position={[startPointLat, startPointLon]}>
          <Popup position={[startPointLat, startPointLon]}>
            Your new Start point {startPointLat} , {startPointLon}
          </Popup>
        </Marker>
      </>)
    }
  }, [startPointLat, startPointLon]);*/}

  useEffect(() => {
    if (referencePointLat !== null && referencePointLon !== null) {
      getInformation(referencePointLat, referencePointLon)
        .then(informations => {
          setReferencePointAdd(informations.display_name);
          console.log(informations.display_name)
        })
        
    }
  
  }, [referencePointLat, referencePointLon])

}




const Map = props => {

  return (
    <MapContainer
      className='map'
      center={props.positionsState.length ? props.positionsState.length / 2 : [45.4408474, 12.3155151]}
      zoom={13}
      scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: true }} zoomControl={false}
      style={{ width: "auto", minHeight: "70vh", height: "70%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Polyline
        pathOptions={{ fillColor: 'red', color: 'blue' }}
        positions={props.positionsState}
      />
      <Inner {...props} />
      {
        props.listReferencePoint.map((el) => {
          console.log(el)
          return (<>
            <Marker
              key={el.name}
              position={[el.lat, el.lon]}>
              {/*
                                <Popup position={[el.lat, el.lon]}>
                                    <HikePopup elem={el.name} />
                        </Popup>*/}
            </Marker>
          </>)
        })
      }
    </MapContainer>
  )

}
export { Map }