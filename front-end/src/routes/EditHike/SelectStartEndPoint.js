import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import API from '../../API/API';

function SelectStartEndPoint(props) {

    let label;
    switch(props.mode) {
        case SelectStartEndPointMode.START: {
            label = "Start Point"
            break;
        }
        case SelectStartEndPointMode.END: {
            label = "End Point"
            break;
        }
    }

    return <>
        <FormControl fullWidth required>
            <InputLabel id="demo-simple-select-label">{label}</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-seimple-select"
                value={props.pointType}
                fullWidth
                name="pointType"
                variant="standard"
                label="pointType"
                onChange={ev => 
                    props.setPointType(ev.target.value)
                }>
                <MenuItem value={SelectStartEndPointType.COORDINATES} >
                    GPS coordinates as {label}
                </MenuItem>
                <MenuItem value={SelectStartEndPointType.PARKING}>
                    Choose a Parking Lot as {label}
                </MenuItem>
                <MenuItem value={SelectStartEndPointType.HUT}>
                    Choose an Hut as {label}
                </MenuItem>
            </Select>
        </FormControl>
        {
            props.pointType === SelectStartEndPointType.COORDINATES && 
            <Coordinates {...props} />
        }
        {
            props.pointType === SelectStartEndPointType.PARKING && 
            <Parking {...props } />
        }
        {
            props.pointType === SelectStartEndPointType.HUT && 
            <Hut {...props} />
        }
    </>
}

function Coordinates(props) {
    return <>
        <Grid item xs={12} sm={6}>
            <TextField
                required id="pointName"
                name="pointName" label="Name"
                fullWidth autoComplete="pointName"
                variant="standard" type="text"
                value={props.pointName}
                onChange={(e) => props.setPointName(e.target.value)}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                id="pointAdd"
                name="pointAdd" label="Point Address"
                fullWidth autoComplete="pointAdd" variant="standard"
                value={props.pointAdd}
                onChange={(e) => props.setPointAdd(e.target.value)}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                required
                name="pointLat"
                label="Point Latitude"
                variant="standard"
                type="text"
                fullWidth
                value={props.pointLat}
                onChange={(e) => props.setPointLat(e.target.value)}
            />
        </Grid>
        <Grid item xs={12} sm={6}>
            <TextField
                required
                name="pointLon"
                label="Point Longitude"
                fullWidth
                variant="standard"
                min={0}
                value={props.pointLon}
                onChange={(e) => props.setPointLon(e.target.value)}
            />
        </Grid>
    </>
}

function Hut(props) {

    const [listHuts, setListHuts] = useState([]);

    useEffect(() => {
        let radiusPoint= {
            lon: parseFloat(props.pointLon), 
            lat: parseFloat(props.pointLat), 
            radiusKms: parkingAndHutDiscoveryRadius
        }
        const getHutsPlot = async () => {
            return await API.getListOfHutsAndParkingLots(radiusPoint);
        }
        getHutsPlot().then((parkigsAndHuts) => {
            setListHuts(parkigsAndHuts.huts);
        });
    }, [])

    useEffect(() => {
        if (props.hutId !== null && props.hutId !== '') {
            let element = listHuts.filter((hut) => hut.id === props.hutId);
            //todo: set address field
        }

    }, [props.hutId])

    return <>
        <FormControl fullWidth required sx={{ mt: 3 }}>
            <InputLabel id="demo-simple-select-label">Choose an hut</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-seimple-select"
                value={props.hutId}
                fullWidth
                name="hutId"
                variant="standard"
                label="Hut"
                onChange={ev => props.setHutId(ev.target.value)}>
                {
                    listHuts.map((hutItem) => {
                        return <HutItemView hut={hutItem}/>
                    })
                }
            </Select>
        </FormControl>
    </>
}

function Parking(props) {

    const [listParking, setListParking] = useState([]);

    useEffect(() => {
        let radiusPoint= {
            lon: parseFloat(props.pointLon), 
            lat: parseFloat(props.pointLat), 
            radiusKms:parkingAndHutDiscoveryRadius
        }
        const getHutsPlot = async () => {
            return await API.getListOfHutsAndParkingLots(radiusPoint);
        }
        getHutsPlot().then((parkingsAndHuts) => {
            setListParking(parkingsAndHuts.parkingLots);
        });
    }, [])

    useEffect(() => {
        if (props.parkingId !== null && props.parkingId !== '') {
            let element = listParking.filter((el) => el.id === props.parkingId);
            //todo: set address field
        }
    }, [props.parkingId])

    return (
        <FormControl fullWidth required sx={{ mt: 3 }}>
            <InputLabel id="demo-simple-select-label">Choose a parking lot</InputLabel>
            <Select
                labelId="demo-simple-select-label"
                id="demo-seimple-select"
                value={props.parkingId}
                fullWidth
                name="parkingId"
                variant="standard"
                label="Parking"
                onChange={ev => props.setParkingId(ev.target.value)}>
                {
                    listParking.map((parking) => {
                        return <ParkingItemView parking={parking}/>
                    })
                }
            </Select>
        </FormControl>
    )
}

function HutItemView(props) {
    return (
        <MenuItem value={props.hut.id} >
            <Grid item xs={12} sm={6}>
                <TextField
                    name="hutName"
                    label="Hut name"
                    fullWidth
                    disabled
                    variant="standard"
                    value={props.hut.title}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    name="coordinates"
                    label="Coordinates"
                    fullWidth
                    disabled
                    variant="standard"
                    value={props.hut.point.position.coordinates}
                />
            </Grid>
            <Grid item xs={12} sm={6}>
                <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    disabled
                    variant="standard"
                    value={props.hut.point.address}
                />
            </Grid>
        </MenuItem>
    )
}

function ParkingItemView(props) {
    return (
        <MenuItem value={props.parking?.id} >
            <Grid item xs={12} sm={3}>
                <TextField
                    name="parkingName"
                    label="Parking name"
                    fullWidth
                    disabled
                    variant="standard"
                    value={props.parking?.point.name}
                />
            </Grid>
            <Grid item xs={12} sm={3}>
                <TextField
                    name="spots"
                    label="Spots"
                    fullWidth
                    disabled
                    variant="standard"
                    value={props.parking?.maxCars}
                />
            </Grid>

            <Grid item xs={12} sm={3}>
                <TextField
                    name="address"
                    label="Address"
                    fullWidth
                    disabled
                    variant="standard"
                    value={props.parking.point.address}
                />
            </Grid>
        </MenuItem>
    )
}

const parkingAndHutDiscoveryRadius = 400;

export const SelectStartEndPointMode = {
    START : 0,
    END : 1
}

export const SelectStartEndPointType = {
    COORDINATES : 0,
    PARKING : 1,
    HUT : 2
}

export { SelectStartEndPoint }