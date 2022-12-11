import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Grid, List, Slide, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useMatch } from "react-router";
import API from "../../API/API";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import { TrackingState } from "../../lib/common/Hike";
import PlayCircleIcon from '@mui/icons-material/PlayCircle';
import StopCircleIcon from '@mui/icons-material/StopCircle';

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
                        setTrackHasBeenFinished(false)
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
        <Grid 
            container
            flex
            direction="column"
            justifyContent="center"
            alignItems="center"
            style={{ minHeight: "100vh", height: "100%" }}>  
            <HTNavbar item user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} />
            
            <Grid style={{marginTop: 200}}>
                {
                    <TrackingActionsView
                        state={trackingState}
                        startAction={startTrackingAction}
                        stopAction={stopTrackingAction}>
                    </TrackingActionsView>
                }
            </Grid>
            <Grid style={{maxHeight: 300}}>
                {
                    recordedGpsLocations.length > 0 &&
                    recordedGpsLocations.map((item) => {
                        return (
                            <GpsItemView
                                gpsItem={item}/>
                        )
                    })
                    
                }
            </Grid>
            <Grid item>
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
        </Grid>
    )
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
                    <Typography variant="h6">
                        Click to start tracking
                    </Typography>
                    <PlayCircleIcon
                        style={{height: 150, width: 150}}
                        onClick={() => props.startAction()}>
                        
                    </PlayCircleIcon>
                </>
            }
            {
                props.state === TrackingState.STARTED &&
                <>
                    <Typography variant="h6">
                        Tracking is in progress...
                    </Typography>
                    <StopCircleIcon
                        style={{height: 150, width: 150}}
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
                            You need to allow location access in your browser settings before start tracking.
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
    const date = new Date(props.gpsItem.timestamp).toISOString()
    return (
        <Grid>
            <Typography variant="h6">
                {date}, [{props.gpsItem.coords.latitude}, {props.gpsItem.coords.longitude}]
            </Typography>
        </Grid>
    )
}

export {TrackingHikePage}