import { Grid, Typography } from "@mui/material"

const WeatherAlertMap = (props) => {
    return(
        <Grid sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }} container item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography sx={{ fontFamily: "Unbounded" }} fontSize={32} display="flex" justifyContent="center">
                    <b>
                        Weather alert for location
                    </b>
                </Typography>
            </Grid>
        </Grid>
    )
}

export default WeatherAlertMap