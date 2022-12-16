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

    const [currentLocation, setCurrentLocation] = useState(null);
    const [trackingState, setTrackingState] = useState(TrackingState.NOT_STARTED);
    const [trackHasBeenStarted, setTrackHasBeenStarted] = useState(false);
    const [trackHasBeenRecorded, setTrackHasBeenRecorded] = useState(false);
    const [trackRecordId, setTrackRecordId] = useState(null);
    const [trackHasBeenFinished, setTrackHasBeenFinished] = useState(false);
    const [trackHikeId, setTrackHikeId] = useState(-1);

    const [showTurnOnLocatonDialog, setShowTurnOnLocationDialog] = useState(false);
    const [isLocationAccessable, setIsLocationAccessable] = useState(false);

    const checkLocationAccess = () => {
        navigator.permissions
            .query({ name: "geolocation" })
            .then(function (result) {
                if (result.state === "granted") {
                    setIsLocationAccessable(true)
                } else if (result.state === "prompt") {
                    navigator.geolocation.getCurrentPosition(
                        (position) => {
                            setIsLocationAccessable(true)
                        }, (err) => {
                            setIsLocationAccessable(false)
                            setShowTurnOnLocationDialog(true)
                        }
                )
                } else if (result.state === "denied") {
                    setIsLocationAccessable(false)
                    setShowTurnOnLocationDialog(true)
                }
                
            });
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
                        setCurrentLocation((olLocation) => {
                            return position
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
        if (!trackHasBeenStarted) {
            API.startTracingkHike(hikeId)
                .then((result) => {
                    setTrackHikeId(result.id);
                    setTrackHasBeenStarted(true)
                    setTrackHasBeenFinished(false)
                    setTrackingState(TrackingState.STARTED)
                })
                .catch((error) => {

                })
        } else {
            //Tracking is already started
        }
    }

    const stopTrackingAction = () => {
        if (!trackHasBeenFinished) {
            API.stopTrackingHike(trackHikeId)
                .then((result) => {
                    setTrackHasBeenFinished(true)
                    setTrackHasBeenStarted(false)
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
                            currentLocation ? [currentLocation.coords.latitude,
                                currentLocation.coords.longitude] :
                                [45.4408474, 12.3155151]
                        }
                        zoom={13}
                        scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: true }} zoomControl={true}>
                        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                        <Polyline
                            pathOptions={{ fillColor: 'red', color: 'blue' }}
                            // positions={recordedGpsLocations.map((location) => {
                            //     return [location.coords.latitude, location.coords.longitude]
                            // })}
                        />
                        {
                            //Current location
                            (trackHasBeenStarted && !trackHasBeenFinished && currentLocation) &&
                            <Marker
                                icon={icon({
                                    iconUrl: currentLocationIcon,
                                    iconSize: [36, 36]
                                })}
                                key={[currentLocation.coords.latitude,
                                    currentLocation.coords.longitude]}
                                position={[currentLocation.coords.latitude,
                                    currentLocation.coords.longitude]}>

                            </Marker>
                        }

                        {
                            currentLocation !== null &&
                            <MapFlyTracker
                                location={currentLocation}>

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
                    showTurnOnLocatonDialog &&
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
        map.flyTo([props.location.coords.latitude,
            props.location.coords.longitude], 17)
    }, [props.location])
}

function TrackingActionsView(props) {
    return (
        <Grid 
            flex
            container
            direction="column"
            justifyContent="center"
            alignItems="center">
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
                            For a better expirience you can turn on your location and see your real location on the map while tracking.
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={props.closeAction}>COOL!</Button>
                    </DialogActions>
                </>
            }
        </Dialog>
    )
}

export {TrackingHikePage}