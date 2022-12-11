import * as React from 'react';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import { Map } from './Map.js';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";
import { Paper } from '@mui/material';
import Alert from '@mui/material/Alert';
import HTNavbar from '../components/HTNavbar/HTNavbar'
import { StartPointSelect } from './SelectStart'
import { EndPointSelect } from './SelectEnd'
import { PopupAddHike } from './PopupAddHike.js';
import { InformationOnHike } from './InformationOnHike.js';
import EditIcon from '@mui/icons-material/Edit';



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

  const [startPointLon, setStartPointLon] = useState('');
  const [startPointLat, setStartPointLat] = useState('');
  const [startPointName, setStartPointName] = useState('Start Point');
  const [startPointAdd, setStartPointAdd] = useState('');
  const [startPointType, setStartPointType] = useState('');

  const [hutId, setHutId] = useState('');
  const [parkingId, setParkingId] = useState('');

  const [hutIdEnd, setHutIdEnd] = useState('');
  const [parkingIdEnd, setParkingIdEnd] = useState('');

  const [endPointLat, setEndPointLat] = useState('');
  const [endPointLon, setEndPointLon] = useState('');
  const [endPointName, setEndPointName] = useState('End Point');
  const [endPointAdd, setEndPointAdd] = useState('');
  const [endPointType, setEndPointType] = useState('');

  const [newReferencePoint, setNewReferencePoint] = useState(false);
  const [listReferencePoint, setListReferencePoint] = useState([]);
  const [referencePoint, setReferencePoint] = useState([]);
  const [referencePointLat, setReferencePointLat] = useState('');
  const [referencePointLon, setReferencePointLon] = useState('');
  const [referencePointName, setReferencePointName] = useState('');
  const [referencePointAdd, setReferencePointAdd] = useState('');


  // states for the popup after adding a new hike
  const [open, setOpen] = useState(false);
  const [hikeId, setHikeId] = useState(null);
  const [err, setErr] = useState(null);

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

    setTitle(''); setLengthStr(''); setAscentStr(''); setExpectedTimeStr('');
    setDifficultyStr(0); setCountry(''); setRegion('');
    setProvince(''); setCity(''); setDescription(''); setPositionsState([]); setErrorMessage(''); setShow('');
    setPuntiDaTrack([]); setInformation(''); setStartPointLon('');
    setStartPointLat(''); setStartPointName('Start Point'); setStartPointAdd('');
    setEndPointLat(''); setEndPointLon(''); setEndPointName('End Point'); setEndPointAdd('');
    setNewReferencePoint(false);
    setListReferencePoint([]); setReferencePoint([]); setReferencePointLat(''); setReferencePointLon('');
    setReferencePointName(''); setReferencePointAdd('');
    setStartPointType(''); setEndPointType('');
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
      reader.readAsText(fileUploaded);
    }

  };

  useEffect(() => {
    if (referencePoint.length !== 0 && referencePoint !== null && referencePoint !== '' && referencePoint !== {} && referencePoint !== undefined) {
      setNewReferencePoint(true);
      setReferencePointLat(referencePoint.lat);
      setReferencePointLon(referencePoint.lon);
    }
  }, [referencePoint])

  useEffect(() => {
    if (fileContents) {
      let gpxParser = require('gpxparser');
      var gpx = new gpxParser();
      gpx.parse(fileContents);
      const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
      console.log(gpx);
      // controllare perchè se non ci sono i punti da errore
      const waypoints = gpx.waypoints.map(reference => [reference.name, reference.desc, reference.lat, reference.lon])

      // get all the waypoints from the gpx file, insert them if they are on the track
      // and give them a name if they don't have one in the gpx file
      let i = 1;
      let prova = [];
      waypoints.forEach(el => {

        let indexOfObject = positionsState.filter(object => (object[0] === el[2] && object[1] === el[3]))
        if (indexOfObject.length !== 0) {
          if (el.name === '' || el.name === null || el.name === undefined) {
            prova = [...prova, { name: i, address: el[1], lat: el[2], lon: el[3] }];
            i++;
          } else {
            prova = [...prova, { name: el[0], address: el[1], lat: el[2], lon: el[3] }];
          }
        }
        // controllare che due waypoints non abbiano lo stesso nome
        setListReferencePoint(prova);
      })

      //set List reference point con i waypoints se presenti nel gpx file
      setReferencePoint([]);
      setPositionsState(positions);
      setDescription(gpx.tracks[0].desc);
      setDifficultyStr(gpx.tracks[0].type);
      setAscentStr(gpx.tracks[0].elevation.pos);
      setTitle(gpx.tracks[0].name);
      setLengthStr(gpx.tracks[0].distance.total);

      getInformation(positions[0][0], positions[0][1])
        .then(informations => {
          setInformation(informations);
          setRegion(informations.address.state);
          setProvince(informations.address.county);
          setCountry(informations.address.country);
          setCity(informations.address.village);
        })

      getInformation(positions[positions.length - 1][0], positions[positions.length - 1][1])
        .then(informations => {
          console.log("information on end")
          console.log(informations);
          setInformationEnd(informations);
        })
    }
  }, [fileContents]);

  // after button add new reference point as been clicked
  function handleNewReferencePoint() {
    setNewReferencePoint(true);
  }

  // delete a reference point from the list of reference point
  function handleDeleteReferencePoint(n) {
    const indexOfObject = listReferencePoint.findIndex(object => object.name === n)
    const prova = listReferencePoint.splice(indexOfObject, 1);
    setListReferencePoint(listReferencePoint.filter(el => el.name !== prova.name));
  }

  function handleEditReferencePoint(n) {
    const indexOfObject = listReferencePoint.findIndex(object => object.name === n)
    const elemento = listReferencePoint[indexOfObject]
    setReferencePointLat(listReferencePoint.filter(el => el.name === elemento.name)[0].lat);
    setReferencePointLon(listReferencePoint.filter(el => el.name === elemento.name)[0].lon);
    setReferencePointName(listReferencePoint.filter(el => el.name === elemento.name)[0].name);
    setReferencePointAdd(listReferencePoint.filter(el => el.name === elemento.name)[0].address);
    setNewReferencePoint(true)

    const prova = listReferencePoint.splice(indexOfObject, 1);
    setListReferencePoint(listReferencePoint.filter(el => el.name !== prova.name));
  }

  useEffect(() => {
    if (referencePointLat== '' && referencePointLon !== '' && referencePointLat !== null && referencePointLon !== null && referencePoint !== undefined) {
      setNewReferencePoint(true);
      setReferencePointLat(referencePoint.lat);
      setReferencePointLon(referencePoint.lon);
      
    }
  }, [referencePoint])

  const handleListreferencePoints = (event) => {
    const indexOfReference = listReferencePoint.filter(object => (object.lat === parseFloat(referencePointLat) && object.lon === parseFloat(referencePointLon)));
    let prova = false;
    //let objTagliatoLat = (object[0].toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])
    //let objTagliatoLon = (object[1].toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])

    let indexOfObject = positionsState.filter(object => (object[0] === parseFloat(referencePointLat) && object[1] === parseFloat(referencePointLon)))
    if (listReferencePoint.map(el => el.name).includes(referencePointName)) {
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
      console.log(referencePointLat);
      console.log(referencePointLon);
      let stringaNome = referencePointName.toString();
      setListReferencePoint([...listReferencePoint, { name: stringaNome, address: referencePointAdd, lat: referencePointLat, lon: referencePointLon }]);
      setNewReferencePoint(false);
      setReferencePoint([]);
      setReferencePointLat('');
      setReferencePointLon('');
      setReferencePointAdd('');
      setReferencePointName('');

    }
  }


  const handleSubmit = (event) => {
    event.preventDefault();
    if (title === '' || title === null || title === undefined) {
      setErrorMessage('The title cannot be empty');
      setShow(true);
    } else if (title.trim().length === 0) {
      setErrorMessage('The title cannot be empty');
      setShow(true);
    } else if (lengthStr === '' || lengthStr === null || lengthStr === undefined) {
      setErrorMessage('The length cannot be empty');
      setShow(true);
    } else if (expectedTimeStr === null || expectedTimeStr === '' || expectedTimeStr === undefined || expectedTimeStr === 0) {
      setErrorMessage('The time expected for the hike cannot be empty')
      setShow(true);
    } else if (ascentStr === '' || ascentStr === null || ascentStr === undefined) {
      setErrorMessage('The ascent for the hike cannot be empty');
      setShow(true);
    } else if (difficultyStr === '' || difficultyStr === null || difficultyStr === undefined) {
      setErrorMessage('Choose a difficulty for this hike');
      setShow(true);
    } else if (description === '' || description === null || description === undefined) {
      setErrorMessage('The description for the hike cannot be empty');
      setShow(true);
    } else if (description.trim().length === 0) {
      setErrorMessage('The description for the hike cannot be empty');
      setShow(true);
    } else if (country === '' || country === null || country === undefined) {
      setErrorMessage('The country for the hike cannot be empty');
      setShow(true);
    } else if (country.trim().length === 0) {
      setErrorMessage('The country for the hike cannot be empty');
      setShow(true);
    } else if (region === '' || region === null || region === undefined) {
      setErrorMessage('The rgion for the hike cannot be empty');
      setShow(true);
    } else if (region.trim().length === 0) {
      setErrorMessage('The region for the hike cannot be empty');
      setShow(true);
    } else if (province === '' || province === null || province === undefined) {
      setErrorMessage('The province for the hike cannot be empty');
      setShow(true);
    } else if (province.trim().length === 0) {
      setErrorMessage('The province for the hike cannot be empty');
      setShow(true);
    } else if ((hutId === null || hutId === undefined || hutId === '') && ((parkingId === null || parkingId === undefined || parkingId === '') && ((startPointLat === null || startPointLat === undefined || startPointLat === '') && (startPointLon === null || startPointLon === undefined || startPointLon === '')))) {
      setErrorMessage('Insert a starting point');
      setShow(true);
    } else if ((hutIdEnd === null || hutIdEnd === undefined || hutIdEnd === '') && ((parkingIdEnd === null || parkingIdEnd === undefined || parkingIdEnd === '') && ((endPointLat === null || endPointLat === undefined || endPointLat === '') && (endPointLon === null || endPointLon === undefined || endPointLon === '')))) {
      setErrorMessage('Insert a ending point');
      setShow(true);
    } else {
      let start = {};
      let end = {};
      if (hutId !== null) {
        start = { hutId: hutId, address: startPointAdd };
      } else if (parkingId !== null) {
        start = { parkingLotId: parkingId, address: startPointAdd };
      } else {
        start = { name: startPointName, address: information.display_name, lat: startPointLat, lon: startPointLon };
      }

      if (hutIdEnd !== null) {
        end = { hutId: hutIdEnd, address: endPointAdd };
      } else if (parkingIdEnd !== null) {
        end = { parkingLotId: parkingIdEnd, address: endPointAdd };
      } else {
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
      formData.append('condition', 0);
      props.addNewGpx(formData)
        .then(newHike => {
          console.log(newHike);
          setOpen(true);
          setHikeId(newHike.id);
          setErr(null)
        })
        .catch((err) => {
          setOpen(true);
          setHikeId(null);
          setErr(err)
        })

      setSelectedFile(null); setFileContents(null); setIsFilePicked(false);
      setTitle(''); setLengthStr(''); setAscentStr(''); setExpectedTimeStr('');
      setDifficultyStr(0); setCountry(''); setRegion('');
      setProvince(''); setCity(''); setDescription(''); setPositionsState([]); setErrorMessage(''); setShow('');
      setPuntiDaTrack([]); setInformation(''); setStartPointLon('');
      setStartPointLat(''); setStartPointName('Start Point'); setStartPointAdd('');
      setEndPointLat('');
      setEndPointLon('');
      setEndPointName('End Point');
      setEndPointAdd('');
      setNewReferencePoint(false);
      setListReferencePoint([]); setReferencePoint([]); setReferencePointLat(' '); setReferencePointLon(' ');
      setReferencePointName(''); setReferencePointAdd('');

    }

  }
  const gotoLogin = () => {
    navigate("/login", { replace: false })
  }


  return (
    <React.Fragment>
      <Grid >
        <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin}/>
        {
          <PopupAddHike id={hikeId} err={err} open={open} setOpen={setOpen} />
        }
        <Typography fontFamily="Bakbak One, display" fontWeight="700" variant="h4" gutterBottom sx={{ p: 2, mr:5, ml:5 }} mt={14}>
          INSERT A NEW HIKE
        </Typography>
        <Grid container spacing={3} sx={{ p: 2, ml:2, mr:2}}>
          <Grid item xs={12} sm={3}>
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
        <Grid sx={{ml:5, mr:5}}>
          {
            selectedFile ? (
              <>
                <Typography variant="h6" gutterBottom sx={{ p: 2 }}>Insert information on the hike</Typography>
                <Grid container spacing={3} sx={{ p: 2 }} >
                  <Grid item xs={12} sm={12}><Typography variant="h8" gutterBottom>INFORMATIONS</Typography></Grid>
                  <InformationOnHike title={title} setTitle={setTitle} setLengthStr={setLengthStr} lengthStr={lengthStr}
                    expectedTimeStr={expectedTimeStr} setExpectedTimeStr={setExpectedTimeStr}
                    ascentStr={ascentStr} setAscentStr={setAscentStr} setDifficultyStr={setDifficultyStr}
                    difficultyStr={difficultyStr} country={country} setCountry={setCountry} region={region}
                    setRegion={setRegion} province={province} setProvince={setProvince} city={city}
                    setCity={setCity} description={description} setDescription={setDescription} />

                  <Grid item xs={12} sm={6}>
                    <Grid item xs={12} sm={6}><Typography variant="h8" gutterBottom>START POINT</Typography></Grid>
                    <StartPointSelect startPointName={startPointName} setStartPointName={setStartPointName}
                      setStartPointAdd={setStartPointAdd} startPointAdd={startPointAdd}
                      setStartPointLat={setStartPointLat} setStartPointLon={setStartPointLon}
                      startPointLat={startPointLat} startPointLon={startPointLon}
                      setStartPointType={setStartPointType} startPointType={startPointType}
                      setHutId={setHutId} hutId={hutId} setParkingId={setParkingId} parkingId={parkingId}
                      positionsState={positionsState} information={information}
                    ></StartPointSelect>
                  </Grid>
                  <Grid item xs={12} sm={6}>

                    <Grid item xs={12} sm={6}><Typography variant="h8" gutterBottom>END POINT</Typography></Grid>
                    <EndPointSelect
                      endPointName={endPointName} setEndPointName={setEndPointName}
                      endPointAdd={endPointAdd} setEndPointAdd={setEndPointAdd}
                      setEndPointLat={setEndPointLat} endPointLat={endPointLat}
                      endPointLon={endPointLon} setEndPointLon={setEndPointLon}
                      setEndPointType={setEndPointType} endPointType={endPointType}
                      setHutIdEnd={setHutIdEnd} hutIdEnd={hutIdEnd}
                      setParkingIdEnd={setParkingIdEnd} parkingIdEnd={parkingIdEnd}
                      informationEnd={informationEnd}
                      positionsState={positionsState}
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
                                <Grid item xs={12} sm={2}>
                                  <TextField id="referencename" name="referencename"
                                    label="Reference Point Name" fullWidth
                                    autoComplete="referencename" variant="standard"
                                    value={reference.name}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={3.5}>
                                  <TextField
                                    name="referencePointAdd"
                                    label="Reference Point Address"
                                    fullWidth
                                    autoComplete="referencePointAdd"
                                    variant="standard"
                                    disabled
                                    value={reference.address}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={2}>
                                  <TextField name="referencelat"
                                    label="Reference Point Latitude" fullWidth
                                    autoComplete="referencelat" variant="standard"
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
                                    id="outlined-disabled"
                                    value={reference.lon}
                                  />
                                </Grid>
                                <Grid item xs={12} sm={1} mt={2}>
                                  <Button edge="end" onClick={() => handleEditReferencePoint(reference.name)} >
                                    <EditIcon />
                                  </Button>
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
                          <Grid item xs={12} sm={12}>
                            <Button onClick={handleNewReferencePoint}>ADD A NEW REFERENCE POINT</Button><h6 >Or click on the map</h6>
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
                            disabled
                            value={referencePointAdd}
                          // onChange={(e) => setReferencePointAdd(e.target.value)}
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
            <Paper elevation={5}>
              <Map startPointLat={startPointLat} startPointLon={startPointLon} endPointLat={endPointLat} endPointLon={endPointLon} positionsState={positionsState} setPuntiDaTrack={setPuntiDaTrack} puntiDaTrack={puntiDaTrack} referencePoint={referencePoint} setReferencePoint={setReferencePoint} listReferencePoint={listReferencePoint} />
            </Paper>
          </Grid>
        </Grid>
      </Grid>
    </React.Fragment>
  );
}


export { NewHikeStEnd }




