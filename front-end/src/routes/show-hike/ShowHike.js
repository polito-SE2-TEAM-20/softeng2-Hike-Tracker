import { Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import touristIcon from '../../Assets/tourist-icon.png'
import hikerIcon from '../../Assets/hiker-icon.png'
import proIcon from '../../Assets/pro-icon.png'

const ShowHike = (props) => {
    const navigate = useNavigate()

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    return (
        <Grid container style={{ minHeight: "100vh", height: "100%" }}>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <Grid style={{ marginTop: "105px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "40vh" }} item lg={3}>
                <Paper style={{ padding: "30px", height: "50vh" }}>
                    <Grid item lg={12}>
                        <Typography variant="h4">General information</Typography>
                    </Grid>
                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Where" />
                    </Divider>

                    <Grid item lg={12}>
                        <Typography>Region: 12.5km</Typography>
                    </Grid>
                    <Grid item lg={12}>
                        <Typography>Province: 12.5km</Typography>
                    </Grid>

                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="About" />
                    </Divider>

                    <Grid item lg={12}>
                        <Typography>Length: 12.5km</Typography>
                    </Grid>
                    <Grid item lg={12}>
                        <Typography>Expected time: 12.5km</Typography>
                    </Grid>
                    <Grid item lg={12}>
                        <Typography>Ascent: 12.5km</Typography>
                    </Grid>
                </Paper>
            </Grid>
            <Grid style={{ marginTop: "105px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "80vh", paddingLeft: "25px", paddingRight: "25px" }} item lg={6}>
                <Grid item lg={12} style={{display: "flex", justifyContent: "center", marginBottom: "15px"}}>
                    <Typography variant="h2">Supa dupa title</Typography>
                </Grid>
                <Grid item lg={12}>
                    <Divider>
                        {
                            props.difficulty == 0 ?
                                <>
                                    <img src={touristIcon} alt="tourist" width="30px" height="30px" />
                                    <div style={{ backgroundColor: "#55B657", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Tourist</b></div>
                                </>
                                : <></>
                        }
                        {
                            props.difficulty == 1 ?
                                <>
                                    <img src={hikerIcon} alt="tourist" width="30px" height="30px" />
                                    <div style={{ backgroundColor: "#1a79aa", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Hiker</b></div>
                                </>
                                : <></>

                        }
                        {
                            props.difficulty == 2 ?
                                <>
                                    <img src={proIcon} alt="tourist" width="30px" height="30px" />
                                    <div style={{ backgroundColor: "#FA6952", color: "white", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Pro</b></div>
                                </>
                                : <></>

                        }
                    </Divider>
                </Grid>
                <Grid item lg={12} style={{ marginTop: "30px" }}>
                    <Typography variant="h4">Some informations on this hike</Typography>
                </Grid>
                <Grid item lg={12}>
                    <Typography>Length: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5kmLength: 12.5km</Typography>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ShowHike;