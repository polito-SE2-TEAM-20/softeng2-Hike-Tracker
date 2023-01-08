import { Grid, TextField } from "@mui/material"

const WeatherDescription = (props) => {
    return (
        <Grid container item sx={{
            width: "100%", paddingLeft: "8px", paddingRight: "8px", paddingBottom: "2px", paddingTop: "2px", marginBottom: "10px"
        }}>
            <TextField
                value={props.description}
                onChange={e => props.setDescription(e.target.value)}
                multiline
                sx={{ width: "100%" }}
                variant="standard"
                label="Description of the weather conditions (optional)" />
        </Grid>
    )
}

export default WeatherDescription