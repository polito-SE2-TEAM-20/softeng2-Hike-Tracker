import { Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import { displayTypeFlex } from "../../extra/DisplayType";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './hiker-dashboard-style.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup, useMapEvents, ZoomControl, Polyline, useMap } from 'react-leaflet'
import HikePopup from "../../components/hike-popup/HikePopup";
import HTButton from "../../components/buttons/Button";
import { useState, useEffect } from "react";
import API from '../../API/API'
import { fromMinutesToHours } from '../../lib/common/FromMinutesToHours'

const HikerDashboard = (props) => {
    const navigate = useNavigate()
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }
    // {
    //     "lat": 5.005,
    //     "lon": 5.004,
    //     "radiusKms": 10,
    //     "length": 5000,
    //     "expectedTime": 1000,
    //     "difficulty": 2,
    //     "ascent": 100
    // }
    const [preferences, setPreferences] = useState({
        'lat': 0.0,
        'lon': 0.0,
        'radiusKms': 0,
        'length': 0,
        'expectedTime': 0,
        'difficulty': 0,
        'ascent': 0
    })
    var newPreferences = {}

    const [updateFinished, setUpdateFinished] = useState(false)

    useEffect(() => {
        var tmpPref = {}
        const getPreferences = async () => {
            tmpPref = await API.getPreferences()
        }
        getPreferences().finally(() => {
            // setPreferences(newPreferences)
            setPreferences(
                {
                    'lat': 15.15,
                    'lon': 51.51,
                    'radiusKms': 100,
                    'length': 200,
                    'expectedTime': 300,
                    'difficulty': 2,
                    'ascent': 400
                }
            )
            newPreferences = preferences
        })
    }, [])

    const handlePreferencesUpdate = () => {
        const setPreferences = async () => {
            await API.setPreferences(preferences)
        }
        setPreferences().finally(() => {
            setUpdateFinished(true)
        })
    }

    useEffect(() => {
        setTimeout(() => {
            if (updateFinished)
                setUpdateFinished(false)
        }, 2500);
    }, [updateFinished])

    return (
        <>
            <HTNavbar user={props?.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <Grid container columns={12} display={displayTypeFlex.pc} style={{ marginTop: "75px" }}>
                <Grid item lg={2}>

                </Grid>
                <Grid container item lg={2} height="fit-content">
                    <Grid item lg={12}>
                        <AccountCircleIcon sx={{ fontSize: 300 }} />
                    </Grid>
                    <Grid item lg={12}>
                        <Typography fontSize={32}>
                            <b>
                                {props?.user?.firstName + " " + props?.user?.lastName}
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item lg={12}>
                        <Typography fontSize={20} color="#666666">
                            {props?.user?.email}
                        </Typography>
                    </Grid>
                    <Grid item lg={12} sx={{ marginTop: "12px" }}>
                        <Typography className="unselectable" fontSize={18} sx={{
                            backgroundColor: "white", color: "purple", borderStyle: "solid",
                            borderWidth: "1px", borderRadius: "18px", width: "fit-content", padding: "4px 12px 4px 12px",
                            fontFamily: "Bakbak One, display", fontWeight: "50", borderColor: "purple"
                        }}>
                            <b>
                                {props?.user?.role == 0 ? "Hiker" : ""}
                                {props?.user?.role == 1 ? "Friend" : ""}
                                {props?.user?.role == 2 ? "Local guide" : ""}
                                {props?.user?.role == 3 ? "Platform manager" : ""}
                                {props?.user?.role == 4 ? "Hut worker" : ""}
                                {props?.user?.role == 5 ? "Emergency operator" : ""}
                            </b>
                        </Typography>
                    </Grid>
                </Grid>
                <Grid container item lg={6} height="fit-content" justifyContent="center" sx={{ marginLeft: "25px" }}>
                    <Grid lg={12}>
                        <Typography fontSize={32}>
                            <b>Preferences</b>
                        </Typography>
                    </Grid>
                    <Grid lg={12}>
                        <Typography fontSize={14} color="#555555">
                            <b><a href="/">HackTheHike.com</a></b> will use your preferences exclusively to suggest you more pertinent hikes and to improve your experience on our website.
                        </Typography>
                    </Grid>
                    <Grid lg={12} sx={{ marginTop: "28px" }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Starting point</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>Latitude: {preferences?.lat} - Longitude: {preferences?.lon}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Choose a point on the map to fix your favorite starting point.
                                </Typography>
                                <MapContainer center={[preferences?.lat, preferences?.lon]} zoom={9}
                                    scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: true }} zoomControl={false}
                                    style={{ width: "auto", minHeight: "40vh", height: "40%" }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                                    />
                                    <ZoomControl position='bottomright' />
                                    <Marker
                                        key={0}
                                        position={[preferences?.lat, preferences?.lon]}>
                                        <Popup position={[preferences?.lat, preferences?.lon]}>
                                            <HikePopup hike={{ positions: [preferences?.lat, preferences?.lon] }} />
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Radius</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{preferences?.radiusKms.toFixed(2)}km</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the radius to determine the area from which you'd prefer to start your hikes.
                                </Typography>
                                <TextField variant="outlined" label="Radius" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Length</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{preferences?.length.toFixed(2)}m</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the length of your ideal hike.
                                </Typography>
                                <TextField variant="outlined" label="Length" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Expected time</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{fromMinutesToHours(preferences?.expectedTime)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the expected time for your ideal hike.
                                </Typography>
                                <TextField variant="outlined" label="Expected time" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Difficulty</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>
                                    {preferences?.difficulty == 0 ? "Tourist" : <></>}
                                    {preferences?.difficulty == 1 ? "Hiker" : <></>}
                                    {preferences?.difficulty == 2 ? "Pro" : <></>}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Choose the difficulty level that better fits your needings and your past experiences.
                                </Typography>
                                <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "25%", marginRight: "25%" }}>
                                    <Button variant="outlined" sx={{ borderRadius: "28px", color: "black", borderColor: "black", "&:hover": { backgroundColor: "#55B657", borderColor: "#000000", color: "white" } }}><b>Tourist</b></Button>
                                    <Button variant="outlined" sx={{ borderRadius: "28px", color: "black", borderColor: "black", "&:hover": { backgroundColor: "#1a79aa", borderColor: "#000000", color: "white" } }}><b>Hiker</b></Button>
                                    <Button variant="outlined" sx={{ borderRadius: "28px", color: "black", borderColor: "black", "&:hover": { backgroundColor: "#FA6952", borderColor: "#000000", color: "white" } }}><b>Pro</b></Button>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Ascent</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{preferences?.ascent}m</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the ascent for your ideal hike.
                                </Typography>
                                <TextField variant="outlined" label="Ascent" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item lg={12} sx={{ marginTop: "28px", display: "flex", justifyContent: "right" }}>
                        {updateFinished ? <div style={{marginRight: "25px"}}>
                            <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                <b>Your preferences have been correctly updated.</b>
                            </Typography>
                        </div> : <></>}
                        <Button variant="filled"
                            onClick={handlePreferencesUpdate}
                            sx={{
                                backgroundColor: "green", color: "white",
                                borderRadius: "50px",
                                "&:hover": { backgroundColor: "darkgreen" }
                            }}>
                            Update preferences
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default HikerDashboard;