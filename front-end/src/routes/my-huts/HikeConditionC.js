import { useMatch } from "react-router-dom";
import { Grid, Typography, Skeleton } from "@mui/material";
import '../admin-dashboard/admin-dashboard-style.css'
import HTButton from "../../components/buttons/Button";
import API from '../../API/API.js';
import TextField from '@mui/material/TextField';
import { FormControl, MenuItem, Select } from "@mui/material";
import { Chip, Divider, Paper } from "@mui/material";
import { useNavigate } from "react-router";
import React, { useState, useEffect } from 'react';
import { fromMinutesToHours } from '../../lib/common/FromMinutesToHours'
import Alert from '@mui/material/Alert';
import { PopupEditCondition } from "./PopupEditCondition";
import {UserRoles} from '../../lib/common/UserRoles'

function HikeCondition(props) {

    
    const match = useMatch('/modifyHikeCondition/:hikeid');
    const hikeId = match.params.hikeid ? match.params.hikeid : -1;


    const [hike, setHike] = useState({ title: "", description: "", region: "", province: "", length: "", expectedTime: "", ascent: "", difficulty: "", cause: "", condition: "" })
    const [loading, setLoading] = useState(true);
    const [cause, setCause] = useState('');
    const [hikeCondition, setHikeCondition] = useState('');
    const [show, setShow] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [err, setErr] = useState(null);
    const [open, setOpen] = useState(false);
const navigate = useNavigate();
    useEffect(() => {
        let tmpHike = { title: "", description: "", region: "", province: "", length: "", expectedTime: "", ascent: "", difficulty: -1, cause: "", condition: "" }
        
        const getHike = async () => {
            tmpHike = await API.getSingleHikeByID(hikeId)
        }
        getHike().then(() => {
            setHike(tmpHike)
            setLoading(false)
            setCause(tmpHike.cause);
            setHikeCondition(tmpHike.condition);
        })
    }, [])


    const modifyHike = () => {

        if (hikeCondition === '' || hikeCondition === null || hikeCondition === undefined) {
            setErrorMessage("specify a condition for the hike");
            setShow(true);
        } else if ((hikeCondition == 1 || hikeCondition == 2 || hikeCondition == 3) && (cause === '' || cause === null || cause === undefined)) {
            setErrorMessage("specify a cause for the condition");
            setShow(true);
        } else {
            let object = { condition: hikeCondition, cause: cause };
            
            props.updateHikeCondition(object, hikeId)
                .then(updatedHike => {
                    console.log("ciao");
                    console.log(updatedHike.id)
                    setOpen(true);
                    setErr(null);
                })
                .catch((err) => {
                    setOpen(true);
                    setErr(err);

                })
        }

    }



    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    if (
        props.user?.role !== UserRoles.HUT_WORKER) {
        navigate('/unauthorized')
    }
    return (
        <Grid container style={{ minHeight: "100vh", height: "100%" }}>
            {
                <PopupEditCondition id={hikeId} err={err} open={open} setOpen={setOpen} />
            }
            <Grid style={{ marginTop: "105px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "80vh" }} item lg={3}>
                <Paper style={{ padding: "30px", height: "80vh" }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography variant="h4">{hike.title}</Typography> :
                                <Skeleton variant='rectangular' height={50} width={600} style={{ marginBottom: "10px" }} />
                        }                    </Grid>
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
                            !loading ? 
                            <Typography>Province: {hike.province === "" ? "N/A" : hike.province}</Typography> :
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
                        <Chip label="Hike Condition" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Condition: <ConditionSelect hike={hike} hikeCondition={hikeCondition} setHikeCondition={setHikeCondition} /></Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ?
                                <><Typography>Cause:</Typography>
                                    <TextField required fullWidth variant="standard"
                                        value={cause}
                                        onChange={ev => setCause(ev.target.value)}

                                    ></TextField>
                                </> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "right", mt: 2 }}>
                        <HTButton navigate={() => { modifyHike() }} text="Modify hike condition" textSize="18px" textColor="white" color="#33aa33" />
                    </Grid>
                </Paper>
                {
                    show ?
                        <Alert sx={{ mt: 3, mb: 3 }} variant="outlined" severity="error" onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
                }
            </Grid>

        </Grid>
    );


}

export {HikeCondition}



function ConditionSelect(props) {
    return (<>

        <FormControl fullWidth required>
            <Select
                labelId="demo-simple-select-label"
                id="demo-seimple-select"
                value={props.hikeCondition}
                fullWidth
                variant="standard"
                onChange={ev => props.setHikeCondition(ev.target.value)}
            >
                <MenuItem value={0}>
                    Open
                </MenuItem>
                <MenuItem value={1}>
                    Closed
                </MenuItem>
                <MenuItem value={2}>
                    Partially Blocked
                </MenuItem>
                <MenuItem value={3}>
                    Special gear required
                </MenuItem>
            </Select>
        </FormControl>
    </>);
}

