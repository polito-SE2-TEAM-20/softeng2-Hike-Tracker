import { Grid, Paper } from "@mui/material";
import { useNavigate } from "react-router";
import HTNavbar from "../../components/HTNavbar/HTNavbar";

const ShowHike = (props) => {
    const navigate = useNavigate()

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    return (
        <Grid container>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <Grid style={{marginTop: "105px", marginLeft: "15px", marginBottom: "25px"}} item lg={4}>
                <Paper style={{padding: "30px", heigth: "100vh"}}>
                    <Grid container>
                        <Grid item>
                            <p>asndfaiodjapsdasdas</p>
                        </Grid>
                        <Grid item>
                            <p>asndfaiodjapsdasdas</p>
                        </Grid>
                        <Grid item>
                            <p>asndfaiodjapsdasdas</p>
                        </Grid>
                        <Grid item>
                            <p>asndfaiodjapsdasdas</p>
                        </Grid>
                        <Grid item>
                            <p>asndfaiodjapsdasdas</p>
                        </Grid>
                    </Grid>
                </Paper>
            </Grid>
            <Grid item lg={9}>

            </Grid>
        </Grid>
    );
}

export default ShowHike;