import { Grid, Switch, Typography, CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import { displayTypeFlex } from "../../extra/DisplayType";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './admin-dashboard-style.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupsIcon from '@mui/icons-material/Groups';
import HTButton from "../../components/buttons/Button";
import { FormControlLabel } from "@mui/material";
import { useState, useEffect } from "react";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import API from "../../API/API";

const AdminDashboard = (props) => {
    const navigate = useNavigate()
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }
    const [loaded, setLoaded] = useState(false)
    const [listOfRequests, setListOfRequests] = useState([])
    const [filter, setFilter] = useState({ 'hut': true, 'local': true })
    const [tmpLOR, setTmpLOR] = useState([])

    useEffect(() => {
        var listOfLocalGuides = []
        var listOfHutWorkers = []
        setLoaded(false)

        const getHWLists = async () => {
            listOfHutWorkers = await API.getNotApprovedHutWorkers()
        }

        const getLGList = async () => {
            listOfLocalGuides = await API.getNotApprovedLocalGuides()
        }

        getLGList().then(() => {
            getHWLists().then(() => {
                setTmpLOR([].concat(listOfHutWorkers).concat(listOfLocalGuides))
                setTimeout(() => {
                    setLoaded(true)
                }, 500);
            })
        })
    }, [])

    useEffect(() => {
        setListOfRequests(tmpLOR)
    }, [tmpLOR])

    const acceptUser = (id) => {
        const accUser = async () => {
            await API.approveUserByID(id);
        }
        accUser().then(() => {
            setTmpLOR(tmpLOR.filter(x => x.id !== id))
        })
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
                        <Typography className="unselectable" fontSize={18} sx={{
                            backgroundColor: "white", color: "purple", borderColor: "purple",
                            borderStyle: "solid", borderWidth: "1px",
                            borderRadius: "18px", width: "fit-content",
                            padding: "4px 12px 4px 12px", fontFamily: "Bakbak One, display",
                            fontWeight: "50"
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
                <Grid container item lg={6} justifyContent="center" height="fit-content" sx={{ marginLeft: "25px", marginBottom: "35px" }}>
                    <Grid item lg={6}>
                        <Grid lg={12}>
                            <Typography className="unselectable" fontSize={32}>
                                <b>Admin dashboard</b>
                            </Typography>
                        </Grid>
                        <Grid lg={12}>
                            <Typography className="unselectable" fontSize={14} color="#555555">
                                Here, the admin is allowed to accept or reject any sign up request for either local guides and hut workers.
                            </Typography>
                        </Grid>
                    </Grid>

                    <Grid item lg={6}>
                        <Grid lg={12} style={{ display: "flex", justifyContent: "right" }}>
                            <FormControlLabel control={<Switch onChange={e => { setFilter({ 'hut': filter.hut, 'local': e.target.checked }) }} defaultChecked />} label="Show local guides requests" />
                        </Grid>
                        <Grid lg={12} style={{ display: "flex", justifyContent: "right" }}>
                            <FormControlLabel control={<Switch onChange={e => { setFilter({ 'hut': e.target.checked, 'local': filter.local }) }} defaultChecked />} label="Show hut workers requests" />
                        </Grid>
                    </Grid>

                    <Grid lg={12} sx={{ marginTop: "28px" }}>
                        {
                            !loaded ?
                                <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                    <Grid item style={{ marginTop: "50px" }} >
                                        <Typography variant="h5" lg={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                                            Loading...
                                        </Typography>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            <CircularProgress lg={12} size="72px" />
                                        </div>
                                    </Grid>
                                </Grid>
                                : <></>
                        }
                        {
                            loaded && listOfRequests.filter(x => {
                                if (x.role === 2 && filter.local) return x
                                if (x.role === 4 && filter.hut) return x
                            }).length === 0 ?
                                <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                    <Grid item style={{ marginTop: "50px" }} >
                                        <Typography variant="h5" className="unselectable">
                                            {filter.hut && filter.local ? "There are no incoming requests." : "No request matching this filters."}
                                        </Typography>
                                        <div style={{ display: "flex", justifyContent: "center" }}>
                                            {
                                                filter.hut && filter.local ?
                                                    <SentimentSatisfiedAltIcon lg={12} sx={{ fontSize: "72px" }} />
                                                    :
                                                    <FilterAltOffIcon lg={12} sx={{ fontSize: "72px" }} />
                                            }
                                        </div>
                                    </Grid>
                                </Grid>
                                : <></>
                        }
                        {
                            loaded && listOfRequests.filter(x => {
                                if (x.role === 2 && filter.local) return x
                                if (x.role === 4 && filter.hut) return x
                            }).length !== 0 ?
                                listOfRequests.filter(x => {
                                    if (x.role === 2 && filter.local) return x
                                    if (x.role === 4 && filter.hut) return x
                                }).map(request => {
                                    if (request.role === 2) // local guide
                                        return (
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                                        {request.firstName + " " + request.lastName}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}><GroupsIcon sx={{ marginRight: "20px" }} />Local guide</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container>
                                                        <Grid item lg={12}>
                                                            <Typography><b>Full name</b>: {request.firstName + " " + request.lastName}</Typography>
                                                        </Grid>
                                                        <Grid item lg={12}>
                                                            <Typography><b>Role</b>: Local Guide</Typography>
                                                        </Grid>
                                                        <Grid item lg={12}>
                                                            <Typography><b>Email</b>: {request.email}</Typography>
                                                        </Grid>
                                                        <Grid item lg={12} sx={{ display: "flex", justifyContent: "right" }}>
                                                            {/* <div style={{ marginRight: "24px" }}> */}
                                                            <HTButton navigate={() => { acceptUser(request.id) }} text="Accept" textSize="18px" textColor="white" color="#33aa33" />
                                                            {/* </div> */}
                                                            {/* <HTButton text="Reject" textSize="18px" textColor="white" color="#aa3333" /> */}
                                                        </Grid>
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        )
                                    else if (request.role === 4) // hut worker
                                        return (
                                            <Accordion>
                                                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                    <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                                        {request.firstName + " " + request.lastName}
                                                    </Typography>
                                                    <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}><BadgeIcon sx={{ marginRight: "20px" }} />Hut worker</Typography>
                                                </AccordionSummary>
                                                <AccordionDetails>
                                                    <Grid container>
                                                        <Grid item lg={12}>
                                                            <Typography><b>Full name</b>: {request.firstName + " " + request.lastName}</Typography>
                                                        </Grid>
                                                        <Grid item lg={12}>
                                                            <Typography><b>Role</b>: Hut Worker</Typography>
                                                        </Grid>
                                                        <Grid item lg={12}>
                                                            <Typography><b>Email</b>: {request.email}</Typography>
                                                        </Grid>
                                                        <Grid item lg={12} sx={{ display: "flex", justifyContent: "right" }}>
                                                            {/* <div style={{ marginRight: "24px" }}> */}
                                                            <HTButton navigate={() => { acceptUser(request.id) }} text="Accept" textSize="18px" textColor="white" color="#33aa33" />
                                                            {/* </div> */}
                                                            {/* <HTButton text="Reject" textSize="18px" textColor="white" color="#aa3333" /> */}
                                                        </Grid>
                                                    </Grid>
                                                </AccordionDetails>
                                            </Accordion>
                                        )
                                }
                                )
                                : <></>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default AdminDashboard;