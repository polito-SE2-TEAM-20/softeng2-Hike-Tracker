import { useMatch } from "react-router-dom";
import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Button, Card, CardContent, CircularProgress } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Stack from "@mui/material/Stack";
import { Paper } from '@mui/material';
import Alert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import API from "../../API/API";
import { HikeGeneralInformationView } from "./HikeGeneralInformationView";
import { SelectStartEndPoint, SelectStartEndPointMode, SelectStartEndPointType } from "./SelectStartEndPoint";
import { getInformation } from "../../lib/common/Address";
import { Map } from "./Map";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import { PopupEditHike } from "./PopupEditHike";
import { ErrorDialog } from "../../components/ErrorDialog/ErrorDialog";
import { UserRoles } from '../../lib/common/UserRoles'

import { useNavigate } from 'react-router';


function EditHikePage(props) {

    const match = useMatch('/edithike/:hikeid')
    const hikeId = match.params.hikeid ? match.params.hikeid : -1;

    const [hasErrorOnLoad, setHasErrorOnLoad] = useState(false);
    const [errorOnLoad, SetErrorOnLoad] = useState(null);

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

    const [startPointType, setStartPointType] = useState('');
    const [startPointLon, setStartPointLon] = useState('');
    const [startPointLat, setStartPointLat] = useState('');
    const [startPointName, setStartPointName] = useState('Start Point');
    const [startPointAdd, setStartPointAdd] = useState('');
    const [startPointHut, setStartPointHut] = useState(null);
    const [startPointParking, setStartPointParking] = useState(null);

    //End point params
    const [endPointLatGpx, setEndPointLatGpx] = useState('');
    const [endPointLonGpx, setEndPointLonGpx] = useState('');
    const [endPointNameGpx, setEndPointNameGpx] = useState('End Point');
    const [endPointAddGpx, setEndPointAddGpx] = useState('');

    const [endPointType, setEndPointType] = useState('');
    const [endPointLat, setEndPointLat] = useState('');
    const [endPointLon, setEndPointLon] = useState('');
    const [endPointName, setEndPointName] = useState('End Point');
    const [endPointAdd, setEndPointAdd] = useState('');
    const [endPointHut, setEndPointHut] = useState(null);
    const [endPointParking, setEndPointParking] = useState(null);

    //Hut connection vars
    const [nearHuts, setNearHuts] = useState([])
    const [connectedHuts, setConnectedHuts] = useState([])

    const [newReferencePoint, setNewReferencePoint] = useState(false);
    const [listReferencePoint, setListReferencePoint] = useState([]);
    const [referencePoint, setReferencePoint] = useState([]);
    const [referencePointLat, setReferencePointLat] = useState('');
    const [referencePointLon, setReferencePointLon] = useState('');
    const [referencePointName, setReferencePointName] = useState('');
    const [referencePointAdd, setReferencePointAdd] = useState('');
    const [referencePointEle, setReferencePointEle] = useState('');


    // states for the popup after adding a new hike
    const [open, setOpen] = useState(false);
    const [err, setErr] = useState(null);

    //Get hike deatils with gpx file
    const getHikeAndGpxFile = async () => {
        setLoading(true);

        const details = await API.getSingleHikeByID(hikeId);
        if (details) {

            const gpxFile = await API.getPathByID(details.gpxPath)

            if (gpxFile) {
                setFileContents(gpxFile)
                setHikeDetails(details);
                setLoading(false);
            } else {
                setLoading(false)
                setHasErrorOnLoad(true);
                SetErrorOnLoad("Failed to get hike details. Please try again.")
            }
        } else {
            setLoading(false)
            setHasErrorOnLoad(true);
            SetErrorOnLoad("Failed to get hike details. Please try again.")
        }
    }

    useEffect(() => { 
        getHikeAndGpxFile();
    }, [])

    //Update fields based on hike details
    useEffect(() => {
        if (hikeDetails && fileContents) {
            fillPreDefinedHikeDetails()
        }
    }, [hikeDetails, fileContents])

    //TODO
    useEffect(() => {
        if (referencePoint.length !== 0 && referencePoint !== null && referencePoint != '' && referencePoint != {} && referencePoint !== undefined) {
            setNewReferencePoint(true);
            setReferencePointLat(referencePoint.lat);
            setReferencePointLon(referencePoint.lon);
            setReferencePointEle(referencePoint.altitude);

        }
    }, [referencePoint])


    //TODO
    // useEffect(() => {
    //     if (fileContents) {
    //         let gpxParser = require('gpxparser');
    //         var gpx = new gpxParser();
    //         gpx.parse(fileContents);
    //         const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
    //         console.log(gpx);
    //         // controllare perchè se non ci sono i punti da errore
    //         {/*} const waypoints = gpx.waypoints.map(reference => [reference.name, reference.desc, reference.lat, reference.lon])

    //         // get all the waypoints from the gpx file, insert them if they are on the track
    //         // and give them a name if they don't have one in the gpx file
    //         let i = 1;
    //         let prova = [];
    //         waypoints.forEach(el => {

    //             let indexOfObject = positionsState.filter(object => (object[0] === el[2] && object[1] === el[3]))
    //             if (indexOfObject.length !== 0) {
    //                 if (el.name === '' || el.name === null || el.name === undefined) {
    //                     prova = [...prova, { name: i, address: el[1], lat: el[2], lon: el[3] }];
    //                     i++;
    //                 } else {
    //                     prova = [...prova, { name: el[0], address: el[1], lat: el[2], lon: el[3] }];
    //                 }
    //             }
    //             // controllare che due waypoints non abbiano lo stesso nome
    //             setListReferencePoint(prova);
    //         })

    //         //set List reference point con i waypoints se presenti nel gpx file
    //         setReferencePoint([]);
    //     */}
    //         setPositionsState(positions);

    //         getInformation(positions[0][0], positions[0][1])
    //             .then(informations => {
    //                 setStartPointLatGpx(positions[0][0])
    //                 setStartPointLonGpx(positions[0][1])
    //                 setStartPointNameGpx(informations.name)
    //                 setStartPointAddGpx(informations.display_name)
    //             })

    //         getInformation(positions[positions.length - 1][0], positions[positions.length - 1][1])
    //             .then(informations => {
    //                 setEndPointLatGpx(positions[positions.length - 1][0])
    //                 setEndPointLonGpx(positions[positions.length - 1][1])
    //                 setEndPointNameGpx(informations.name)
    //                 setEndPointAddGpx(informations.display_name)
    //             })

            
    //     }
    // }, [fileContents]);


    function toHoursAndMinutes(totalMinutes) {
        const minutes = totalMinutes % 60;
        const hours = Math.floor(totalMinutes / 60);

        return `${padTo2Digits(hours)}:${padTo2Digits(minutes)}`;
    }

    function padTo2Digits(num) {
        return num.toString().padStart(2, '0');
    }

    const fillPreDefinedHikeDetails = async () => {
        if (hikeDetails && fileContents) {
        
            //#region GPX parsing
            let gpxParser = require('gpxparser');
            var gpx = new gpxParser();
            gpx.parse(fileContents);
            const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon, p.ele]);

            setPositionsState(positions);

            let startLatGpx, startLonGpx, startNameGpx, startAddGpx;
            let endLatGpx, endLonGpx, endtNameGpx, endAddGpx;

            await getInformation(positions[0][0], positions[0][1])
                .then(informations => {
                    startLatGpx = positions[0][0]
                    startLonGpx = positions[0][1]
                    startNameGpx = informations.name
                    startAddGpx = informations.display_name;
                })

            await getInformation(positions[positions.length - 1][0], positions[positions.length - 1][1])
                .then(informations => {
                    endLatGpx = positions[positions.length - 1][0]
                    endLonGpx = positions[positions.length - 1][1]
                    endtNameGpx = informations.name
                    endAddGpx = informations.display_name
                })
            //#endregion

            setTitle(hikeDetails.title)
            setLengthStr(hikeDetails.length)
            setAscentStr(hikeDetails.ascent)
            // expected time reformat in hh:mm not just minutes
            let time = toHoursAndMinutes(hikeDetails.expectedTime);
            console.log(time);
            setExpectedTimeStr(time);

            setDifficultyStr(hikeDetails.difficulty);
            setCountry(hikeDetails.country)
            setRegion(hikeDetails.region)
            setProvince(hikeDetails.province)
            setCity(hikeDetails.city)
            setDescription(hikeDetails.description)

            if (hikeDetails.linkedPoints !== null &&
                hikeDetails.linkedPoints !== undefined) {
                setConnectedHuts(
                    hikeDetails.linkedPoints.filter((item) => {
                        return item.type === "hut"
                    }).map((item) => {
                        return item.entity
                    })
                )
            } else {
                setConnectedHuts([])
            }


            if (hikeDetails.referencePoints !== null && hikeDetails.referencePoints !== undefined) {
                console.log(hikeDetails.referencePoints)
                let list = []
                hikeDetails.referencePoints.forEach((item) => {
                    console.log(item);
                    list.push({ name: item.name, address: item.address, lat: item.position.coordinates[1], lon: item.position.coordinates[0], altitude: item.altitude })
                    console.log(listReferencePoint)
                })
                setListReferencePoint(list)


            } else {
                setListReferencePoint([])
            }

            let startLonHut, startLatHut;
            let endLonHut, endLatHut;

            if (hikeDetails.startPoint) {
                const startPoint = hikeDetails.startPoint;
                switch (startPoint.type) {
                    case "point": {
                        setStartPointType(SelectStartEndPointType.COORDINATES);
                        setStartPointLon(startPoint.point?.position?.coordinates[0])
                        setStartPointLat(startPoint.point?.position?.coordinates[1])
                        setStartPointName(startPoint.point?.name)
                        setStartPointAdd(startPoint.point?.address)
                        setStartPointHut(null)
                        setStartPointParking(null)
                        startLonHut = startPoint.point?.position?.coordinates[0]
                        startLatHut = startPoint.point?.position?.coordinates[1]
                        break;
                    }
                    case "parkingLot": {
                        setStartPointLon(startPoint.entity?.point?.position?.coordinates[0])
                        setStartPointLat(startPoint.entity?.point?.position?.coordinates[1])
                        setStartPointType(SelectStartEndPointType.PARKING)
                        setStartPointParking(startPoint.entity)
                        setStartPointHut(null)
                        startLonHut = startPoint.entity?.point?.position?.coordinates[0]
                        startLatHut = startPoint.entity?.point.position?.coordinates[1]
                        break;
                    }
                    case "hut": {
                        setStartPointLon(startPoint.entity?.point?.position?.coordinates[0])
                        setStartPointLat(startPoint.entity?.point?.position?.coordinates[1])
                        setStartPointType(SelectStartEndPointType.HUT)
                        setStartPointHut(startPoint.entity)
                        setStartPointParking(null)
                        startLonHut = startPoint.entity?.point?.position?.coordinates[0]
                        startLatHut = startPoint.entity?.point?.position?.coordinates[1]
                        break;
                    }
                }
            } else {
                setStartPointType(SelectStartEndPointType.COORDINATES);
                setStartPointLon(startLonGpx)
                setStartPointLat(startLatGpx)
                setStartPointName(startNameGpx)
                setStartPointAdd(startAddGpx)
                setStartPointHut(null)
                setStartPointParking(null)
                startLonHut = startLonGpx
                startLatHut = startLatGpx
            }

            if (hikeDetails.endPoint) {
                const endPoint = hikeDetails.endPoint;
                switch (endPoint.type) {
                    case "point": {
                        setEndPointType(SelectStartEndPointType.COORDINATES);
                        setEndPointLon(endPoint.point?.position?.coordinates[0])
                        setEndPointLat(endPoint.point?.position?.coordinates[1])
                        setEndPointName(endPoint.point?.name)
                        setEndPointAdd(endPoint.point?.address)
                        endLonHut = endPoint.point?.position?.coordinates[0]
                        endLatHut = endPoint.point?.position?.coordinates[1]
                        break;
                    }
                    case "parkingLot": {
                        setEndPointLon(endPoint.entity?.point?.position?.coordinates[0])
                        setEndPointLat(endPoint.entity?.point?.position?.coordinates[1])
                        setEndPointType(SelectStartEndPointType.PARKING)
                        setEndPointParking(endPoint.entity)
                        setEndPointHut(null)
                        endLonHut = endPoint.entity?.point?.position?.coordinates[0]
                        endLatHut = endPoint.entity?.point?.position?.coordinates[1]
                        break;
                    }
                    case "hut": {
                        setEndPointLon(endPoint.entity?.point?.position?.coordinates[0])
                        setEndPointLat(endPoint.entity?.point?.position?.coordinates[1])
                        setEndPointType(SelectStartEndPointType.HUT)
                        setEndPointHut(endPoint.entity)
                        setEndPointParking(null)
                        endLonHut = endPoint.entity?.point?.position?.coordinates[0]
                        endLatHut = endPoint.entity?.point?.position?.coordinates[1]
                        break;
                    }
                }
            } else {
                setEndPointType(SelectStartEndPointType.COORDINATES);
                setEndPointLon(endLonGpx)
                setEndPointLat(endLatGpx)
                setEndPointName(endtNameGpx)
                setEndPointAdd(endAddGpx)
                setEndPointHut(null)
                setEndPointParking(null)
                endLonHut = endLonGpx
                endLatHut = endLatGpx
            }

            getNearHuts(
                startLonHut,
                startLatHut
            )
            getNearHuts(
                endLonHut,
                endLatHut
            )
        }
    }


    // the radius should be 5
    const nearHutDiscoveryRadius = 5;
    const getNearHuts = (lon, lat) => {
        let radiusPoint = {
            lon: parseFloat(lon),
            lat: parseFloat(lat),
            radiusKms: nearHutDiscoveryRadius
        }
        API.getListOfHutsAndParkingLots(radiusPoint)
            .then((parkigsAndHuts) => {
                setNearHuts((oldHuts) => {
                    if (oldHuts === null || oldHuts === undefined) {
                        return parkigsAndHuts.huts
                    } else {
                        return oldHuts.concat(parkigsAndHuts.huts.filter((item) => {
                            let index = -1;
                            for (let i = 0; i < oldHuts.length; i++) {
                                if (oldHuts[i].id === item.id) {
                                    index = i;
                                }
                            }
                            return index === -1
                        }))
                    }
                })
            });
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
        setReferencePointEle(listReferencePoint.filter(el => el.name === elemento.name)[0].altitude);

        setNewReferencePoint(true)

        const prova = listReferencePoint.splice(indexOfObject, 1);
        setListReferencePoint(listReferencePoint.filter(el => el.name !== prova.name));
    }
    useEffect(() => {
        if (referencePointLat !== '' && referencePointLon !== '' && referencePointLat !== null && referencePointLon !== null && referencePoint !== undefined) {
          setNewReferencePoint(true);
          setReferencePointLat(referencePoint.lat);
          setReferencePointLon(referencePoint.lon);
          setReferencePointEle(referencePoint.altitude);
    
        }
      }, [referencePoint])

    //TODO
    const handleListreferencePoints = (event) => {
        const indexOfReference = listReferencePoint.filter(object => (object.lat === parseFloat(referencePointLat) && object.lon === parseFloat(referencePointLon)));
        let prova = false;
        //let objTagliatoLat = (object[0].toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])
        //let objTagliatoLon = (object[1].toString().match(/^-?\d+(?:\.\d{0,6})?/)[0])
        console.log(referencePointLat);
        console.log(referencePointLon);
        console.log(positionsState);
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
            let stringaNome = referencePointName.toString();
            setListReferencePoint([...listReferencePoint, { name: stringaNome, address: referencePointAdd, lat: referencePointLat, lon: referencePointLon, altitude: parseFloat(referencePointEle) }]);
            setNewReferencePoint(false);
            setReferencePoint([]);
            setReferencePointLat('');
            setReferencePointLon('');
            setReferencePointAdd('');
            setReferencePointName('');
            setReferencePointEle('');


        }
    }

    const isStartingPointIsNull = () => {

        switch(startPointType) {
            case SelectStartEndPointType.COORDINATES: {
                return !((startPointLat !== null && startPointLat.toString().trim().length > 0) &&
                    (startPointLon !== null && startPointLon.toString().trim().length > 0) &&
                    (startPointName !== null && startPointName.toString().length > 0) &&
                    (startPointAdd !== null && startPointAdd.toString().length > 0))
            }
            case SelectStartEndPointType.PARKING: {
                return startPointParking === null
            }
            case SelectStartEndPointType.HUT: {
                return startPointHut === null
            }
        }
    }

    const isEndingPointIsNull = () => {
        switch(endPointType) {
            case SelectStartEndPointType.COORDINATES: {
                return !((endPointLat !== null && endPointLat.toString().trim().length > 0) &&
                    (endPointLon !== null && endPointLon.toString().trim() > 0) &&
                    (endPointName !== null && endPointName.toString().length > 0) &&
                    (endPointAdd !== null && endPointAdd.toString().length > 0))
            }
            case SelectStartEndPointType.PARKING: {
                return endPointParking === null
            }
            case SelectStartEndPointType.HUT: {
                return endPointHut === null
            }
        }
    }

    const handleEdit = (event) => {
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
        } else if (expectedTimeStr === null || expectedTimeStr === '' || expectedTimeStr === undefined || expectedTimeStr == 0) {
            setErrorMessage('The time expected for the hike cannot be empty')
            setShow(true);
        } else if (!expectedTimeStr.match(/^(([0-1]{0,1}[0-9])|(2[0-3])):[0-5]{0,1}[0-9]$/)) {
            setErrorMessage('The time expected for the hike has to be in the format hh:mm e.g 12:30, 20:30')
            setShow(true);
        } else if (ascentStr === '' || ascentStr === null || ascentStr === undefined) {
            setErrorMessage('The ascent for the hike cannot be empty');
            setShow(true);
        } else if (difficultyStr == '' || difficultyStr === null || difficultyStr === undefined) {
            setErrorMessage('Choose a difficulty for this hike');
             setShow(true);
        } else if (description === '' || description === null || description === undefined) {
            setErrorMessage('The description for the hike cannot be empty');
            setShow(true);
        } else if (description.trim().length === 0) {
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
        } else if (isStartingPointIsNull()){
            setErrorMessage('Starting point should be provided.');
            setShow(true);
        } else if (isEndingPointIsNull()){
            setErrorMessage('Ending point should be provided.');
            setShow(true);
        } else {
            let start = {};
            let end = {};
            switch (startPointType) {
                case SelectStartEndPointType.COORDINATES: {
                    start = {
                        name: startPointName,
                        address: startPointAdd,
                        lat: startPointLat,
                        lon: startPointLon
                    };
                    break;
                }
                case SelectStartEndPointType.PARKING: {
                    if (startPointParking !== null) {
                        start = {
                            parkingLotId: startPointParking.id
                        };
                    }
                    break;
                }
                case SelectStartEndPointType.HUT: {
                    if (startPointHut !== null) {
                        start = {
                            hutId: startPointHut.id
                        };
                    }
                    break;
                }
            }

            switch (endPointType) {
                case SelectStartEndPointType.COORDINATES: {
                    end = {
                        name: endPointName,
                        address: endPointAdd,
                        lat: endPointLat,
                        lon: endPointLon
                    };
                    break;
                }
                case SelectStartEndPointType.PARKING: {
                    if (endPointParking !== null) {
                        end = {
                            parkingLotId: endPointParking.id
                        };
                    }
                    break;
                }
                case SelectStartEndPointType.HUT: {
                    if (endPointHut !== null) {
                        end = {
                            hutId: endPointHut.id
                        };
                    }
                    break;
                }
            }

            let a = expectedTimeStr.split(':'); // split it at the colons
            let minutes = parseInt(a[0]) * 60 + parseInt(a[1]);
            const expectedTime = parseInt(minutes);
            const length = parseFloat(lengthStr);
            const ascent = parseFloat(ascentStr);
            const difficulty = parseFloat(difficultyStr);
            API.editHikeStartEndPoint(hikeId, start, end, listReferencePoint, title, description, length, expectedTime, ascent, difficulty)
                .then((startEndPointEditResult) => {
                    API.linkPointsToHike(hikeId, connectedHuts, [])
                        .then((linkHutResult) => {
                            setOpen(true);
                            setErr(null)
                        })
                        .catch((err) => {
                            setOpen(true);
                            setErr(err)
                        });
                })
                .catch((err) => {
                    setOpen(true);
                    setErr("Failed to update your hike")
                });
                //check the popup message for the error at the end

            // setFileContents(null);
            // setTitle(''); setLengthStr(''); setAscentStr(''); setExpectedTimeStr('');
            // setDifficultyStr(0); setCountry(''); setRegion('');
            // setProvince(''); setCity(''); setDescription(''); setPositionsState([]); setErrorMessage(''); setShow('');
            // setPuntiDaTrack([]); setInformation(''); setStartPointLon('');
            // setStartPointLat(''); setStartPointName('Start Point'); setStartPointAdd('');
            // setEndPointLat('');
            // setEndPointLon('');
            // setEndPointName('End Point');
            // setEndPointAdd('');
            // setNewReferencePoint(false);
            // setListReferencePoint([]); setReferencePoint([]); setReferencePointLat(' '); setReferencePointLon(' ');
            // setReferencePointName(''); setReferencePointAdd('');

        }
    }

    const handleDeleteHutFromConnectedList = (hut) => {
        setConnectedHuts(oldList => {
            return oldList.filter((item) => item.id !== hut.id)
        })
    }

    const handleAddHutToConnectedList = (hut) => {
        setConnectedHuts(oldList => {
            if (!oldList.includes(hut)) {
                return oldList.concat(hut)
            }
        })
    }
    const navigate = useNavigate();

    if (
        props.user?.role !== UserRoles.LOCAL_GUIDE) {
        navigate('/unauthorized')
      }

    return (
        <React.Fragment>
            {
                <PopupEditHike id={hikeId} err={err} open={open} setOpen={setOpen} />
            }
            {
                loading &&
                <Grid
                    container
                    direction="column"
                    justifyContent="center"
                    alignItems="center">
                    <Grid item>
                        <CircularProgress />
                    </Grid>
                </Grid>
            }
            {
                hasErrorOnLoad &&
                <ErrorDialog
                    isOpen={hasErrorOnLoad}
                    message={errorOnLoad}
                    buttonText="Try Again"
                    closeAction={() => {
                        setHasErrorOnLoad(false)
                        SetErrorOnLoad(null)
                        getHikeAndGpxFile()
                    }}>

                </ErrorDialog>
            }
            {
                (!loading && hikeDetails) &&
                <Grid>
                    <Typography fontFamily="Bakbak One, display" fontWeight="700" variant="h4" gutterBottom sx={{ p: 2, ml:5, mr:5 }} mt={14}>
                        EDIT YOUR HIKE
                    </Typography>
                    <Grid sx={{ml:5, mr:5}}>
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
<Grid item xs={12} sm={6}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h8" gutterBottom>
                                    START POINT
                                </Typography>
                            </Grid>
                            
                                <SelectStartEndPoint
                                    mode={SelectStartEndPointMode.START}
                                    pointName={startPointName} setPointName={setStartPointName}
                                    pointAdd={startPointAdd} setPointAdd={setStartPointAdd}
                                    pointLat={startPointLat} setPointLat={setStartPointLat}
                                    pointLon={startPointLon} setPointLon={setStartPointLon}
                                    pointType={startPointType} setPointType={setStartPointType}
                                    hut={startPointHut} setHut={setStartPointHut}
                                    parking={startPointParking} setParking={setStartPointParking}
                                />

                            </Grid>
                            <Grid item xs={12} sm={6}>
                            <Grid item xs={12} sm={6}>
                                <Typography variant="h8" gutterBottom>
                                    END POINT
                                </Typography>
                            </Grid>
                            
                                <SelectStartEndPoint
                                    mode={SelectStartEndPointMode.END}
                                    pointName={endPointName} setPointName={setEndPointName}
                                    pointAdd={endPointAdd} setPointAdd={setEndPointAdd}
                                    pointLat={endPointLat} setPointLat={setEndPointLat}
                                    pointLon={endPointLon} setPointLon={setEndPointLon}
                                    pointType={endPointType} setPointType={setEndPointType}
                                    hut={endPointHut} setHut={setEndPointHut}
                                    parking={endPointParking} setParking={setEndPointParking}
                                />
                            </Grid>

                            {
                                nearHuts.length > 0 &&
                                <ConnectedHuts
                                    hutList={nearHuts}
                                    connectedHutList={connectedHuts}
                                    deleteHutAction={handleDeleteHutFromConnectedList}
                                    addHutAction={handleAddHutToConnectedList}>

                                </ConnectedHuts>
                            }

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
                                                        <Grid item xs={12} sm={2}>
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
                                  <TextField
                                    name="referencePointElevation"
                                    label="Reference Point Elevation"
                                    fullWidth
                                    autoComplete="referencePointElevation"
                                    variant="standard"
                                    //disabled
                                    value={reference.altitude}
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
                                            <Grid item xs={12}>
                                                <Button onClick={handleNewReferencePoint}>ADD A NEW REFERENCE POINT</Button>
                                                <h6 xs={{ ml: 8 }}>Or click on the map</h6>
                                            </Grid>
                                        </>
                                    )
                                    :
                                    (<>
                                        <Grid item xs={12} sm={2}>
                                            <TextField
                                                required
                                                id="referencePointName" name="referencePointName"
                                                label="Reference Point Name" fullWidth
                                                autoComplete="referencePointName" variant="standard"
                                                value={referencePointName}
                                                onChange={(e) => setReferencePointName(e.target.value)}
                                            />
                                        </Grid>

                                        <Grid item xs={12} sm={2}>
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
                            id="referencePointEle"
                            name="referencePointEle" label="Reference Point Ele"
                            fullWidth autoComplete="referencePointEle" variant="standard"
                            placeholder='1230'
                            //disabled
                            value={referencePointEle}
                            //onChange={(e) => setReferencePointEle(e.target.value)}
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
                        {
                            <Stack direction="row" justifyContent="end" sx={{ p: 2 }}>
                                <Button variant="contained" color="success" onClick={handleEdit}>
                                    EDIT HIKE
                                </Button>
                            </Stack>
                        }
                        {
                show &&
                <Alert variant="outlined" severity="error" onClose={() => {
                    setErrorMessage('');
                    setShow(false)
                }}>{errorMessage}
                </Alert>
            }
                        <Grid sx={{ p: 2 }}>
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
            
        </React.Fragment>
    );
}

