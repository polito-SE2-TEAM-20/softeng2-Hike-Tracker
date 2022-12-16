import { Grid, SvgIcon, Typography, Button } from "@mui/material"
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PlaceIcon from '@mui/icons-material/Place';
import { useState, useEffect } from "react";
import API from "../../API/API";
import { HikeWeatherByCode, HikeWeatherByName } from '../../lib/common/WeatherConditions'
import {CircularProgress} from "@mui/material";

const WeatherAlertHike = (props) => {
    const [listOfHikes, setListOfHikes] = useState([])
    const [loaded, setLoaded] = useState(false)
    const [accordionExpanded, setAccordionExpanded] = useState(-1)

    const handleAccordionExpansion = (hikeID) => (_, isExpanded) => {
        setAccordionExpanded(isExpanded ? hikeID : false)
    }

    useEffect(() => {
        var loh = []
        const getHikes = async () => {
            loh = await API.getFilteredListOfHikes({})
        }
        getHikes().then(() => {
            setListOfHikes(loh)
            setLoaded(true)
        });
    }, [])

    return (
        <Grid sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }} container item xs={12} sm={12} md={12} lg={12} xl={12}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography sx={{ fontFamily: "Unbounded" }} fontSize={{ xs: 20, sm: 20, md: 28, lg: 32, xl: 32 }} display="flex" justifyContent="center">
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
                                console.log(hike)
                                return (
                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                        <Accordion expanded={accordionExpanded === hike.id} onChange={handleAccordionExpansion(hike.id)}>
                                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                                <Typography sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                                    {hike.title}
                                                </Typography>
                                                <Typography sx={{ fontSize: "18px", color: 'text.secondary' }}><PlaceIcon />{hike.city}</Typography>
                                            </AccordionSummary>
                                            <AccordionDetails>
                                                <Grid container>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                                                        <Typography><b>Current weather</b>: Sunny <SvgIcon component={HikeWeatherByCode[1].image} /></Typography>
                                                    </Grid>
                                                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "right" }}>
                                                        <Button variant="outlined" sx={{ borderRadius: "60px", textTransform: "none" }}>Update weather conditions</Button>
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