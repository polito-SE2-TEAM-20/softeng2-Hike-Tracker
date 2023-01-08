import { Grid, Typography } from "@mui/material"
import { useNavigate } from "react-router"
import weatherHike from '../../Assets/weather-hike.png'
import weatherMap from '../../Assets/weather-map.png'

const WeatherCard = (props) => {
    const navigate = useNavigate()
    const handleNavigateWeather = () => {
        if (props.type === "map") {
            navigate("/new-weather-alert-map")
        }
        else {
            navigate("/new-weather-alert-hike")
        }
    }
    return (
        <Grid container item xs={7} sm={7} md={7} lg={12} xl={12} sx={{
            borderStyle: "solid", borderWidth: "1px", borderRadius: "24px 0px 12px 0px", borderColor: "#4c4c4c",
            width: "fit-content", height: "fit-content", marginBottom: "8px", "&:hover": {
                backgroundColor: "#f5f5f5", borderColor: "purple", color: "purple"
            }
        }}
            onClick={handleNavigateWeather}
        >
            <Grid item sx={{ marginTop: "5px", marginBottom: "5px", marginLeft: "24px", marginRight: "24px" }}>
                <Grid item sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {
                        props.type === "map" ?
                            <img src={weatherMap} alt="weatherMap" width="30px" height="auto" /> :
                            <img src={weatherHike} alt="weatherHike" width="24px" height="auto" />
                    }

                    <Typography className="unselectable" sx={{ fontFamily: "Unbounded", marginLeft: "12px" }} fontSize={16} textAlign="left">
                        {props.text}
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default WeatherCard