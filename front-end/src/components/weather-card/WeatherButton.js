import { Grid, SvgIcon, Typography } from "@mui/material"

const WeatherButton = (props) => {
    return (
        <Grid container item sx={{
            width: "fit-content", borderStyle: "solid", borderRadius: "24px",
            borderWidth: "1px", paddingLeft: "8px", paddingRight: "8px", paddingBottom: "2px", paddingTop: "2px",
            "&:hover": {
                backgroundColor: "#f5f5f5", borderColor: "purple", color: "purple"
            }
        }}>
            <SvgIcon component={props.image} /><Typography className="unselectable" sx={{marginLeft: "5px"}}>{props.text}</Typography>
        </Grid>
    )
}

export default WeatherButton