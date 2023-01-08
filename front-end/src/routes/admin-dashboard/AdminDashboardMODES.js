import { Grid, Switch, Typography, CircularProgress, Divider, FormControlLabel, Chip } from "@mui/material";
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
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import WeatherCard from "../../components/weather-card/WeatherCard";
import {UserRoles} from '../../lib/common/UserRoles.js'
import { useNavigate } from "react-router";

export const AdminDashboardPC = (props) => {
    const navigate = useNavigate()

    if(props.user?.role !== UserRoles.PLATFORM_MANAGER) {
        navigate('/unauthorized')
    }
    return (
        <Grid container sx={{marginTop: "20px"}} columns={12} display={displayTypeFlex.pc} justifyContent="center">
            <Grid container item lg={2} xl={2} height="fit-content">
                <Grid item lg={12} xl={12}>
                    <AccountCircleIcon sx={{ fontSize: 300 }} />
                </Grid>
                <Grid item lg={12} xl={12}>
                    <Typography sx={{ fontFamily: "Unbounded" }} fontSize={24}>
                        <b>
                            {props?.user?.firstName + " " + props?.user?.lastName}
                        </b>
                    </Typography>
                </Grid>
                <Grid item lg={12} xl={12}>
                    <Typography fontSize={20} color="#666666">
                        {props?.user?.email}
                    </Typography>
                </Grid>
                <Grid item lg={12} xl={12} sx={{ marginTop: "12px" }}>
                    <Typography className="unselectable" fontSize={18} sx={{
                        backgroundColor: "white", color: "purple", borderColor: "purple",
                        borderStyle: "solid", borderWidth: "1px",
                        borderRadius: "18px", width: "fit-content",
                        padding: "4px 12px 4px 12px", fontFamily: "Unbounded",
                        fontWeight: "50"
                    }}>
                        <b>
                            {props?.user?.role === 0 ? "Hiker" : ""}
                            {props?.user?.role === 1 ? "Friend" : ""}
                            {props?.user?.role === 2 ? "Local guide" : ""}
                            {props?.user?.role === 3 ? "Platform manager" : ""}
                            {props?.user?.role === 4 ? "Hut worker" : ""}
                            {props?.user?.role === 5 ? "Emergency operator" : ""}
                        </b>
                    </Typography>
                    <Divider sx={{ marginTop: "18px", marginBottom: "18px" }}>
                        <Chip label="Add new weather condition" />
                    </Divider>
                    <Grid container item lg={12} xl={12} height="fit-content" sx={{ justifyContent: "left" }}>
                        <WeatherCard type="map" text="Create weather alert for a location" />
                        <WeatherCard type="hike" text="Create weather alert for a hike" />
                    </Grid>
                </Grid>
            </Grid>
            <Grid container item lg={8} xl={6} justifyContent="center" height="fit-content" sx={{ marginLeft: "25px", marginBottom: "35px" }}>
                <Grid item lg={6} xl={6}>
                    <Grid lg={12} xl={12}>
                        <Typography className="unselectable" fontSize={32}>
                            <b>Admin dashboard</b>
                        </Typography>
                    </Grid>
                    <Grid lg={12} xl={12}>
                        <Typography className="unselectable" fontSize={14} color="#555555">
                            Here, the platform manager is allowed to accept any sign up request for either local guides and hut workers.
                        </Typography>
                    </Grid>
                </Grid>

                <Grid item lg={4} xl={6}>
                    <Grid lg={12} xl={12} style={{ display: "flex", justifyContent: "right" }}>
                        <FormControlLabel control={<Switch onChange={e => { props.setFilter({ 'hut': props.filter.hut, 'local': e.target.checked }) }} defaultChecked />} label="Show local guides requests" />
                    </Grid>
                    <Grid lg={12} xl={12} style={{ display: "flex", justifyContent: "right" }}>
                        <FormControlLabel control={<Switch onChange={e => { props.setFilter({ 'hut': e.target.checked, 'local': props.filter.local }) }} defaultChecked />} label="Show hut workers requests" />
                    </Grid>
                </Grid>

                <Grid lg={12} xl={12} sx={{ marginTop: "28px" }}>
                    {
                        !props.loaded ?
                            <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid item style={{ marginTop: "50px" }} >
                                    <Typography variant="h5" lg={12} xl={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                                        Loading...
                                    </Typography>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <CircularProgress lg={12} xl={12} size="72px" />
                                    </div>
                                </Grid>
                            </Grid>
                            : <></>
                    }
                    {
                        props.loaded && props.listOfRequests.filter(x => {
                            if (x.role === 2 && props.filter.local) return x
                            if (x.role === 4 && props.filter.hut) return x
                        }).length === 0 ?
                            <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid item style={{ marginTop: "50px" }} >
                                    <Typography variant="h5" className="unselectable">
                                        {props.filter.hut && props.filter.local ? "There are no incoming requests." : "No request matching this filters."}
                                    </Typography>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        {
                                            props.filter.hut && props.filter.local ?
                                                <SentimentSatisfiedAltIcon lg={12} xl={12} sx={{ fontSize: "72px" }} />
                                                :
                                                <FilterAltOffIcon lg={12} xl={12} sx={{ fontSize: "72px" }} />
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                            : <></>
                    }
                    {
                        props.loaded && props.listOfRequests.filter(x => {
                            if (x.role === 2 && props.filter.local) return x
                            if (x.role === 4 && props.filter.hut) return x
                        }).length !== 0 ?
                            props.listOfRequests.filter(x => {
                                if (x.role === 2 && props.filter.local) return x
                                if (x.role === 4 && props.filter.hut) return x
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
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Full name</b>: {request.firstName + " " + request.lastName}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Role</b>: Local Guide</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Email</b>: {request.email}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12} sx={{ display: "flex", justifyContent: "right" }}>
                                                        {/* <div style={{ marginRight: "24px" }}> */}
                                                        <HTButton navigate={() => { props.acceptUser(request.id) }} text="Accept" textSize="18px" textColor="white" color="#33aa33" />
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
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Full name</b>: {request.firstName + " " + request.lastName}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Role</b>: Hut Worker</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Email</b>: {request.email}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12} sx={{ display: "flex", justifyContent: "right" }}>
                                                        {/* <div style={{ marginRight: "24px" }}> */}
                                                        <HTButton navigate={() => { props.acceptUser(request.id) }} text="Accept" textSize="18px" textColor="white" color="#33aa33" />
                                                        {/* </div> */}
                                                        {/* <HTButton text="Reject" textSize="18px" textColor="white" color="#aa3333" /> */}
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                else return (<></>)
                            }
                            )
                            : <></>
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}

export const AdminDashboardTABLET = (props) => {
    const navigate = useNavigate()

    if(props.user?.role !== UserRoles.PLATFORM_MANAGER) {
        navigate('/unauthorized')
    }
    return (
        <Grid container sx={{marginTop: "20px"}} columns={12} display={displayTypeFlex.tablet} justifyContent="center">
            <Grid container item md={12} height="fit-content" display="flex" justifyContent="center">
                <Grid item md={12} display="flex" justifyContent="center">
                    <AccountCircleIcon sx={{ fontSize: 120 }} />
                </Grid>
                <Grid item md={12} display="flex" justifyContent="center">
                    <Typography sx={{ fontFamily: "Unbounded" }} fontSize={24} display="flex" justifyContent="center">
                        <b>
                            {props?.user?.firstName + " " + props?.user?.lastName}
                        </b>
                    </Typography>
                </Grid>
                <Grid item md={12} display="flex" justifyContent="center">
                    <Typography fontSize={20} color="#666666">
                        {props?.user?.email}
                    </Typography>
                </Grid>
                <Grid item md={12} sx={{ marginTop: "12px" }} display="flex" justifyContent="center">
                    <Typography className="unselectable" fontSize={18} sx={{
                        backgroundColor: "white", color: "purple", borderColor: "purple",
                        borderStyle: "solid", borderWidth: "1px",
                        borderRadius: "18px", width: "fit-content",
                        padding: "4px 12px 4px 12px", fontFamily: "Unbounded",
                        fontWeight: "50"
                    }}>
                        <b>
                            {props?.user?.role === 0 ? "Hiker" : ""}
                            {props?.user?.role === 1 ? "Friend" : ""}
                            {props?.user?.role === 2 ? "Local guide" : ""}
                            {props?.user?.role === 3 ? "Platform manager" : ""}
                            {props?.user?.role === 4 ? "Hut worker" : ""}
                            {props?.user?.role === 5 ? "Emergency operator" : ""}
                        </b>
                    </Typography>
                </Grid>
                <Divider sx={{ marginTop: "18px", marginBottom: "18px" }}>
                    <Chip label="Add new weather condition" />
                </Divider>
                <Grid container item md={10} height="fit-content" sx={{ justifyContent: "center" }}>
                    <WeatherCard type="map" text="Create weather alert for a location" />
                    <WeatherCard type="hike" text="Create weather alert for a hike" />
                </Grid>
            </Grid>
            <Grid container item md={9} justifyContent="center" height="fit-content" sx={{ marginLeft: "auto", marginRight: "auto", marginBottom: "35px", marginTop: "25px" }}>
                <Grid item md={12}>
                    <Grid md={12}>
                        <Typography className="unselectable" fontSize={32}>
                            <b>Admin dashboard</b>
                        </Typography>
                    </Grid>
                    <Grid md={12}>
                        <Typography className="unselectable" fontSize={14} color="#555555">
                            Here, the platform manager is allowed to accept any sign up request for either local guides and hut workers.
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container md={12} item sx={{ marginTop: "14px", borderStyle: "solid", borderRadius: "15px", borderWidth: "1px", borderColor: "#bababa", width: "fit-content", display: "flex", justifyContent: "left" }}>
                    <Grid item md={12} style={{ display: "flex", justifyContent: "center", width: "fit-content" }}>
                        <FormControlLabel control={<Switch onChange={e => { props.setFilter({ 'hut': props.filter.hut, 'local': e.target.checked }) }} defaultChecked />} label="Show local guides requests" />
                    </Grid>
                    <Grid item md={12} style={{ display: "flex", justifyContent: "center", width: "fit-content" }}>
                        <FormControlLabel control={<Switch onChange={e => { props.setFilter({ 'hut': e.target.checked, 'local': props.filter.local }) }} defaultChecked />} label="Show hut workers requests" />
                    </Grid>
                </Grid>

                <Grid md={12} sx={{ marginTop: "28px" }}>
                    {
                        !props.loaded ?
                            <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid item style={{ marginTop: "50px" }} >
                                    <Typography variant="h5" md={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                                        Loading...
                                    </Typography>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <CircularProgress md={12} size="72px" />
                                    </div>
                                </Grid>
                            </Grid>
                            : <></>
                    }
                    {
                        props.loaded && props.listOfRequests.filter(x => {
                            if (x.role === 2 && props.filter.local) return x
                            if (x.role === 4 && props.filter.hut) return x
                        }).length === 0 ?
                            <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid item style={{ marginTop: "50px" }} >
                                    <Typography variant="h5" className="unselectable">
                                        {props.filter.hut && props.filter.local ? "There are no incoming requests." : "No request matching this filters."}
                                    </Typography>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        {
                                            props.filter.hut && props.filter.local ?
                                                <SentimentSatisfiedAltIcon md={12} sx={{ fontSize: "72px" }} />
                                                :
                                                <FilterAltOffIcon md={12} sx={{ fontSize: "72px" }} />
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                            : <></>
                    }
                    {
                        props.loaded && props.listOfRequests.filter(x => {
                            if (x.role === 2 && props.filter.local) return x
                            if (x.role === 4 && props.filter.hut) return x
                        }).length !== 0 ?
                            props.listOfRequests.filter(x => {
                                if (x.role === 2 && props.filter.local) return x
                                if (x.role === 4 && props.filter.hut) return x
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
                                                    <Grid item md={12}>
                                                        <Typography><b>Full name</b>: {request.firstName + " " + request.lastName}</Typography>
                                                    </Grid>
                                                    <Grid item md={12}>
                                                        <Typography><b>Role</b>: Local Guide</Typography>
                                                    </Grid>
                                                    <Grid item md={12}>
                                                        <Typography><b>Email</b>: {request.email}</Typography>
                                                    </Grid>
                                                    <Grid item md={12} sx={{ display: "flex", justifyContent: "right" }}>
                                                        {/* <div style={{ marginRight: "24px" }}> */}
                                                        <HTButton navigate={() => { props.acceptUser(request.id) }} text="Accept" textSize="18px" textColor="white" color="#33aa33" />
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
                                                    <Grid item md={12}>
                                                        <Typography><b>Full name</b>: {request.firstName + " " + request.lastName}</Typography>
                                                    </Grid>
                                                    <Grid item md={12}>
                                                        <Typography><b>Role</b>: Hut Worker</Typography>
                                                    </Grid>
                                                    <Grid item md={12}>
                                                        <Typography><b>Email</b>: {request.email}</Typography>
                                                    </Grid>
                                                    <Grid item md={12} sx={{ display: "flex", justifyContent: "right" }}>
                                                        <HTButton navigate={() => { props.acceptUser(request.id) }} text="Accept" textSize="18px" textColor="white" color="#33aa33" />
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                else return (<></>)
                            }
                            )
                            : <></>
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}

export const AdminDashboardMOBILE = (props) => {
    const navigate = useNavigate()
    
    if(props.user?.role !== UserRoles.PLATFORM_MANAGER) {
        navigate('/unauthorized')
    }
    return (
        <Grid container sx={{marginTop: "20px"}} columns={12} display={displayTypeFlex.mobile} justifyContent="center">
            <Grid container item xs={12} sm={12} height="fit-content" display="flex" justifyContent="center">
                <Grid item xs={12} sm={12} display="flex" justifyContent="center">
                    <AccountCircleIcon sx={{ fontSize: 120 }} />
                </Grid>
                <Grid item xs={12} sm={12} display="flex" justifyContent="center">
                    <Typography sx={{ fontFamily: "Unbounded", textAlign: "center" }} fontSize={24} display="flex" justifyContent="center">
                        <b>
                            {props?.user?.firstName + " " + props?.user?.lastName}
                        </b>
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} display="flex" justifyContent="center">
                    <Typography fontSize={20} color="#666666">
                        {props?.user?.email}
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} sx={{ marginTop: "12px" }} display="flex" justifyContent="center">
                    <Typography className="unselectable" fontSize={18} sx={{
                        backgroundColor: "white", color: "purple", borderColor: "purple",
                        borderStyle: "solid", borderWidth: "1px",
                        borderRadius: "18px", width: "fit-content",
                        padding: "4px 12px 4px 12px", fontFamily: "Unbounded",
                        fontWeight: "50"
                    }}>
                        <b>
                            {props?.user?.role === 0 ? "Hiker" : ""}
                            {props?.user?.role === 1 ? "Friend" : ""}
                            {props?.user?.role === 2 ? "Local guide" : ""}
                            {props?.user?.role === 3 ? "Platform manager" : ""}
                            {props?.user?.role === 4 ? "Hut worker" : ""}
                            {props?.user?.role === 5 ? "Emergency operator" : ""}
                        </b>
                    </Typography>
                </Grid>
                <Divider sx={{ marginTop: "18px", marginBottom: "18px" }}>
                    <Chip label="Add new weather condition" />
                </Divider>
                <Grid container item xs={10} sm={10} height="fit-content" sx={{ justifyContent: "center" }}>
                    <WeatherCard type="map" text="Create weather alert for a location" />
                    <WeatherCard type="hike" text="Create weather alert for a hike" />
                </Grid>
            </Grid>
            <Grid container item xs={10} justifyContent="center" height="fit-content" sx={{ marginBottom: "35px", marginTop: "18px" }}>
                <Grid item xs={12}>
                    <Grid xs={12}>
                        <Typography className="unselectable" fontSize={24} textAlign={"center"}>
                            <b>Admin dashboard</b>
                        </Typography>
                    </Grid>
                    <Grid xs={12}>
                        <Typography className="unselectable" fontSize={14} color="#555555" textAlign={"center"}>
                            Here, the platform manager is allowed to accept any sign up request for either local guides and hut workers.
                        </Typography>
                    </Grid>
                </Grid>

                <Grid container item xs={12} sx={{ padding: "8px", marginTop: "14px", borderStyle: "solid", borderRadius: "15px", borderWidth: "1px", borderColor: "#bababa", display: "flex", justifyContent: "center" }}>
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <FormControlLabel control={<Switch onChange={e => { props.setFilter({ 'hut': props.filter.hut, 'local': e.target.checked }) }} defaultChecked />} label="Show local guides requests" />
                    </Grid>
                    <Divider variant="middle" sx={{ borderBottomWidth: 4 }} />
                    <Grid item xs={12} style={{ display: "flex", justifyContent: "center" }}>
                        <FormControlLabel control={<Switch onChange={e => { props.setFilter({ 'hut': e.target.checked, 'local': props.filter.local }) }} defaultChecked />} label="Show hut workers requests" />
                    </Grid>
                </Grid>

                <Grid xs={12} sx={{ marginTop: "28px" }}>
                    {
                        !props.loaded ?
                            <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid item style={{ marginTop: "50px" }} >
                                    <Typography variant="h5" xs={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                                        Loading...
                                    </Typography>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        <CircularProgress xs={12} size="72px" />
                                    </div>
                                </Grid>
                            </Grid>
                            : <></>
                    }
                    {
                        props.loaded && props.listOfRequests.filter(x => {
                            if (x.role === 2 && props.filter.local) return x
                            if (x.role === 4 && props.filter.hut) return x
                        }).length === 0 ?
                            <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid item style={{ marginTop: "50px" }} >
                                    <Typography variant="h5" className="unselectable">
                                        {props.filter.hut && props.filter.local ? "There are no incoming requests." : "No request matching this filters."}
                                    </Typography>
                                    <div style={{ display: "flex", justifyContent: "center" }}>
                                        {
                                            props.filter.hut && props.filter.local ?
                                                <SentimentSatisfiedAltIcon xs={12} sx={{ fontSize: "72px" }} />
                                                :
                                                <FilterAltOffIcon xs={12} sx={{ fontSize: "72px" }} />
                                        }
                                    </div>
                                </Grid>
                            </Grid>
                            : <></>
                    }
                    {
                        props.loaded && props.listOfRequests.filter(x => {
                            if (x.role === 2 && props.filter.local) return x
                            if (x.role === 4 && props.filter.hut) return x
                        }).length !== 0 ?
                            props.listOfRequests.filter(x => {
                                if (x.role === 2 && props.filter.local) return x
                                if (x.role === 4 && props.filter.hut) return x
                            }).map(request => {
                                if (request.role === 2) // local guide
                                    return (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                                    {request.firstName + " " + request.lastName}
                                                </Typography>
                                                {/* <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}><GroupsIcon sx={{ marginRight: "20px" }} />Local guide</Typography> */}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <Typography><b>Full name</b>: {request.firstName + " " + request.lastName}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography><b>Role</b>: Local Guide</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography><b>Email</b>: {request.email}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "right", marginTop: "10px" }}>
                                                        {/* <div style={{ marginRight: "24px" }}> */}
                                                        <HTButton navigate={() => { props.acceptUser(request.id) }} text="Accept" textSize="18px" textColor="white" color="#33aa33" />
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
                                                {/* <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}><BadgeIcon sx={{ marginRight: "20px" }} />Hut worker</Typography> */}
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container>
                                                    <Grid item xs={12}>
                                                        <Typography><b>Full name</b>: {request.firstName + " " + request.lastName}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography><b>Role</b>: Hut Worker</Typography>
                                                    </Grid>
                                                    <Grid item xs={12}>
                                                        <Typography><b>Email</b>: {request.email}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sx={{ display: "flex", justifyContent: "right", marginTop: "10px" }}>
                                                        {/* <div style={{ marginRight: "24px" }}> */}
                                                        <HTButton navigate={() => { props.acceptUser(request.id) }} text="Accept" textSize="18px" textColor="white" color="#33aa33" />
                                                        {/* </div> */}
                                                        {/* <HTButton text="Reject" textSize="18px" textColor="white" color="#aa3333" /> */}
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    )
                                else return (<></>)
                            }
                            )
                            : <></>
                    }
                </Grid>
            </Grid>
        </Grid>
    )
}