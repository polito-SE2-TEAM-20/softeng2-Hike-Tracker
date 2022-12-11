import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, Slide, Stack, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { MapContainer, Marker, Polyline, TileLayer, useMap } from "react-leaflet";
import { useMatch } from "react-router";
import API from "../../API/API";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import { TrackingState } from "../../lib/common/Hike";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';
import { icon, Icon } from "leaflet";
import currentLocationIcon from '../../Assets/current-location.png'

function TrackingHikePage(props) {

    const match = useMatch('/trackhike/:hikeid')
    const hikeId = match.params.hikeid ? match.params.hikeid : -1;

    const [recordedGpsLocations, setRecordedGpsLocations] = useState([]);
    const [trackingState, setTrackingState] = useState(TrackingState.NOT_STARTED);
    const [trackHasBeenStarted, setTrackHasBeenStarted] = useState(false);
    const [trackHasBeenRecorded, setTrackHasBeenRecorded] = useState(false);
    const [trackRecordId, setTrackRecordId] = useState(null);
    const [trackHasBeenFinished, setTrackHasBeenFinished] = useState(false);
    const [trackHikeId, setTrackHikeId] = useState(-1);

    const [showTurnOnLocatonDialog, setShowTurnOnLocationDialog] = useState(false);
    const [isLocationAccessable, setIsLocationAccessable] = useState(false);

    const checkLocationAccess = () => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLocationAccessable(true)
            }, (err) => {
                setIsLocationAccessable(false)
                setShowTurnOnLocationDialog(true)
            }
        )
    }

    useEffect(() => {
        checkLocationAccess()
    }, [])

    useEffect(() => {

        switch(trackingState) {
            case TrackingState.STARTED: {
                if (!trackHasBeenRecorded) {
                    setTrackHasBeenRecorded(true);
                    setTrackRecordId(navigator.geolocation.watchPosition((position) => {
                        setRecordedGpsLocations((oldList) => {
                            return oldList.concat(position)
                        })
                        API.addPointToTracingkHike(
                            trackHikeId, 
                            position.coords.latitude, 
                            position.coords.longitude
                        ).then((result) => {

                        })
                        .catch((err) => {

                        })
                    }))
                } else {
                    //Already in recording phase
                }
                break;
            }
            case TrackingState.FINISHED: {
                navigator.geolocation.clearWatch(trackRecordId)
                break;
            }

        }
        
    }, [trackingState])

    const startTrackingAction = () => {
        if (isLocationAccessable) {
            if (!trackHasBeenStarted) {
                API.startTracingkHike(hikeId)
                    .then((result) => {
                        setTrackHikeId(result.id);
                        setTrackHasBeenStarted(true)
                        setTrackingState(TrackingState.STARTED)
                    })
                    .catch((error) => {

                    })
            } else {
                //Tracking is already started
            }
        } else {
            checkLocationAccess();
        }
    }

    const stopTrackingAction = () => {
        if (!trackHasBeenFinished) {
            API.stopTrackingHike(trackHikeId)
                .then((result) => {
                    setTrackHasBeenFinished(true)
                    setTrackingState(TrackingState.FINISHED)
                })
                .catch((error) => {
                    
                })
        } else {
            //Track is already finished
        }
    }

    return (
        <>
            <HTNavbar item user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} />

            <Grid
                container
                display="column"
                justifyContent="center"
                alignItems="center"
                style={{marginTop: "10vh", height: "90vh", width:"100%"}}>
                <Grid
                    item
                    style={{ height: "60vh", width: "100%" }}>
                    <MapContainer
                        style={{ height: "60vh" }}
                        flex
                        center={
                            recordedGpsLocations.length > 0 ? [recordedGpsLocations[recordedGpsLocations.length - 1].coords.latitude,
                            recordedGpsLocations[recordedGpsLocations.length - 1].coords.longitude] :
                                [45.4408474, 12.3155151]
                        }
                        zoom={13}
                        scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: true }} zoomControl={true}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Polyline
                            pathOptions={{ fillColor: 'red', color: 'blue' }}
                            positions={recordedGpsLocations.map((location) => {
                                return [location.coords.latitude, location.coords.longitude]
                            })}
                        />
                        {
                            //Current location
                            (trackHasBeenStarted && !trackHasBeenFinished && recordedGpsLocations.length > 0) &&
                            <Marker
                                icon={icon({
                                    iconUrl: currentLocationIcon,
                                    iconSize: [36, 36]
                                })}
                                key={[recordedGpsLocations[recordedGpsLocations.length - 1].coords.latitude,
                                recordedGpsLocations[recordedGpsLocations.length - 1].coords.longitude]}
                                position={[recordedGpsLocations[recordedGpsLocations.length - 1].coords.latitude,
                                recordedGpsLocations[recordedGpsLocations.length - 1].coords.longitude]}>

                            </Marker>
                        }

                        {
                            //Starting point
                            (trackHasBeenStarted && recordedGpsLocations.length > 0) &&
                            <Marker
                                key={"start"}
                                position={[recordedGpsLocations[0].coords.latitude,
                                recordedGpsLocations[0].coords.longitude]}>

                            </Marker>
                        }

                        {
                            //ending point
                            (trackHasBeenFinished && recordedGpsLocations.length > 0) &&
                            <Marker
                                key={"end"}
                                position={[recordedGpsLocations[recordedGpsLocations.length - 1].coords.latitude,
                                recordedGpsLocations[recordedGpsLocations.length - 1].coords.longitude]}>

                            </Marker>
                        }

                        {
                            recordedGpsLocations.length > 0 &&
                            <MapFlyTracker
                                locations={recordedGpsLocations}>

                            </MapFlyTracker>
                        }

                    </MapContainer>
                </Grid>

                <Grid
                    item
                    style={{ height: "30vh" }}>
                    <TrackingActionsView
                        state={trackingState}
                        startAction={startTrackingAction}
                        stopAction={stopTrackingAction}>
                    </TrackingActionsView>
                </Grid>

                {
                    <TurnOnLocationDialog
                        isOpen={showTurnOnLocatonDialog}
                        closeAction={() => {
                            setShowTurnOnLocationDialog(false);
                        }}>

                    </TurnOnLocationDialog>
                }
            </Grid>


        </>
    )
}

