import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Map } from './Map.js';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { spacing } from '@mui/system';
import { Button, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";

import WarningIcon from '@mui/icons-material/Warning';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Alert from '@mui/material/Alert';
import HTNavbar from '../components/HTNavbar/HTNavbar'
import { warning } from '@remix-run/router';

import API_NewHike from './API_Newhike';
import {DifficultySelect} from './DifficultySelect'
import {StartPointSelect} from './SelectStart'
import {EndPointSelect} from './SelectEnd'

      {/*
        
        if([title, lengthStr, expectedTimeStr, ascentStr, difficultyStr, description, region, province, startPointName, startPointLat, startPointLon,  endPointName,  endPointLat, endPointLon].some(t=> t.length ===0)){
          setErrorMessage("All fields with the * should be filled");
          setShow(true);
      }else if(title.match(/^\s+$/)){
          setErrorMessage("insert a valid name for the hut");
          setShow(true);
      }else if(!province.match(/^[a-zA-Z]+[a-zA-Z]+$/) || !region.match(/^[a-zA-Z]+[a-zA-Z]+$/) ){
              setErrorMessage("insert a valid name for region and province");
              setShow(true);
              //check if the coordinate are with the comma or the point
      }else if((!startPointLat.match(/^([0-9]*[.])?[0-9]+$/)) || !startPointLon.match(/^([0-9]*[.])?[0-9]+$/)  ) {
              setErrorMessage("insert a valid value for the latitude and longitude of the starting point e.g 45.1253 ");
              setShow(true);
      }else if(!endPointLat.match(/^([0-9]*[.])?[0-9]+$/) || !endPointLon.match(/^([0-9]*[.])?[0-9]+$/)  ) {
              setErrorMessage("insert a valid value for the latitude and longitude of the ending point e.g 45.1253 ");
              setShow(true);
      }else if(!ascentStr.match(/^([0-9]*[.])?[0-9]+$/)) {
              setErrorMessage("insert a valid value for the ascent ");
              setShow(true);
      }else if(!expectedTimeStr.match(/^(([0-9][0-9])+[:]([0-9][0-9]))+$/)) {
              setErrorMessage("insert a valid value for the expected time e.g (10:13, 00:10, 15:00)");
              setShow(true);

        */ }

function NewHikeStEnd(props) {

  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContents, setFileContents] = useState(null);
  const [isFilePicked, setIsFilePicked] = useState(false);

  const [title, setTitle] = useState('');
  const [lengthStr, setLengthStr] = useState('');
  const [ascentStr, setAscentStr] = useState('');
  const [expectedTimeStr, setExpectedTimeStr] = useState('');

  const [difficultyStr, setDifficultyStr] = useState(0);
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [province, setProvince] = useState('');
  const [city, setCity] = useState('');
  const [description, setDescription] = useState('');
  const [positionsState, setPositionsState] = useState([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState('');

  const [puntiDaTrack, setPuntiDaTrack] = useState([]);
  const [information, setInformation] = useState('');
  const [informationEnd, setInformationEnd] = useState('');

  const [startPoint, setStartPoint] = useState({ name: "", address: null, lat: "", lon: "" });
  const [startPointLon, setStartPointLon] = useState('');
  const [startPointLat, setStartPointLat] = useState('');
  const [startPointName, setStartPointName] = useState('Start Point');
  const [startPointAdd, setStartPointAdd] = useState('');
  const [startPointType, setStartPointType] = useState('');

  const [hutId, setHutId] = useState('');
  const [parkingId, setParkingId] = useState('');

  const [hutIdEnd, setHutIdEnd] = useState('');
  const [parkingIdEnd, setParkingIdEnd] = useState('');

  const [endPoint, setEndPoint] = useState({ name: "", address: null, lat: "", lon: "" });
  const [endPointLat, setEndPointLat] = useState('');
  const [endPointLon, setEndPointLon] = useState('');
  const [endPointName, setEndPointName] = useState('End Point');
  const [endPointAdd, setEndPointAdd] = useState('');
  const [endPointType, setEndPointType] = useState('');

  const [newReferencePoint, setNewReferencePoint] = useState(false);
  const [listReferencePoint, setListReferencePoint] = useState([]);
  const [referencePoint, setReferencePoint] = useState({});
  const [referencePointLat, setReferencePointLat] = useState(' ');
  const [referencePointLon, setReferencePointLon] = useState(' ');
  const [referencePointName, setReferencePointName] = useState('');
  const [referencePointAdd, setReferencePointAdd] = useState('');

  async function getInformation(lat, lon) {
    let response = await fetch((`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&addressdetails=1`), {
      method: 'GET'
    });
    if (response.ok) {
      console.log(response)
      const informations = await response.json();
      console.log(informations);
      setInformation(informations);
      return informations;
    } else {
      const errDetail = await response.json();
      throw errDetail.message;
    }
  }


  const hiddenFileInput = React.useRef(null);
  const handleClick = event => {
    hiddenFileInput.current.click();
  };


  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    setIsFilePicked(true);
    setSelectedFile(fileUploaded);

    const reader = new FileReader()
    reader.onload = (e) => {
      setFileContents(reader.result)
    };
    if (event.target.files[0] && event.target.files) {
      reader.readAsText(fileUploaded)
    }

  };

  useEffect(() => {

    if (puntiDaTrack?.length !== 0) {
      setNewReferencePoint(true);
    }
    if (referencePoint) {
      setReferencePointLat(referencePoint.lat);
      setReferencePointLon(referencePoint.lon);
    }
  }, [puntiDaTrack, referencePoint])

  useEffect(() => {
    if (fileContents) {
      let gpxParser = require('gpxparser');
      var gpx = new gpxParser();
      gpx.parse(fileContents);
      const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
      console.log(gpx);
      // controllare perchè se non ci sono i punti da errore
      const waypoints = gpx.waypoints.map(reference => [reference.name, reference.desc, reference.lat, reference.lon])
      console.log(waypoints);
      setListReferencePoint([]);
      let i = 1;

      let prova = [];
      waypoints.forEach(el => {
        console.log(i);
        console.log(el.name)
        if (el.name === '' || el.name === null || el.name === undefined) {
          prova = [...prova, { name: i, address: el[1], lat: el[2], lon: el[3] }];
          i++;
        } else {

          prova = [...prova, { name: el[0], address: el[1], lat: el[2], lon: el[3] }];
        }

        // controllare che due waypoints non abbiano lo stesso nome
        console.log(prova);
        setListReferencePoint(prova);
      })
      //set List reference point con i waypoints se presenti nel gpx file
      setReferencePoint([]);
      
      setPositionsState(positions);
      // setStartPoint([{ name: startPointName, address: startPointAdd, lat: positions[0][0], lon: positions[0][1] }]);
      // setEndPoint([{ name: endPointName, address: endPointAdd, lat: positions[positions.length - 1][0], lon: positions[positions.length - 1][1] }]);
      setDescription(gpx.tracks[0].desc);
      setDifficultyStr(gpx.tracks[0].type);
      setAscentStr(gpx.tracks[0].elevation.pos);
      setTitle(gpx.tracks[0].name);
      setLengthStr(gpx.tracks[0].distance.total);
      //getRegion(positions[0][0], positions[0][1]);

      getInformation(positions[0][0], positions[0][1])
        .then(informations => {
          setInformation(informations);
          setRegion(informations.address.state);
          setProvince(informations.address.county);
          setCountry(informations.address.country);
          setCity(informations.address.village);
          //setStartPointAdd(informations.display_name);

        })
      getInformation(positions[positions.length - 1][0], positions[positions.length - 1][1])
        .then(informations => {
          setInformationEnd(informations);
        })
    }
  }, [fileContents]);

  const handleNewReferencePoint = (event) => {
    setNewReferencePoint(true);
  }

  function handleDeleteReferencePoint(n) {
    const indexOfObject = listReferencePoint.findIndex(object => object.name === n)
    const prova = listReferencePoint.splice(indexOfObject, 1);
    setListReferencePoint(listReferencePoint.filter(el => el.name !== prova.name));
  }

  const handleListreferencePoints = (event) => {
    const indexOfReference = listReferencePoint.filter(object => (object.lat === referencePointLat && object.lon === referencePointLon));
    let prova = false;
    //let objTagliatoLat = (object[0].toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])
    //let objTagliatoLon = (object[1].toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])
    let indexOfObject = positionsState.filter(object => (object[0] === referencePointLat && object[1] === referencePointLon))
    if (listReferencePoint.map(el => el.name).includes(referencePointName)) {
      console.log("c'è già un reference point con quel nome")
      setErrorMessage("There is already a reference point with  the same name, choose another one");
      setShow(true);
    } else if (referencePointName === '' || referencePointLat === '' || referencePointLon === '') {
      setErrorMessage("Name, Longitude and Latitude of the reference points cannot be empty");
      setShow(true);
    } else if (indexOfReference.length !== 0) {
      setErrorMessage("Coordinates already present for another reference point");
      setShow(true);
    } else if (indexOfObject.length === 0) {
      setErrorMessage("Coordinates are not part of the track");
      setShow(true);
    } else {
      setListReferencePoint([...listReferencePoint, { name: referencePointName, address: referencePointAdd, lat: referencePointLat, lon: referencePointLon }]);
      setNewReferencePoint(false);
      setReferencePoint(null);
    }
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    if (title.trim().length === 0) {
      setErrorMessage('The title cannot be empty');
      setShow(true);
    } else if (lengthStr.length === 0) {

      setErrorMessage('The length cannot be empty');
      setShow(true);

    } else if (expectedTimeStr.trim().length === 0) {

      setErrorMessage('The time expected for the hike cannot be empty')
      setShow(true);

    } else if (ascentStr.length === 0) {

      setErrorMessage('The ascent for the hike cannot be empty');
      setShow(true);

    } else if (difficultyStr.length === 0) {
      setErrorMessage('The difficulty for the hike cannot be empty');
      setShow(true);


    } else if (description.length === 0) {

      setErrorMessage('The description for the hike cannot be empty');
      setShow(true);
    } else if (region.length === 0) {

      setErrorMessage('The rgion for the hike cannot be empty');
      setShow(true);
    } else if (province.length === 0) {

      setErrorMessage('The province for the hike cannot be empty');
      setShow(true);
    } else if (startPointName === '' || startPointLat === '' || endPointLon === '') {

      setErrorMessage('The name, latitude and longitude of the starting point cannot be empty');
      setShow(true);
    } else if (endPointName === '' || endPointLat === '' || endPointLon === '') {

      setErrorMessage('The name, latitude and longitude of the ending point cannot be empty');
      setShow(true);
    }else if((hutId!== null && parkingId!== null && startPointLat!==null && startPointLon!==null) || (hutId!== null && parkingId!== null) || (hutId!== null  && startPointLat!==null && startPointLon!==null) ){
        setErrorMessage('Choose only a starting point');
      setShow(true);
    }else if((hutIdEnd!== null && parkingIdEnd!== null && endPointLat!==null && endPointLon!==null) || (hutIdEnd!== null && parkingIdEnd!== null) || (hutIdEnd!== null  && endPointLat!==null && endPointLon!==null)){
        setErrorMessage('Choose only a ending point');
      setShow(true);
    }else {
    let start= {};
    let end={};
      if(hutId!==null){
        start = {hutId : hutId, address: 'prova' };
      }else if(parkingId !== null){
        start = {parkingLotId: parkingId, address: 'rpova'};
      }else{

        start = { name: startPointName, address: information.display_name, lat: startPointLat, lon: startPointLon };
      }

      if(hutIdEnd!==null){
        end = {hutId : hutIdEnd, address: 'prova' };
      }else if(parkingIdEnd !== null){
        end = {parkingLotId: parkingIdEnd, address: 'prova'};
      }else{
        end = { name: endPointName, address: endPointAdd, lat: endPointLat, lon: endPointLon }
    }
      const length = parseFloat(lengthStr);
      let a = expectedTimeStr.split(':'); // split it at the colons
      let minutes = parseInt(a[0]) * 60 + parseInt(a[1]);
      const expectedTime = parseInt(minutes);
      const ascent = parseFloat(ascentStr);
      const difficulty = parseFloat(difficultyStr);
      const formData = new FormData();
      formData.append('gpxFile', selectedFile);
      formData.append('title', title);
      formData.append('length', length);
      formData.append('expectedTime', expectedTime);
      formData.append('ascent', ascent);
      formData.append('difficulty', difficulty);
      formData.append('description', description);
      formData.append('region', region);
      formData.append('province', province);
      formData.append('referencePoints', JSON.stringify(listReferencePoint));
      formData.append('startPoint', JSON.stringify(start));
      formData.append('endPoint', JSON.stringify(end));
      //controllare che questi ultimi due funzionino 
      formData.append('country', country);
      formData.append('city', city);
      props.addNewGpx(formData).catch((err) => { setErrorMessage(err); setShow(true) })
      navigate('/localGuide');
    }

  }

  const gotoLogin = () => {
    navigate("/login", { replace: false })
  }
  const gotoLocalGuide = () => {
    navigate("/localGuide", { replace: false })
  }

  return (
    <React.Fragment>
      <Grid >
        {/*<HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} navigate={gotoLocalGuide} />*/}

        <Typography variant="h6" gutterBottom sx={{ p: 2 }} mt={12}>
          INSERT A NEW HIKE
        </Typography>
        <Grid container spacing={3} sx={{ p: 2 }}>
          <Grid item xs={12} sm={6}>
            <Button
              component="label"
              variant="outlined"
              startIcon={<UploadFileIcon />}
              sx={{ marginRight: "1rem" }}
              onClick={handleClick}
            >
              Upload gpx
            </Button>
            <input type="file" accept=".gpx" hidden ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} />

          </Grid>
          <Grid item xs={12} sm={6}>
            {selectedFile ?
              (<Grid> Filename: {selectedFile?.name}</Grid>)
              :
              (<Grid> Select a file to show details </Grid>)
            }
          </Grid>
        </Grid>
        <Grid>
          {
            selectedFile ? (
              <>
                <Typography variant="h6" gutterBottom sx={{ p: 2 }}>Insert information on the hike</Typography>
                <Grid container spacing={3} sx={{ p: 2 }} >
                  <Grid item xs={12}>
                    <TextField
                      required id="title" name="title" label="Title"
                      fullWidth variant="standard"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required id="lengthStr" name="lengthStr"
                      label="Length (m)" fullWidth variant="standard" type="number" min={0}
                      value={lengthStr}
                      onChange={(e) => { setLengthStr(e.target.value) }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required id="expectedTimeStr" name="expectedTimeStr" label="Expected Time (hh:mm)"
                      fullWidth variant="standard" min={0} type="text"
                      value={expectedTimeStr}
                      onChange={(e) => { setExpectedTimeStr(e.target.value) }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      required id="ascentStr" name="ascentStr" label="Ascent (m)"
                      fullWidth variant="standard" type="number" min={0}
                      value={ascentStr}
                      onChange={(e) => setAscentStr(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <DifficultySelect setDifficultyStr={setDifficultyStr} difficultyStr={difficultyStr}></DifficultySelect>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required id="country"
                      name="country" label="Country"
                      fullWidth autoComplete="country"
                      variant="standard" type="text"
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required id="region"
                      name="region" label="Region"
                      fullWidth autoComplete="region"
                      variant="standard" type="text"
                      value={region}
                      onChange={(e) => setRegion(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      id="province" name="province"
                      label="Province" fullWidth
                      autoComplete="province" variant="standard" type="text"
                      required
                      value={province}
                      onChange={(e) => setProvince(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <TextField
                      required id="city"
                      name="city" label="City"
                      fullWidth autoComplete="city"
                      variant="standard" type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      required id="description"
                      name="description" label="Description (max 1000 characters)"
                      fullWidth autoComplete="description"
                      variant="standard" multiline
                      inputProps={
                        { maxLength: 999 }
                      }
                      //mettere un alert se vai oltre
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </Grid> 
                  <Grid item xs={12} sm={12}><Typography variant="h8" gutterBottom>START POINT</Typography></Grid>
                  <Grid item xs={12} sm={12}>
                    <StartPointSelect startPointName={startPointName} setStartPointName={setStartPointName} 
                                         setStartPointAdd={setStartPointAdd} startPointAdd={startPointAdd} 
                                         setStartPointLat={setStartPointLat} setStartPointLon={setStartPointLon}
                                         startPointLat={startPointLat} startPointLon={startPointLon} 
                                         setStartPointType={setStartPointType} startPointType={startPointType}
                                         setHutId={setHutId} hutId={hutId} setParkingId={setParkingId} parkingId={parkingId}
                                          positionsState={positionsState} information={information}
                                         ></StartPointSelect>
                                        
                  </Grid>
                  <Grid item xs={12} sm={12}><Typography variant="h8" gutterBottom>END POINT</Typography></Grid>
                  <Grid item xs={12} sm={12}>
                    <EndPointSelect 
                                         setEndPointType={setEndPointType} endPointType={endPointType}
                                         setHutIdEnd={setHutIdEnd} hutId={hutIdEnd} setParkingIdEnd={setParkingIdEnd} parkingId={parkingIdEnd}
                                         endPointAdd={endPointAdd} setEndPointAdd={setEndPointAdd}  endPointName={endPointName}
                                         setEndPointName={setEndPointName} 
                                         setEndPointLat={setEndPointLat} endPointLat={endPointLat} 
                                         setEndPointLon={setEndPointLon}  informationEnd= {informationEnd}
                                         endPointLon={endPointLon} positionsState={positionsState}
                                         ></EndPointSelect>
                                        
                  </Grid>

                  {
                    listReferencePoint.length ?
                      (<>
                        <Grid item xs={12} sm={12}><Typography variant="h8" gutterBottom>REFERENCE POINTS</Typography></Grid>
                        {listReferencePoint.map((reference) => {
                          return (
                            <>
                              <>


                                <Grid item xs={12} sm={3.5}>
                                  <TextField id="referencename" name="referencename"
                                    label="Reference Point Name" fullWidth
                                    autoComplete="referencename" variant="standard"
                                    value={reference.name}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={3.5}>
                                  <TextField
                                    required
                                    name="referencePointAdd"
                                    label="Reference Point Address"
                                    fullWidth
                                    autoComplete="referencePointAdd"
                                    variant="standard"
                                    value={reference.address}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <TextField name="referencelat"
                                    label="Reference Point Latitude" fullWidth
                                    autoComplete="referencelat" variant="standard"
                                    disabled

                                    id="outlined-disabled"
                                    value={reference.lat}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <TextField
                                    name="referencePointLon"
                                    label="Reference Point Longitude"
                                    fullWidth
                                    autoComplete="referencePointLon"
                                    variant="standard"
                                    disabled
                                    id="outlined-disabled"
                                    value={reference.lon}
                                  />
                                </Grid>

                                <Grid item xs={12} sm={1} mt={2}>
                                  <Button edge="end" onClick={() => handleDeleteReferencePoint(reference.name)} >
                                    <DeleteIcon />
                                  </Button>
                                </Grid>

                              </>
                            </>
                          )
                        })}

                      </>
                      ) : (<h2></h2>)
                  }
                  {
                    !newReferencePoint ?
                      (
                        <>
                          {console.log(newReferencePoint)}
                          <Grid item xs={12}>
                            <Button onClick={handleNewReferencePoint}>ADD A NEW REFERENCE POINT</Button>
                          </Grid>
                        </>
                      )
                      :
                      (<>
                        <Grid item xs={12} sm={3.5}>
                          <TextField
                            required
                            id="referencePointName" name="referencePointName"
                            label="Reference Point Name" fullWidth
                            autoComplete="referencePointName" variant="standard"
                            value={referencePointName}
                            onChange={(e) => setReferencePointName(e.target.value)}
                          />
                        </Grid>

                        <Grid item xs={12} sm={3.5}>
                          <TextField
                            required id="referencePointAdd"
                            name="referencePointAdd" label="Reference Point Address"
                            fullWidth autoComplete="referencePointAdd" variant="standard"
                            value={referencePointAdd}
                            onChange={(e) => setReferencePointAdd(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            required
                            id="referencePointLat" name="referencePointLat"
                            label="Reference Point Latitude" fullWidth
                            placeholder='41.43'
                            autoComplete="referencePointLat" variant="standard"
                            value={referencePointLat}
                            onChange={(e) => setReferencePointLat(e.target.value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <TextField
                            required id="referencePointLon"
                            name="referencePointLon" label="Reference Point Longitude"
                            fullWidth autoComplete="referencePointLon" variant="standard"
                            value={referencePointLon} placeholder='-71.15'
                            onChange={(e) => { setReferencePointLon(e.target.value); }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={1} mt={2}><Button onClick={handleListreferencePoints}>ADD</Button></Grid>
                      </>)
                  }
                </Grid>
              </>
            ) : (<h1></h1>)
          }
          {
            show ?
              <Alert variant="outlined" severity="error" onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
          }
          {
            selectedFile ? (
              <Stack direction="row" justifyContent="end" sx={{ p: 2 }}>
                <Button variant="contained" color="success" onClick={handleSubmit}>SUBMIT FORM</Button>
              </Stack>
            ) : (<h1></h1>)
          }
          <Grid sx={{ p: 2 }}>
            <Map positionsState={positionsState} setPuntiDaTrack={setPuntiDaTrack} puntiDaTrack={puntiDaTrack} referencePoint={referencePoint} setReferencePoint={setReferencePoint} listReferencePoint={listReferencePoint} />
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}

export { NewHikeStEnd }





