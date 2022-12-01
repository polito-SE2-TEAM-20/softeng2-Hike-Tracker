import { CircularProgress, Typography } from "@mui/material";
import { Grid } from "@mui/material";

const MapLoading = () => {
    return (
        <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
            <Grid item style={{ marginTop: "300px" }} >
                <Typography lg={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    The map is loading...
                </Typography>
                <div style={{display: "flex", justifyContent: "center"}}>
                    <CircularProgress lg={12} size="72px" />
                </div>
            </Grid>
        </Grid>
    );
}

export default MapLoading;