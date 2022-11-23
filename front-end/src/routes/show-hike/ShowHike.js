import { Grid } from "@mui/material";
import HTNavbar from "../../components/HTNavbar/HTNavbar";

const ShowHike = (props) => {
    return(
        <Grid container>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <Grid item lg={4}>

            </Grid>
            <Grid item lg={9}>
                
            </Grid>
        </Grid>
    );
}

export default ShowHike;