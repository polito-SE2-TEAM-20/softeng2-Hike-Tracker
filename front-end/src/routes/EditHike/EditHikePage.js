import * as React from 'react';
import { useLocation, useMatch, useNavigate } from "react-router-dom";
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button } from "@mui/material";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";

import Alert from '@mui/material/Alert';
import { DifficultySelect } from '../../NewHike/DifficultySelect.js';
import { StartPointSelect } from '../../NewHike/SelectStart.js';
import { EndPointSelect } from '../../NewHike/SelectEnd.js';
import { Map } from '../../NewHike/Map.js';
import API from '../../API/API.js';

function EditHikePage(props) {

    const navigate = useNavigate();

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

    const [loading, setLoading] = useState(false);
    const [hike, setHike] = useState();

    const match = useMatch('/edithike/:hikeid')
    const hikeId = (match && match.params && match.params.hikeid) ? match.params.hikeid : -1
    
    useEffect(() => {
        setLoading(true);
        API.getSingleHikeByID(hikeId).then((newHike) => {
            setHike(oldHike => newHike);
            fillInputsWithHike(hike)
            setLoading(false)
        })
    }, [])


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

    const fillInputsWithHike = (newHike) => {
        // TODO: fill inputs
        console.log(newHike)
        setTitle(newHike.title)
        setLengthStr(newHike.length)
        setAscentStr(newHike.ascent)
        setDescription(newHike.description);
        setDifficultyStr(newHike.difficulty);
        setExpectedTimeStr(newHike.expectedTime)
        setCountry(newHike.country)
        setRegion(newHike.region)
        setProvince(newHike.province)
        setCity(newHike.city)
        
        // setReferencePoint([]);
        // setPositionsState(positions);
        // setStartPoint([{ name: startPointName, address: startPointAdd, lat: positions[0][0], lon: positions[0][1] }]);
        // setEndPoint([{ name: endPointName, address: endPointAdd, lat: positions[positions.length - 1][0], lon: positions[positions.length - 1][1] }]);
        //getRegion(positions[0][0], positions[0][1]);

        // getInformation(positions[0][0], positions[0][1])
        //     .then(informations => {
        //         setInformation(informations);
        //         setRegion(informations.address.state);
        //         setProvince(informations.address.county);
        //         setCountry(informations.address.country);
        //         setCity(informations.address.village);
        //         //setStartPointAdd(informations.display_name);

        //     })
        // getInformation(positions[positions.length - 1][0], positions[positions.length - 1][1])
        //     .then(informations => {
        //         setInformationEnd(informations);
        //     })
    }

    const handleEdit = (event) => {
        event.preventDefault();
        //TODO
    }

    return (
        <React.Fragment>
            <Grid >
                <Grid>
                    { loading && <h1></h1>}
                    { !loading && 
                        <>
                            <Typography variant="h6" gutterBottom sx={{ p: 2 }}>Edit your hike details here.</Typography>
                            <Grid container spacing={3} sx={{ p: 2 }} >
                                <Grid item xs={12}>
                                    <TextField
                                        disabled
                                        required id="title" name="title" label="Title"
                                        fullWidth variant="standard"
                                        value={title}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        disabled
                                        required id="lengthStr" name="lengthStr"
                                        label="Length (m)" fullWidth variant="standard" type="number" min={0}
                                        value={lengthStr}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        disabled
                                        required id="expectedTimeStr" name="expectedTimeStr" label="Expected Time (hh:mm)"
                                        fullWidth variant="standard" min={0} type="text"
                                        value={expectedTimeStr}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={6}>
                                    <TextField
                                        disabled
                                        required id="ascentStr" name="ascentStr" label="Ascent (m)"
                                        fullWidth variant="standard" type="number" min={0}
                                        value={ascentStr}
                                    />
                                </Grid>

                                <Grid item xs={12} sm={6}>
                                    <DifficultySelect 
                                        disabled
                                        setDifficultyStr={setDifficultyStr} 
                                        difficultyStr={difficultyStr}>
                                    </DifficultySelect>
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        disabled
                                        required id="country"
                                        name="country" label="Country"
                                        fullWidth autoComplete="country"
                                        variant="standard" type="text"
                                        value={country}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        disabled
                                        required id="region"
                                        name="region" label="Region"
                                        fullWidth autoComplete="region"
                                        variant="standard" type="text"
                                        value={region}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        disabled
                                        id="province" name="province"
                                        label="Province" fullWidth
                                        autoComplete="province" variant="standard" type="text"
                                        required
                                        value={province}
                                    />
                                </Grid>
                                <Grid item xs={12} sm={3}>
                                    <TextField
                                        disabled
                                        required id="city"
                                        name="city" label="City"
                                        fullWidth autoComplete="city"
                                        variant="standard" type="text"
                                        value={city}
                                    />
                                </Grid>

                                <Grid item xs={12}>
                                    <TextField
                                        disabled
                                        required id="description"
                                        name="description" label="Description (max 1000 characters)"
                                        fullWidth autoComplete="description"
                                        variant="standard" multiline
                                        inputProps={
                                            { maxLength: 999 }
                                        }
                                        value={description}
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
                                        endPointAdd={endPointAdd} setEndPointAdd={setEndPointAdd} endPointName={endPointName}
                                        setEndPointName={setEndPointName}
                                        setEndPointLat={setEndPointLat} endPointLat={endPointLat}
                                        setEndPointLon={setEndPointLon} informationEnd={informationEnd}
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
                    }
                    {
                        !loading &&
                            <Stack direction="row" justifyContent="end" sx={{ p: 2 }}>
                                <Button variant="contained" color="success" onClick={handleEdit}>EDIT HIKE</Button>
                            </Stack>
                    }
                    {
                        show ?
                            <Alert variant="outlined" severity="error" onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
                    }
                    <Grid sx={{ p: 2 }}>
                        <Map startPointLat={startPointLat} startPointLon={startPointLon} endPointLat={endPointLat} endPointLon={endPointLon} positionsState={positionsState} setPuntiDaTrack={setPuntiDaTrack} puntiDaTrack={puntiDaTrack} referencePoint={referencePoint} setReferencePoint={setReferencePoint} listReferencePoint={listReferencePoint} />
                    </Grid>
                </Grid>
            </Grid>
        </React.Fragment>
    );
}

export { EditHikePage }






