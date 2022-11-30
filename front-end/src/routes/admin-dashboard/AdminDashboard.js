import { Grid, Switch, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import { displayTypeFlex } from "../../extra/DisplayType";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import EditIcon from '@mui/icons-material/Edit';
import './admin-dashboard-style.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup, useMapEvents, ZoomControl, Polyline, useMap } from 'react-leaflet'
import HikePopup from "../../components/hike-popup/HikePopup";
import HTButton from "../../components/buttons/Button";
import { FormControlLabel } from "@mui/material";
import { useState, useEffect } from "react";
import API from "../../API/API";

const AdminDashboard = (props) => {
    const navigate = useNavigate()
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }
    const [loaded, setLoaded] = useState(false)
    const [localGuides, setLocalGuides] = useState([])
    const [hutWorkers, setHutWorkers] = useState([])

    useEffect(() => {
        var listOfLocalGuides = []
        var listOfHutWorkers = []

        const getLocalGuides = async () => {
            listOfLocalGuides = await API.getNotApprovedLocalGuides()
        }
        const getHutWorkers = async () => {
            listOfHutWorkers = await API.getNotApprovedHutWorkers()
        }

        getLocalGuides().then(() => {
            setLocalGuides(listOfLocalGuides)
            console.log(localGuides)
        })
        getHutWorkers().then(() => {
            setHutWorkers(listOfHutWorkers)
            console.log(hutWorkers)
        })

    }, [])

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
                        <Typography fontSize={18} sx={{ backgroundColor: "white", color: "black", borderStyle: "solid", borderWidth: "1px", borderRadius: "18px", width: "fit-content", padding: "4px 12px 4px 12px", fontFamily: "Bakbak One, display", fontWeight: "50" }}>
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
                <Grid container item lg={6} justifyContent="center" height="fit-content" sx={{ marginLeft: "25px" }}>
                    <Grid item lg={6}>
                        <Grid lg={12}>
                            <Typography fontSize={32}>
                                <b>Admin dashboard</b>
                            </Typography>
                        </Grid>
                        <Grid lg={12}>
                            <Typography fontSize={14} color="#555555">
                                Here, the admin is allowed to accept or reject any sign up request for either local guides and hut workers.
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item lg={6}>
                        <Grid lg={12} style={{ display: "flex", justifyContent: "right" }}>
                            <FormControlLabel control={<Switch defaultChecked />} label="Show local guides requests" />
                        </Grid>
                        <Grid lg={12} style={{ display: "flex", justifyContent: "right" }}>
                            <FormControlLabel control={<Switch defaultChecked />} label="Show hut workers requests" />
                        </Grid>
                    </Grid>

                    <Grid lg={12} sx={{ marginTop: "28px" }}>
                        {/* <Typography variant="h5">
                            There are no incoming requests.
                        </Typography> */}
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    Frank Freak
                                </Typography>
                                <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}>Local guide</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Grid container>
                                    <Grid item lg={12}>
                                        <Typography><b>Full name</b>: Frank Freak</Typography>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <Typography><b>Role</b>: Local Guide</Typography>
                                    </Grid>
                                    <Grid item lg={12}>
                                        <Typography><b>Email</b>: frankfreek@gmail.com</Typography>
                                    </Grid>
                                    <Grid item lg={12} sx={{ display: "flex", justifyContent: "right" }}>
                                        <div style={{ marginRight: "24px" }}>
                                            <HTButton text="Accept" textSize="18px" textColor="white" color="#33aa33" />
                                        </div>
                                        <HTButton text="Reject" textSize="18px" textColor="white" color="#aa3333" />
                                    </Grid>

                                </Grid>
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                </Grid>
                <Grid lg={2}>

                </Grid>
            </Grid>
        </>
    );
}

export default AdminDashboard;