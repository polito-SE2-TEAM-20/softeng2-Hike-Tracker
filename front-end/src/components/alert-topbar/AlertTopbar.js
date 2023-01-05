import { Grid, Typography } from "@mui/material"

const AlertTopbar = (props) => {
    return(
        <Grid container sx={{width: "100vw", backgroundColor: "red", color: "white"}}>
            <Typography>
                Alert
            </Typography>
        </Grid>
    )
}

export default AlertTopbar