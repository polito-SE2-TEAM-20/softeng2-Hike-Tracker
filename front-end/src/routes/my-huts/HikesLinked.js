import { Grid, Typography, CircularProgress } from "@mui/material";
import '../admin-dashboard/admin-dashboard-style.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HTButton from "../../components/buttons/Button";
import API from '../../API/API.js';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fromMinutesToHours } from '../../lib/common/FromMinutesToHours'
import {UserRoles} from '../../lib/common/UserRoles'


const HikesLinked = (props) => {

    const [loaded, setLoaded] = useState(false);
    const [hikesUpdatable, setHikesUpdatable] = useState([]);

    const navigate = useNavigate()

    useEffect(() => {
        setLoaded(false);

        API.getHikesUpdatableHutWorker()
            .then((hikes) => {
                setHikesUpdatable(oldHikes => hikes);
                setLoaded(true);
                console.log(hikes);
                console.log(hikesUpdatable);
            })

    }, [])

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    if (
        props.user?.role !== UserRoles.HUT_WORKER) {
        navigate('/unauthorized')
    }

    return (
        <>
            <Grid container columns={12} display="flex" justifyContent="center" style={{ marginTop: "105px" }}>
                {console.log(hikesUpdatable)}
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
                            !loaded ?
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
                            loaded && hikesUpdatable.length === 0 ?
                                <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                                    <Grid item style={{ marginTop: "50px" }} >
                                        <Typography variant="h5" className="unselectable">
                                            {hikesUpdatable.length === 0 && "There are no hikes linked to your hut"}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                : <></>
                        }
                        {
                            loaded && hikesUpdatable.length !== 0 ?
                                hikesUpdatable.map((hike, index) => {
                                    return (
                                        <Accordion sx={{ ml: "20px", mr: "80px" }}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                                    {hike.title}
                                                </Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Description</b>: {hike.description}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Length</b>: {hike.length === "" ? "N/A" : (Math.round(hike.length * 10) / 10000).toFixed(2)}km</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Ascent</b>: {hike.ascent === "" ? "N/A" : hike.ascent}m</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Expected time</b>: {hike.expectedTime === "" ? "N/A" : fromMinutesToHours(hike.expectedTime)}</Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Hike condition</b>: <ConditionShow hike={hike} index={index} /></Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <><Typography><b>Cause:</b> {(hike.cause !== '' && hike.cause !== null && hike.cause !== undefined) ? hike.cause : 'N/A'}</Typography>
                                                        </>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "right", mt: 10 }}>
                                                        <HTButton navigate={() => { navigate(`/modifyHikeCondition/${hike.id}`) }} text="Modify hike condition" textSize="18px" textColor="white" color="#33aa33" />
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
    )
}

export { HikesLinked }


function ConditionShow(props) {
    return <>
        {props.hike.condition === 0 &&
            <>Open</>
        }
        {props.hike.condition === 1 &&
            <>Closed</>
        }
        {props.hike.condition === 2 &&
            <>Partially blocked</>
        }
        {props.hike.condition === 3 &&
            <>Special gear required</>
        }
        {
            (props.hike.condition === null || props.hike.condition === '' || props.hike.condition === undefined) &&
            <>N/A</>
        }

    </>
}

export { ConditionShow }
