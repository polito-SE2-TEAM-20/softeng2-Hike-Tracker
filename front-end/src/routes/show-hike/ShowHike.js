import { Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, formGroupClasses, Grid, Paper, Slide, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useMatch } from "react-router-dom";
import touristIcon from '../../Assets/tourist-icon.png'
import hikerIcon from '../../Assets/hiker-icon.png'
import proIcon from '../../Assets/pro-icon.png'
import React, { useEffect, useState } from "react";
import API from '../../API/API.js';
import { Skeleton } from "@mui/material";
import { fromMinutesToHours } from '../../lib/common/FromMinutesToHours'
import NavigationIcon from '@mui/icons-material/Navigation';
import { UserHikeState } from "../../lib/common/Hike";
import { Button } from "react-bootstrap";
import { UserRoles } from "../../lib/common/UserRoles";
import { HikeWeatherByCode } from '../../lib/common/WeatherConditions'
import { SvgIcon } from "@mui/material";
import { MapContainer, TileLayer, Marker, ZoomControl, Polyline } from 'react-leaflet'
import { APIURL } from "../../API/API.js";
import { MessageSavedHike } from "../saved-hikes/MessageSavedHikes";

const Difficulty = (props) => {
    if (!props.loading) {
        return (
            <>
                {
                    props.diff === 0 ?
                        <>
                            <img src={touristIcon} alt="tourist" width="30px" height="30px" />
                            <div style={{ backgroundColor: "#55B657", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px", fontFamily: "Unbounded" }}><b>Tourist</b></div>
                        </>
                        : <></>
                }
                {
                    props.diff === 1 ?
                        <>
                            <img src={hikerIcon} alt="tourist" width="30px" height="30px" />
                            <div style={{ backgroundColor: "#1a79aa", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px", fontFamily: "Unbounded" }}><b>Hiker</b></div>
                        </>
                        : <></>

                }
                {
                    props.diff === 2 ?
                        <>
                            <img src={proIcon} alt="tourist" width="30px" height="30px" />
                            <div style={{ backgroundColor: "#FA6952", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px", fontFamily: "Unbounded" }}><b>Pro</b></div>
                        </>
                        : <></>

                }
            </>
        );
    }
    else {
        return (
            <Skeleton variant='rectangular' height={25} width={200} style={{ marginBottom: "10px" }} />
        );
    }

}

const ShowHike = (props) => {
    const navigate = useNavigate()
    const match = useMatch('/showhike/:hikeid')
    const hikeid = (match && match.params && match.params.hikeid) ? match.params.hikeid : -1
    const [hike, setHike] = useState({ title: "", description: "", region: "", province: "", length: "", expectedTime: "", ascent: "", difficulty: "" })
    const [loading, setLoading] = useState(true)

    //Vars for Hike Tracking
    const [showStartTrackError, setShowStartTrackError] = useState(false);
    const [errorStartTrack, setErrorStartTrack] = useState(null);

    //states for message of saved hike
    const [message, setMessage] = useState(null);
    const [open, setOpen] = useState(false);
    const [savedHikes, setSavedHikes] = useState({ title: "", description: "", region: "", province: "", length: "", expectedTime: "", ascent: "", difficulty: "" })
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        let tmpHike = { title: "", description: "", region: "", province: "", length: "", expectedTime: "", ascent: "", difficulty: -1 }

        const getHike = async () => {
            tmpHike = await API.getSingleHikeByID(hikeid)
        }
        const fetchGPXFile = async () => {
            tmpHike = await API.getHikePathByHike(tmpHike)
        }
        getHike().then(() => {
            fetchGPXFile().then(() => {
                let gpxParser = require('gpxparser');
                const gpx = new gpxParser();
                gpx.parse(tmpHike.positions);
                tmpHike.positions = gpx.tracks[0].points.map(p => [p.lat, p.lon])
                setHike(tmpHike)
                setLoading(false)
            })
        })


    }, [])



    const handleStartTrackHiking = () => {
        API.getAllUserTrackingHikes(UserHikeState.ACTIVE)
            .then((activeHikeList) => {
                //If the user doesn't have any active hike tracking, he can start a new one.
                //Else we should show that which hike is active 
                if (activeHikeList.length === 0) {
                    navigate("/trackhike/" + hikeid)
                } else {
                    setErrorStartTrack("You have another active tracking, you should finish it before starting a new one. Check your ongoing track in \"My Hikes\" section in your toolbar.")
                    setShowStartTrackError(true)
                }
            })
            .catch((error) => {
                setErrorStartTrack("Failed to get your active tracks, please try again.")
                setShowStartTrackError(true)
            })
    }


    const closeStartTrackErrorAction = () => {
        setErrorStartTrack(null)
        setShowStartTrackError(false)
    }



    const handleSaveForLater = () => {
        API.getPlannedHikes()
            .then((plannedHikes) => {
                console.log(plannedHikes)
                console.log(hike.id);
                console.log(plannedHikes.map(el => el.id === hike.id))
                if (plannedHikes?.filter(el => el.id === hike.id).length !== 0) {
                    setMessage('Hikes already present in saved hikes');
                    setOpen(true);
                } else {
                    API.setPlannedHikes(hike.id)
                        .then((hikesPlanned) => {
                            setSavedHikes(hikesPlanned);
                            setMessage('Hikes correctly saved for later');
                            setOpen(true);

                        })
                        .catch((error) => {
                            setMessage(error);
                            setOpen(true);
                        })
                }
            }).catch(() => {
                API.setPlannedHikes(hike.id)
                    .then((hikesPlanned) => {
                        setSavedHikes(hikesPlanned);
                        setMessage('Hikes correctly saved for later');
                        setOpen(true);

                    })
                    .catch((error) => {
                        setMessage(error);
                        setOpen(true);
                    })
            })
    }




    return (
        <Grid container flex style={{ minHeight: "100vh", height: "100%" }}>
            <Grid item>
                <div style={{ display: "flex", justifyContent: "center", borderRadius: 12 }}>
                    {
                        !loading ?
                            <img src={APIURL + hike.pictures[0]} alt={"landscape"} style={{ objectFit: "cover", width: "100vw", height: "400px" }} />
                            :
                            <></>
                    }
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginTop: { xs: "-350px", md: "-200px" } }}>
                {
                    !loading ? <Typography variant="h2" sx={{ fontFamily: "Unbounded", textShadow: "#1a1a1a 0px 0 20px", color: "#fafafa", textAlign: "center" }}>{hike.title}</Typography> :
                        <Skeleton variant='rectangular' height={50} width={600} style={{ marginBottom: "10px" }} />
                }
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: "12px" }}>
                <Divider>
                    <Difficulty loading={loading} diff={hike.difficulty} />
                </Divider>
            </Grid>
            <Grid style={{ marginTop: "20px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "fit-content" }} item lg={3}>
                <Paper style={{ padding: "30px" }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h4">General information</Typography>
                    </Grid>
                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Where to find" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ?
                                <Typography>Region: {hike.region === "" ? "N/A" : hike.region}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Province: {hike.province === "" ? "N/A" : hike.province}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="About the hike" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Length: {hike.length === "" ? "N/A" : (Math.round(hike.length * 10) / 10000).toFixed(2)}km</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Expected time: {hike.expectedTime === "" ? "N/A" : fromMinutesToHours(hike.expectedTime)}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Ascent: {hike.ascent === "" ? "N/A" : hike.ascent}m</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Weather conditions" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Weather status:&nbsp;
                                {HikeWeatherByCode[hike.weatherStatus].name}
                                <SvgIcon component={HikeWeatherByCode[hike.weatherStatus].image} />
                            </Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Description of weather: {hike.weatherDescription === "" || hike.weatherDescription === undefined ? "not provided" : hike.weatherDescription}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                    {
                        props.user?.role === UserRoles.HIKER ?
                            <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                                <Chip label="Actions" />
                            </Divider> : <></>
                    }
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            (props.user?.role === UserRoles.HIKER) &&
                            <Fab
                                variant="extended"
                                size="medium"
                                color="primary"
                                aria-label="start-navigaion"
                                onClick={() => {
                                    handleStartTrackHiking()
                                }}>
                                <NavigationIcon />
                                Start This Hike
                            </Fab>
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={3}>
                        {
                            (props.user?.role === UserRoles.HIKER) &&

                            <Fab
                                variant="extended"
                                size="medium"
                                color="primary"
                                aria-label="save-for-later"
                                onClick={() => {
                                    handleSaveForLater()
                                }}>

                                Save Hike For Later
                            </Fab>
                        }
                    </Grid>

                </Paper>
            </Grid>
            <Grid style={{ marginTop: "30px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "80vh", paddingLeft: "25px", paddingRight: "25px" }} item lg={6}>

                {/* <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "30px" }}>
                    {
                        !loading ?
                            <Typography variant="h4">Some information on this hike</Typography>
                            : <Typography variant="h4">Loading...</Typography>
                    }
                </Grid> */}
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {
                        !loading ? <Typography>{hike.description === "" ? "No description provided." : hike.description}</Typography> :
                            <>
                                <Skeleton variant='rectangular' height={20} width={400} style={{ marginBottom: "10px" }} />
                                <Skeleton variant='rectangular' height={20} width={400} style={{ marginBottom: "10px" }} />
                                <Skeleton variant='rectangular' height={20} width={150} style={{ marginBottom: "10px" }} />
                            </>
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {
                        !loading ?
                            <MapContainer center={[hike?.positions[0][0], hike?.positions[0][1]]} zoom={14}
                                scrollWheelZoom={{ xs: false, sm: false, md: false, lg: false, xl: false }} zoomControl={false}
                                style={{ width: "auto", minHeight: "20vh", height: "40vh" }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                                />
                                <Marker
                                    key={hike.id}
                                    position={[hike?.positions[0][0], hike?.positions[0][1]]}>
                                </Marker>
                                <Polyline
                                    pathOptions={{ fillColor: 'red', color: 'blue' }}
                                    positions={hike?.positions}
                                />
                                <ZoomControl position='bottomright' />
                            </MapContainer> :
                            <>
                                <Skeleton variant='rectangular' height={400} width={900} style={{ marginBottom: "10px" }} />
                            </>
                    }
                </Grid>
            </Grid>
            { 
                showStartTrackError &&
                <ErrorDialog
                    message={errorStartTrack}
                    isOpen={showStartTrackError}
                    closeAction={closeStartTrackErrorAction} />
            }
            {
                <MessageSavedHike
                    message={message}
                    open={open}
                    setMessage={setMessage}
                    setOpen={setOpen}
                    id={hikeid}
                />
            }
        </Grid>
    );
}

function ErrorDialog(props) {
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
                props.message !== null &&
                <>
                    <DialogTitle>{"Opppps!"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-slide-description">
                            {props.message}
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

export default ShowHike;