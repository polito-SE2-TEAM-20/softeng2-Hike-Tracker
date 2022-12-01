import { Button, Grid, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import { displayTypeFlex } from "../../extra/DisplayType";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import './hiker-dashboard-style.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup, useMapEvents, ZoomControl, Polyline, useMap } from 'react-leaflet'
import HikePopup from "../../components/hike-popup/HikePopup";
import HTButton from "../../components/buttons/Button";

const HikerDashboard = (props) => {
    const navigate = useNavigate()
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

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
                        <Typography className="unselectable" fontSize={18} sx={{ backgroundColor: "white", color: "black", borderStyle: "solid", borderWidth: "1px", borderRadius: "18px", width: "fit-content", padding: "4px 12px 4px 12px", fontFamily: "Bakbak One, display", fontWeight: "50" }}>
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
                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    Starting point
                                </Typography>
                                <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}>Latitude: 44.1 - Longitude: 42.1</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <MapContainer center={[44.1, 42.1]} zoom={9}
                                    scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: true }} zoomControl={false}
                                    style={{ width: "auto", minHeight: "40vh", height: "40%" }}>
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                                    />
                                    <ZoomControl position='bottomright' />
                                    <Marker
                                        key={0}
                                        position={[44.1, 42.1]}>
                                        <Popup position={[44.1, 42.1]}>
                                            <HikePopup hike={{ positions: [44.1, 42.1] }} />
                                        </Popup>
                                    </Marker>
                                </MapContainer>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    Radius
                                </Typography>
                                <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}>10km</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField variant="outlined" label="Radius" />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    Length
                                </Typography>
                                <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}>1.5km</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField variant="outlined" label="Length" />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    Expected time
                                </Typography>
                                <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}>2h 30m</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField variant="outlined" label="Expected time" />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    Difficulty
                                </Typography>
                                <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}>Hiker</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <div style={{display: "flex", justifyContent: "space-between", marginLeft: "25%", marginRight: "25%"}}>
                                    <Button variant="outlined" sx={{ borderRadius: "28px", color: "black", borderColor: "black", "&:hover": { backgroundColor: "#55B657", borderColor: "#000000", color: "white" } }}><b>Tourist</b></Button>
                                    <Button variant="outlined" sx={{ borderRadius: "28px", color: "black", borderColor: "black", "&:hover": { backgroundColor: "#1a79aa", borderColor: "#000000", color: "white" } }}><b>Hiker</b></Button>
                                    <Button variant="outlined" sx={{ borderRadius: "28px", color: "black", borderColor: "black", "&:hover": { backgroundColor: "#FA6952", borderColor: "#000000", color: "white" } }}><b>Pro</b></Button>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    Ascent
                                </Typography>
                                <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}>200m</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <TextField variant="outlined" label="Ascent" />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item lg={12} sx={{ marginTop: "28px", display: "flex", justifyContent: "right" }}>
                        <div style={{ marginRight: "28px" }}>
                            <HTButton text="Update preferences" textSize="18px" textColor="white" color="black" />
                        </div>
                        <HTButton text="Cancel your edits" textSize="18px" textColor="white" color="black" />
                    </Grid>
                </Grid>
                <Grid lg={2}>

                </Grid>
            </Grid>
        </>
    );
}

export default HikerDashboard;