function MapFlyTracker(props) {
    const map = useMap()
    useEffect(() => {
        map.flyTo([props.locations[props.locations.length - 1].coords.latitude,
            props.locations[props.locations.length - 1].coords.longitude], 17)
    }, [props.locations])
}

function TrackingActionsView(props) {
    return (
        <Grid>
            {
                props.state === TrackingState.NOT_STARTED &&
                <>
                    <PlayCircleIcon
                        style={{width:150, height: 150}}
                        onClick={() => props.startAction()}>
                    
                    </PlayCircleIcon>
                </>
                
            }
            {
                props.state === TrackingState.STARTED &&
                <>
                    <StopCircleIcon
                        style={{width:150, height: 150}}
                        onClick={() => props.stopAction()}>
                    
                    </StopCircleIcon>
                </>
            }
            {
                props.state === TrackingState.FINISHED &&
                <Typography variant="h6">
                    Tracking this hike has been finished.
                </Typography>
            }

        </Grid>
    )
}

function TurnOnLocationDialog(props) {
    const Transition = React.forwardRef(function Transition(props, ref) {
        return <Slide direction="up" ref={ref} {...props} />;
    });

    return (
        <Dialog
            open={props.isOpen}
            TransitionComponent={Transition}
            keepMounted
            onClose={props.closeAction}
            aria-describedby="alert-dialog-slide-description">
            {   
                <>
                    <DialogTitle>{"Attention!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            You need to allow location access before start tracking.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.closeAction}>OK!</Button>
                    </DialogActions>
                </>
            }
        </Dialog>
    )
}

function GpsItemView(props) {
    return (
        <Grid>
            <Typography variant="h6">
                    {props.gpsItem.coords.latitude} *** {props.gpsItem.coords.longitude}
                </Typography>
        </Grid>
    )
}


export {TrackingHikePage}