function ConnectedHuts(props) {

    return (
        <Card
            style={{
                marginRight: 24, marginLeft: 24, marginTop: 32, marginBottom: 24,
                width: "100%",
                justifyContent: "center"
            }}>
            <CardContent>
                <Grid
                    item>
                    <Typography variant="h6" gutterBottom>
                        Connected Huts
                    </Typography>
                </Grid>
                <Grid container>
                    {
                        props.connectedHutList.length > 0 &&
                        props.connectedHutList.map((hutItem) => {
                            return (
                                <Grid item >
                                    <HutItemView
                                        type={LinkHutItemViewTye.ADDED}
                                        hut={hutItem}
                                        deleteHutAction={props.deleteHutAction}
                                        addHutAction={props.addHutAction}>
                                    </HutItemView>
                                </Grid>
                            )
                        })
                    }
                </Grid>

                <Grid
                    item
                    style={{ marginTop: 32 }}>
                    <Typography variant="h6" gutterBottom>
                        Huts close to hike (can be connected to your hike)
                    </Typography>
                </Grid>
                <Grid
                    container>
                    {
                        props.hutList.length > 0 &&
                        props.hutList.filter((item) => {
                            if (props.connectedHutList.length > 0) {
                                let index = -1
                                for (let i = 0; i < props.connectedHutList.length; i++) {
                                    if (item.id === props.connectedHutList[i].id) {
                                        index = i
                                    }
                                }
                                return index === -1
                            } else {
                                return true
                            }
                        }).map((hutItem) => {
                            return (
                                <Grid item>
                                    <HutItemView
                                        type={LinkHutItemViewTye.AVAILABLE}
                                        hut={hutItem}
                                        deleteHutAction={props.deleteHutAction}
                                        addHutAction={props.addHutAction}>
                                    </HutItemView>
                                </Grid>
                            )
                        })
                    }
                </Grid>
            </CardContent>
        </Card>
    )
}
const LinkHutItemViewTye = {
    ADDED: 0,
    AVAILABLE: 1,
}
function HutItemView(props) {
    return (
        <Card
            style={{
                marginTop: 12, marginBotom: 12, marginRight: 8, marginLeft: 8,
                width: 320
            }}>
            <CardContent>
                <Typography variant="h6">
                    {props.hut.title}
                </Typography>
                <Typography variant="subtitle1">
                    {props.hut.point.address}
                </Typography>
                {
                    props.type === LinkHutItemViewTye.ADDED &&
                    <DeleteIcon
                        color="#1a1a1a"
                        onClick={() => { props.deleteHutAction(props.hut) }}>

                    </DeleteIcon>
                }
                {
                    props.type === LinkHutItemViewTye.AVAILABLE &&
                    <Button
                        variant="contained"
                        color="success"
                        onClick={() => { props.addHutAction(props.hut) }}>
                        ADD
                    </Button>
                }

            </CardContent>
        </Card>
    )
}
{/*}
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
}*/}

export { EditHikePage }

