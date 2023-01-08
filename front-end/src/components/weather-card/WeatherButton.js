import { Grid, SvgIcon, Typography } from "@mui/material"
import { HikeWeatherByCode } from '../../lib/common/WeatherConditions'

const WeatherButton = (props) => {
    return (
        <Grid container item sx={{
            width: "fit-content", borderStyle: "solid", borderRadius: "24px",
            borderWidth: "1px", paddingLeft: "8px", paddingRight: "8px", paddingBottom: "2px", paddingTop: "2px",
            backgroundColor: props.selected ? "#f5f5f5" : "white", borderColor: props.selected ? "purple" : "#1a1a1a",
            color: props.selected ? "purple" : "#1a1a1a",
            "&:hover": {
                backgroundColor: "#f5f5f5", borderColor: "purple", color: "purple"
            }
        }}
            onClick={() => props.setStatus(props.buttonType)}
        >
            <SvgIcon component={HikeWeatherByCode[props.buttonType].image} /><Typography className="unselectable" sx={{ marginLeft: "5px" }}>{HikeWeatherByCode[props.buttonType].name}</Typography>
        </Grid>
    )
}

export default WeatherButton