import { Button, Grid, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useMatch } from "react-router";
import API from "../../API/API";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import { TrackingState } from "../../lib/common/Hike";

function TrackingHikePage(props) {

    const match = useMatch('/trackhike/:hikeid')
    const hikeId = match.params.hikeid ? match.params.hikeid : -1;

    const [recordedGpsLocations, setRecordedGpsLocations] = useState([]);
    const [trackingState, setTrackingState] = useState(TrackingState.NOT_STARTED);
    const [trackHasBeenStarted, setTrackHasBeenStarted] = useState(false);
    const [trackHasBeenFinished, setTrackHasBeenFinished] = useState(false);
    const [trackHikeId, setTrackHikeId] = useState(-1);

    useEffect(() => {
        switch(trackingState) {
            case TrackingState.STARTED: {
                if (!trackHasBeenStarted) {
                    //TODO: call api for strating the track
                    API.startTracingkHike(hikeId)
                        .then((result) => {
                            setTrackHikeId(result.id);
                            setTrackHasBeenStarted(true)
                        })
                        .catch((error) => {

                        })
                }
                break;
            }
            case TrackingState.FINISHED: {
                if (!trackHasBeenFinished) {
                    API.stopTrackingHike(trackHikeId)
                        .then((result) => {
                            setTrackHasBeenFinished(true)
                        })
                        .catch((error) => {
                            
                        })
                }
                break;
            }
        }
    }, [trackingState])

    return (
        <>
            {/* <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} /> */}
            <Grid
                container>

                {/* Action container */}
                {
                    <TrackingActionsView
                        state={trackingState}
                        setState={setTrackingState}>
                    </TrackingActionsView>
                }

                {/* List of recorded gps locations */}
                {
                    recordedGpsLocations.length &&
                    recordedGpsLocations.map((item) => {
                        return (
                            <GpsItemView
                                gpsItem={item}/>
                        )
                    })
                }

            </Grid>
        </>
    )
}

function TrackingActionsView(props) {
    //TODO

    return (
        <Grid>
            {
                props.state === TrackingState.NOT_STARTED &&
                <Button
                    onClick={() => props.setState(TrackingState.STARTED)}>
                    Start
                </Button>
            }
            {
                props.state === TrackingState.STARTED &&
                <Button
                    onClick={() => props.setState(TrackingState.FINISHED)}>
                    Finish
                </Button>
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

function GpsItemView(props) {
    return (
        <Grid>
            <Typography variant="h6">
                    {props.gpsItem.date} *** {props.gpsItem.coortinates[0]}, {props.gpsItem.coortinates[1]}
                </Typography>
        </Grid>
    )
}


export {TrackingHikePage}