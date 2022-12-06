import { useMatch } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";
import { Paper } from '@mui/material';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import { Map } from '../../NewHike/Map';
import API from "../../API/API";
import { HikeGeneralInformationView } from "./HikeGeneralInformationView";
import { SelectStartEndPoint, SelectStartEndPointMode, SelectStartEndPointType } from "./SelectStartEndPoint";
import { getInformation } from "../../lib/common/Address";



function EditHikePage(props) {

    const match = useMatch('/edithike/:hikeid')
    const hikeId = match.params.hikeid ? match.params.hikeid : -1;

    //Hike deatils vars
    const [hikeDetails, setHikeDetails] = useState(null);
    const [title, setTitle] = useState('');
    const [lengthStr, setLengthStr] = useState('');
    const [ascentStr, setAscentStr] = useState('');
    const [expectedTimeStr, setExpectedTimeStr] = useState('');
    const [difficultyStr, setDifficultyStr] = useState(-1);
    const [country, setCountry] = useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [description, setDescription] = useState('');

    const [fileContents, setFileContents] = useState(null);
    const [positionsState, setPositionsState] = useState([]);

    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState('');

    const [puntiDaTrack, setPuntiDaTrack] = useState([]);
    const [information, setInformation] = useState('');
    const [informationEnd, setInformationEnd] = useState('');

    //Start point params
    const [startPointType, setStartPointType] = useState('');
    const [startPointLon, setStartPointLon] = useState('');
    const [startPointLat, setStartPointLat] = useState('');
    const [startPointName, setStartPointName] = useState('Start Point');
    const [startPointAdd, setStartPointAdd] = useState('');
    const [startPointHutId, setStartPointHutId] = useState('');
    const [startPointParkingId, setStartPointParkingId] = useState('');

    //End point params
    const [endPointType, setEndPointType] = useState('');
    const [endPointLat, setEndPointLat] = useState('');
    const [endPointLon, setEndPointLon] = useState('');
    const [endPointName, setEndPointName] = useState('End Point');
    const [endPointAdd, setEndPointAdd] = useState('');
    const [endPointHutId, setEndPointHutId] = useState('');
    const [endPointParkingId, setEndPointParkingId] = useState('');

    const [newReferencePoint, setNewReferencePoint] = useState(false);
    const [listReferencePoint, setListReferencePoint] = useState([]);
    const [referencePoint, setReferencePoint] = useState([]);
    const [referencePointLat, setReferencePointLat] = useState('');
    const [referencePointLon, setReferencePointLon] = useState('');
    const [referencePointName, setReferencePointName] = useState('');
    const [referencePointAdd, setReferencePointAdd] = useState('');

    // states for the popup after adding a new hike
    const [open, setOpen] = useState(false);
    const [err, setErr] = useState(null);
    
    //Get hike deatils
    useEffect(() => {
        const getHike = async () => {
            setLoading(true);

            const details = await API.getSingleHikeByID(hikeId);
            if (details) {
                setHikeDetails(details);
                setLoading(false);
            }
        }
        getHike();
    }, [])

    //Update fields based on hike details
    useEffect(() => {
        if (hikeDetails) {
            fillPreDefinedHikeDetails()
        }
    }, [hikeDetails])

    //Getting and parsing GPX file
    useEffect(() => {
        if (hikeDetails) {
            const getGPXFile = async () => {
                //Getting GPX file
                const gpxFile = await API.getPathByID(hikeDetails.gpxPath)
                setFileContents(gpxFile)
            }
            getGPXFile()
        }
    }, [hikeDetails])

    //TODO
    useEffect(() => {
        if (referencePoint.length !== 0 && referencePoint !== null && referencePoint !== '' && referencePoint !== {} && referencePoint !== undefined) {
            setNewReferencePoint(true);
            setReferencePointLat(referencePoint.lat);
            setReferencePointLon(referencePoint.lon);
        }
    }, [referencePoint])

    //TODO
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
                    setInformationEnd(informations);
                })
        }
    }, [fileContents]);
 
    const fillPreDefinedHikeDetails = async() => {
        setTitle(hikeDetails.title)
        setLengthStr(hikeDetails.length)
        setAscentStr(hikeDetails.ascent)
        setExpectedTimeStr(hikeDetails.expectedTime)

        setDifficultyStr(hikeDetails.difficulty);
        setCountry(hikeDetails.country)
        setRegion(hikeDetails.region)
        setProvince(hikeDetails.province)
        setCity(hikeDetails.city)
        setDescription(hikeDetails.description)

        const startPoint = hikeDetails.startPoint;
        const endPoint = hikeDetails.endPoint;

        switch(startPoint.type) {
            case "point": {
                setStartPointType(SelectStartEndPointType.COORDINATES);
                setStartPointLon(startPoint.point.position.coordinates[0])
                setStartPointLat(startPoint.point.position.coordinates[1])
                setStartPointName(startPoint.point.name)
                setStartPointAdd(startPoint.point.address)
                break;
            }
            case "parking": {
                //TODO get lat long by gpx file
                //TODO get parking details by id
                break;
            }
            case "hut": {
                //TODO get lat long by gpx file
                //TODO get hut details
                break;
            }
        }

        switch(endPoint.type) {
            case "point": {
                setEndPointType(SelectStartEndPointType.COORDINATES);
                setEndPointLon(endPoint.point.position.coordinates[0])
                setEndPointLat(endPoint.point.position.coordinates[1])
                setEndPointName(endPoint.point.name)
                setEndPointAdd(endPoint.point.address)
                break;
            }
            case "parking": {
                //TODO get lat long by gpx file
                //TODO get parking details by id
                break;
            }
            case "hut": {
                //TODO get lat long by gpx file
                //TODO get hut details
                break;
            }
        }
    }

    //TODO
    // after button add new reference point as been clicked
    function handleNewReferencePoint() {
        setNewReferencePoint(true);
    }

    //TODO
    // delete a reference point from the list of reference point
    function handleDeleteReferencePoint(n) {
        const indexOfObject = listReferencePoint.findIndex(object => object.name === n)
        const prova = listReferencePoint.splice(indexOfObject, 1);
        setListReferencePoint(listReferencePoint.filter(el => el.name !== prova.name));
    }

    //TODO
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

    //TODO
    const handleListreferencePoints = (event) => {
        const indexOfReference = listReferencePoint.filter(object => (object.lat === referencePointLat && object.lon === referencePointLon));
        let prova = false;
        //let objTagliatoLat = (object[0].toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])
        //let objTagliatoLon = (object[1].toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])
        let indexOfObject = positionsState.filter(object => (object[0] === referencePointLat && object[1] === referencePointLon))
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

    const handleEdit = (event) => {
        event.preventDefault();
        if (title.trim() === '' || title === null || title === undefined) {
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
        } else if (description.trim() === '' || description === null || description === undefined) {
            setErrorMessage('The description for the hike cannot be empty');
            setShow(true);
        } else if (country.trim() === '' || country === null || country === undefined) {
            setErrorMessage('The country for the hike cannot be empty');
            setShow(true);
        } else if (region.trim() === '' || region === null || region === undefined) {
            setErrorMessage('The rgion for the hike cannot be empty');
            setShow(true);
        } else if (province.trim() === '' || province === null || province === undefined) {
            setErrorMessage('The province for the hike cannot be empty');
            setShow(true);
        } else {
            let start = {};
            let end = {};
            switch(startPointType) {
                case SelectStartEndPointType.COORDINATES: {
                    start = { name: startPointName, address: information.display_name, lat: startPointLat, lon: startPointLon };
                    break;
                }
                case SelectStartEndPointType.PARKING: {
                    if (startPointParkingId !== null) {
                        start = { parkingLotId: startPointParkingId, address: startPointAdd };
                    }
                    break;
                }
                case SelectStartEndPointType.HUT: {
                    if (startPointHutId !== null) {
                        start = { hutId: startPointHutId, address: startPointAdd };
                    }
                    break;
                }
            }

            switch(endPointType) {
                case SelectStartEndPointType.COORDINATES: {
                    end = { name: endPointName, address: endPointAdd, lat: endPointLat, lon: endPointLon }
                    break;
                }
                case SelectStartEndPointType.PARKING: {
                    if (endPointParkingId !== null) {
                        end = { parkingLotId: endPointParkingId, address: endPointAdd };
                    } 
                    break;
                }
                case SelectStartEndPointType.HUT: {
                    if (endPointHutId !== null) {
                        end = { hutId: endPointHutId, address: endPointAdd };
                    }
                    break;
                }
            }

            const length = parseFloat(lengthStr);
            const expectedTime = parseInt(expectedTimeStr);
            const ascent = parseFloat(ascentStr);
            const difficulty = parseFloat(difficultyStr);
            const formData = new FormData();
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
            
            //TODO: Handle updating hike

            setFileContents(null);
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
    
    return (
        <React.Fragment>
            {
                loading && 
                <Grid
                    container
                    direction="row"
                    justifyContent="center"
                    alignItems="center">
                        <CircularProgress />
                </Grid>
            }
            {
                (!loading && hikeDetails) && 
                <Grid>
                    <Typography fontFamily="Bakbak One, display" fontWeight="700" variant="h4" gutterBottom sx={{ p: 2 }} mt={12}>
                        EDIT YOUR HIKE
                    </Typography>
                    <Grid>
                        <Grid container spacing={3} sx={{ p: 2 }} >
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h8" gutterBottom>
                                    INFORMATIONS
                                </Typography>
                            </Grid>
                            <HikeGeneralInformationView
                                title={title} setTitle={setTitle}
                                lengthStr={lengthStr} setLengthStr={setLengthStr}
                                expectedTimeStr={expectedTimeStr} setExpectedTimeStr={setExpectedTimeStr}
                                ascentStr={ascentStr} setAscentStr={setAscentStr}
                                difficultyStr={difficultyStr} setDifficultyStr={setDifficultyStr}
                                country={country} setCountry={setCountry}
                                region={region} setRegion={setRegion}
                                province={province} setProvince={setProvince}
                                city={city} setCity={setCity}
                                description={description} setDescription={setDescription} />

                            <Grid item xs={12} sm={12}>
                                <Typography variant="h8" gutterBottom>
                                    START POINT
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <SelectStartEndPoint
                                    mode={SelectStartEndPointMode.START}
                                    pointName={startPointName} setPointName={setStartPointName}
                                    pointAdd={startPointAdd} setPointAdd={setStartPointAdd}
                                    pointLat={startPointLat} setPointLat={setStartPointLat}
                                    pointLon={startPointLon} setPointLon={setStartPointLon}
                                    pointType={startPointType} setPointType={setStartPointType}
                                    hutId={startPointHutId} setHutId={setStartPointHutId}
                                    parkingId={startPointParkingId} setParkingId={setStartPointParkingId}
                                    information={information}
                                />

                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <Typography variant="h8" gutterBottom>
                                    END POINT
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={12}>
                                <SelectStartEndPoint
                                    mode={SelectStartEndPointMode.END}
                                    pointName={endPointName} setPointName={setEndPointName}
                                    pointAdd={endPointAdd} setPointAdd={setEndPointAdd}
                                    pointLat={endPointLat} setPointLat={setEndPointLat}
                                    pointLon={endPointLon} setPointLon={setEndPointLon}
                                    pointType={endPointType} setPointType={setEndPointType}
                                    pointHutId={endPointHutId} setHutId={setEndPointHutId}
                                    parkingId={endPointParkingId} setParkingId={setEndPointParkingId}
                                    information={informationEnd}
                                />
                            </Grid>

                            {
                                listReferencePoint.length &&
                                <>
                                    <Grid item xs={12} sm={12}>
                                        <Typography variant="h8" gutterBottom>
                                            REFERENCE POINTS
                                        </Typography>
                                    </Grid>
                                    {listReferencePoint.map((reference) => {
                                        <RefrenceView reference={reference}
                                            handleEditReferencePoint={handleEditReferencePoint}
                                            handleDeleteReferencePoint={handleDeleteReferencePoint} />
                                    })}

                                </>
                            }
                            {
                                !newReferencePoint &&
                                <Grid item xs={12}>
                                    <Button onClick={handleNewReferencePoint}>
                                        ADD A NEW REFERENCE POINT
                                    </Button>
                                    <h6 xs={{ ml: 8 }}>
                                        Or click on the map
                                    </h6>
                                </Grid>
                            }
                            {
                                newReferencePoint &&
                                <>
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
                                </>
                            }
                        </Grid>
                        {
                            <Stack direction="row" justifyContent="end" sx={{ p: 2 }}>
                                <Button variant="contained" color="success" onClick={handleEdit}>
                                    EDIT HIKE
                                </Button>
                            </Stack>
                        }
                        <Grid sx={{ p: 2, ml: 5, mr: 5 }}>
                            <Paper elevation={5}>
                                <Map 
                                    startPointLat={startPointLat} startPointLon={startPointLon} 
                                    endPointLat={endPointLat} endPointLon={endPointLon} 
                                    positionsState={positionsState} setPuntiDaTrack={setPuntiDaTrack} 
                                    puntiDaTrack={puntiDaTrack} referencePoint={referencePoint} 
                                    setReferencePoint={setReferencePoint} listReferencePoint={listReferencePoint} />
                            </Paper>
                        </Grid>
                    </Grid>
                </Grid>
            }
            {
                show &&
                <Alert variant="outlined" severity="error" onClose={() => {
                    setErrorMessage('');
                    setShow(false)
                }}>{errorMessage}
                </Alert>
            }
        </React.Fragment>
    );
}

function RefrenceView(props) {
    const reference = props.reference;
    return (
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
                <Button edge="end" onClick={() => props.handleEditReferencePoint(reference.name)} >
                    <EditIcon />
                </Button>
            </Grid>

            <Grid item xs={12} sm={1} mt={2}>
                <Button edge="end" onClick={() => props.handleDeleteReferencePoint(reference.name)} >
                    <DeleteIcon />
                </Button>
            </Grid>
        </>
    )
}


export { EditHikePage }




