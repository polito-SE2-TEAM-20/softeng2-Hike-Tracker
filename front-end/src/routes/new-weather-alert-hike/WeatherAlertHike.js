import { Grid, SvgIcon, Typography, Button } from "@mui/material"
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaceIcon from '@mui/icons-material/Place';
import { useState, useEffect } from "react";
import API from "../../API/API";
import { HikeWeatherByCode } from '../../lib/common/WeatherConditions'
import { CircularProgress } from "@mui/material";
import { useNavigate } from "react-router";
import { UserRoles } from "../../lib/common/UserRoles";

const WeatherAlertHike = (props) => {
    const [listOfHikes, setListOfHikes] = useState([])
    const [loaded, setLoaded] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        var loh = []
        const getHikes = async () => {
            loh = await API.getFilteredListOfHikes({})
        }
        getHikes().then(() => {
            setListOfHikes(loh)
            setLoaded(true)
            console.log(listOfHikes)
        });
    }, [])

    if (props.user?.role !== UserRoles.PLATFORM_MANAGER) {
        navigate('/unauthorized')
    }
    return (
        <Grid sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }} container item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography className="unselectable" sx={{ fontFamily: "Unbounded" }} fontSize={{ xs: 20, sm: 20, md: 28, lg: 32, xl: 32 }} display="flex" justifyContent="center">
                    <b>
                        Weather alert for hikes
                    </b>
                </Typography>
            </Grid>
            {
                !loaded ?
                    <Grid container style={{ marginTop: "0px", width: "auto", minHeight: "100vh", height: "100%", display: "flex", justifyContent: "center" }}>
                        <Grid item style={{ marginTop: "80px" }} >
                            <Typography lg={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                                Loading...
                            </Typography>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                <CircularProgress lg={12} size="72px" />
                            </div>
                        </Grid>
                    </Grid>
                    :
                    <Grid container item spacing={1} sx={{ width: { xs: "300px", sm: "500px", md: "500px", lg: "1200px", xl: "1200px" }, marginTop: "10px", marginBottom: "50px" }}>
                        {
                            listOfHikes.map(hike => {
                                return (
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        {/* <Accordion expanded={accordionExpanded === hike.id} onChange={handleAccordionExpansion(hike.id)}> */}
                                        <Accordion>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                                    {hike.title}
                                                </Typography>
                                                <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}><PlaceIcon />{hike.city}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Current weather</b>: {HikeWeatherByCode[hike.weatherStatus].name} <SvgIcon component={HikeWeatherByCode[hike.weatherStatus].image} /></Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Current description</b>: {hike.weatherDescription === "" ? "not provided" : hike.weatherDescription}</Typography>
                                                    </Grid>
                                                    <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} sx={{
                                                        display: "flex",
                                                        justifyContent: "left"
                                                    }}>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                                                        <Button onClick={() => { navigate("/weather-status-edit/" + hike.id) }} variant="filled" sx={{ borderRadius: "60px", textTransform: "none", backgroundColor: "#1a1a1a", color: "white", "&:hover": { backgroundColor: "#3f3f3f" } }}>Go to update conditions page</Button>
                                                    </Grid>
                                                </Grid>
                                            </AccordionDetails>
                                        </Accordion>
                                    </Grid>
                                )
                            })
                        }
                    </Grid>
            }

        </Grid>
    )
}

export default WeatherAlertHike