
{/*import { Grid, Switch, Typography, CircularProgress, Paper, Divider } from "@mui/material";
import { displayTypeFlex } from "../../extra/DisplayType";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import '../admin-dashboard/admin-dashboard-style.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FilterAltOffIcon from '@mui/icons-material/FilterAltOff';
import BadgeIcon from '@mui/icons-material/Badge';
import GroupsIcon from '@mui/icons-material/Groups';
import HTButton from "../../components/buttons/Button";
import { FormControlLabel } from "@mui/material";
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';



const HikesLinked = (props) => {
    return (
        <Grid container columns={12} display={displayTypeFlex.pc} justifyContent="center" style={{ marginTop: "105px" }}>
            
            <Grid container item lg={8} xl={6} justifyContent="center" height="fit-content" sx={{ marginLeft: "25px", marginBottom: "35px" }}>
                <Grid item lg={6} xl={6}>
                    <Grid lg={12} xl={12}>
                        <Typography className="unselectable" fontSize={32}>
                            <b>Hikes Linked</b>
                        </Typography>
                    </Grid>
                    <Grid lg={12} xl={12}>
                        <Typography className="unselectable" fontSize={14} color="#555555">
                            Here are the hikes linked to your hut
                        </Typography>
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
                        props.loaded && props.hikesUpdatable.length === 0 ?
                            <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                <Grid item style={{ marginTop: "50px" }} >
                                    <Typography variant="h5" className="unselectable">
                                        {props.hikesUpdatable.length === 0  &&  "There are no hikes linked to your hut"}
                                    </Typography>
                                </Grid>
                            </Grid>
                            : <></>
                    }
                    {
                        props.loaded && props.hikesUpdatable.length !== 0 ?
                            props.hikesUpdatable.map(hike => {
                                    return (
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                                    {hike.name}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Description</b>: {hike.description}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Length</b>: {hike.length}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Ascent</b>: {hike.ascent}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Expected time</b>: {hike.expectedTime}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Hike condition</b>: {hike.condition}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12}>
                                                        <Typography><b>Cause</b>: {hike.cause}</Typography>
                                                    </Grid>
                                                    <Grid item lg={12} xl={12} sx={{ display: "flex", justifyContent: "right" }}>
                                                        {/* <div style={{ marginRight: "24px" }}> */}
                                                        {/*<HTButton onClick={() => { props.setModifyHut(true) }} text="Accept" textSize="18px" textColor="white" color="#33aa33" />*/}
                                                        {/* </div> */}
                                                        {/* <HTButton text="Reject" textSize="18px" textColor="white" color="#aa3333" /> */}
                                                        {/*
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
    )
}

export {HikesLinked}
*/}