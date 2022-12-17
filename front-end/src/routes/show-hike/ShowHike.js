import { Chip, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Divider, Fab, Grid, Paper, Slide, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
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

const Difficulty = (props) => {
    if (!props.loading) {
        return (
            <>
                {
                    props.diff == 0 ?
                        <>
                            <img src={touristIcon} alt="tourist" width="30px" height="30px" />
                            <div style={{ backgroundColor: "#55B657", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Tourist</b></div>
                        </>
                        : <></>
                }
                {
                    props.diff == 1 ?
                        <>
                            <img src={hikerIcon} alt="tourist" width="30px" height="30px" />
                            <div style={{ backgroundColor: "#1a79aa", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Hiker</b></div>
                        </>
                        : <></>

                }
                {
                    props.diff == 2 ?
                        <>
                            <img src={proIcon} alt="tourist" width="30px" height="30px" />
                            <div style={{ backgroundColor: "#FA6952", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Pro</b></div>
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

    useEffect(() => {
        let tmpHike = { title: "", description: "", region: "", province: "", length: "", expectedTime: "", ascent: "", difficulty: -1 }
        const getHike = async () => {
            tmpHike = await API.getSingleHikeByID(hikeid)
        }
        getHike().then(() => {
            setHike(tmpHike)
            setLoading(false)
        })
    }, [])


    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    const handleStartTrackHiking = () => {
        API.getAllUserTrackingHikes(UserHikeState.ACTIVE)
            .then((activeHikeList) => {
                //If the user doesn't have any active hike tracking, he can start a new one.
                //Else we should show that which hike is active 
                if (activeHikeList.length === 0) {
                    navigate("/trackhike/" + hikeid)
                } else {
                    setErrorStartTrack("You have another active tracking, you should finish it before starting a new one.")
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

    return (
        <Grid container flex style={{ minHeight: "100vh", height: "100%" }}>
            <Grid style={{ marginTop: "50px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "55vh" }} item lg={3}>
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
                                <Typography>Region: {hike.region == "" ? "N/A" : hike.region}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Province: {hike.province == "" ? "N/A" : hike.province}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="About the hike" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Length: {hike.length == "" ? "N/A" : (Math.round(hike.length * 10) / 10000).toFixed(2)}km</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Expected time: {hike.expectedTime == "" ? "N/A" : fromMinutesToHours(hike.expectedTime)}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Ascent: {hike.ascent == "" ? "N/A" : hike.ascent}m</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Weather conditions" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Weather status:&nbsp;
                                {HikeWeatherByCode[0].name}
                                <SvgIcon component={HikeWeatherByCode[0].image} />
                            </Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Description of weather: Not provided</Typography> :
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

                </Paper>
            </Grid>
            <Grid style={{ marginTop: "50px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "80vh", paddingLeft: "25px", paddingRight: "25px" }} item lg={6}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    {
                        !loading ? <Typography variant="h2" sx={{ fontFamily: "Unbounded" }}>{hike.title}</Typography> :
                            <Skeleton variant='rectangular' height={50} width={600} style={{ marginBottom: "10px" }} />
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Divider>
                        <Difficulty loading={loading} diff={hike.difficulty} />
                    </Divider>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "30px" }}>
                    {
                        !loading ?
                            <Typography variant="h4">Some information on this hike</Typography>
                            : <Typography variant="h4">Loading...</Typography>
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {
                        !loading ? <Typography>{hike.description == "" ? "No description provided." : hike.description}</Typography> :
                            <>
                                <Skeleton variant='rectangular' height={20} width={400} style={{ marginBottom: "10px" }} />
                                <Skeleton variant='rectangular' height={20} width={400} style={{ marginBottom: "10px" }} />
                                <Skeleton variant='rectangular' height={20} width={150} style={{ marginBottom: "10px" }} />
                            </>
                    }
                </Grid>
            </Grid>
            {
                <ErrorDialog
                    message={errorStartTrack}
                    isOpen={showStartTrackError}
                    closeAction={closeStartTrackErrorAction} />
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