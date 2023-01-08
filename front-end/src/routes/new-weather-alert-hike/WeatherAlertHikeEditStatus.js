import { Grid, SvgIcon, Typography, Button } from "@mui/material"
import { HikeWeatherByCode } from "../../lib/common/WeatherConditions"
import WeatherButton from "../../components/weather-card/WeatherButton"
import WeatherDescription from "../../components/weather-card/WeatherDescription"
import { useMatch } from "react-router"
import { useState, useEffect } from "react"
import API from "../../API/API"
import { WeatherPopup } from "./WeatherPopup"
import { UserRoles } from "../../lib/common/UserRoles"
import { useNavigate } from "react-router"

const WeatherAlertHikeEditStatus = (props) => {
    const match = useMatch('/weather-status-edit/:hikeid')
    const hikeid = (match && match.params && match.params.hikeid) ? match.params.hikeid : -1
    const [hike, setHike] = useState({})
    const [loaded, setLoaded] = useState(false)
    const [status, setStatus] = useState(0)
    const [description, setDescription] = useState("")
    const navigate = useNavigate()

    // states for the popup after adding a new hike
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {
        const apiWeatherUpdate = async () => {
            await API.updateWeatherSingleHike({
                hikeID: hikeid,
                weatherInfo: {
                    weatherStatus: status,
                    weatherDescription: description
                }
            })
        }
        apiWeatherUpdate().then(() => setOpen(true))
    }

    useEffect(() => {
        let tmpHike = {}

        const getHike = async () => {
            tmpHike = await API.getSingleHikeByID(hikeid)
        }
        getHike().then(() => {
            setHike(tmpHike)
            setStatus(tmpHike.weatherStatus)
            setDescription(tmpHike.weatherDescription)
            setLoaded(true)
        })
    }, [])

    if (!loaded) {
        return (
            <></>
        )
    }

    if(props.user?.role !== UserRoles.PLATFORM_MANAGER) {
        navigate('/unauthorized')
    }
    return (
        <Grid container sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }} >
            <WeatherPopup open={open} setOpen={setOpen} />
            <Grid container item xs={8} sm={8} md={8} lg={8} xl={8}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    <Typography variant="h2" sx={{ fontFamily: "Unbounded" }}>{hike.title}</Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography><b>Current weather</b>: {HikeWeatherByCode[hike.weatherStatus].name} <SvgIcon component={HikeWeatherByCode[hike.weatherStatus].image} /></Typography>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography><b>Current description</b>: {description === "" ? "not provided" : hike.weatherDescription}</Typography>
                </Grid>
                <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} sx={{
                    display: "flex",
                    justifyContent: "left",
                    marginTop: "24px"
                }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginBottom: "8px" }}>
                        <Typography><b>Set new weather clicking on the following buttons</b></Typography>
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ marginBottom: "8px" }}>
                        <WeatherButton selected={status === 0} setStatus={setStatus} buttonType={0} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ marginBottom: "8px" }}>
                        <WeatherButton selected={status === 1} setStatus={setStatus} buttonType={1} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ marginBottom: "8px" }}>
                        <WeatherButton selected={status === 2} setStatus={setStatus} buttonType={2} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ marginBottom: "8px" }}>
                        <WeatherButton selected={status === 3} setStatus={setStatus} buttonType={3} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ marginBottom: "8px" }}>
                        <WeatherButton selected={status === 4} setStatus={setStatus} buttonType={4} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ marginBottom: "8px" }}>
                        <WeatherButton selected={status === 5} setStatus={setStatus} buttonType={5} />
                    </Grid>
                    <Grid item xs={12} sm={6} md={6} lg={6} xl={6} sx={{ marginBottom: "8px" }}>
                        <WeatherButton selected={status === 6} setStatus={setStatus} buttonType={6} />
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginBottom: "8px", marginTop: "24px" }}>
                        <Typography><b>Set a new description for the weather status (optional)</b></Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginBottom: "8px" }}>
                        <WeatherDescription description={description} setDescription={setDescription} hikeID={hike.id} />
                    </Grid>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginTop: "30px" }}>
                    <Button onClick={handleSubmit} variant="outlined" sx={{ borderRadius: "60px", textTransform: "none", backgroundColor: "#1a1a1a", color: "white", "&:hover": { backgroundColor: "#3f3f3f" } }}>Update weather conditions</Button>
                </Grid>
            </Grid>
        </Grid>
    )
}

export default WeatherAlertHikeEditStatus