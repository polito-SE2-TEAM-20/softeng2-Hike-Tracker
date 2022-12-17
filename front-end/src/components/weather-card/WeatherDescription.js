import { Grid, TextField } from "@mui/material"

const WeatherDescription = (props) => {
    return (
        <Grid container item sx={{
            width: "100%", paddingLeft: "8px", paddingRight: "8px", paddingBottom: "2px", paddingTop: "2px", marginBottom:"10px"
        }}>
            <TextField multiline sx={{width: "100%", marginLeft: "28px", marginRight: "28px"}} variant="standard" label="Description of the weather conditions (optional)" />
        </Grid>
    )
}

export default WeatherDescription