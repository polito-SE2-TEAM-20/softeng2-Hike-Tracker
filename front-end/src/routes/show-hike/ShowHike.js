import { Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useMatch } from "react-router-dom";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import touristIcon from '../../Assets/tourist-icon.png'
import hikerIcon from '../../Assets/hiker-icon.png'
import proIcon from '../../Assets/pro-icon.png'
import { useEffect, useState } from "react";
import API from '../../API/API.js';
import { Skeleton } from "@mui/material";
import {fromMinutesToHours} from '../../lib/common/FromMinutesToHours'

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

    return (
        <Grid container style={{ minHeight: "100vh", height: "100%" }}>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <Grid style={{ marginTop: "105px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "40vh" }} item lg={3}>
                <Paper style={{ padding: "30px", height: "50vh" }}>
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
                </Paper>
            </Grid>
            <Grid style={{ marginTop: "105px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "80vh", paddingLeft: "25px", paddingRight: "25px" }} item lg={6}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    {
                        !loading ? <Typography variant="h2">{hike.title}</Typography> :
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
        </Grid>
    );
}

export default ShowHike;