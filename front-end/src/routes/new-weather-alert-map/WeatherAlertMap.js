import { Button, Grid, Tooltip, Typography } from "@mui/material"
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup, ZoomControl, Polyline, useMap } from 'react-leaflet'
import { useState, useEffect } from "react"
import L from 'leaflet';
import HikePopup from '../../components/hike-popup/HikePopup';
import { EditControl } from 'react-leaflet-draw'
import API from '../../API/API'
import MapLoading from "../../components/map/MapLoading";
import WeatherButton from "../../components/weather-card/WeatherButton";
import WeatherDescription from "../../components/weather-card/WeatherDescription";
import { WeatherPopupMap } from "./WeatherPopupMap";
import { useNavigate } from "react-router";
import { UserRoles } from "../../lib/common/UserRoles";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const WeatherAlertMap = (props) => {
    const [loaded, setLoaded] = useState(false)
    const [listOfHikes, setListOfHikes] = useState([])
    const [hike2Positions, setHike2Positions] = useState([])
    const [geospacialData, setGeospacialData] = useState([[-1.0, -1.0], -1.0])
    const [status, setStatus] = useState(0)
    const [description, setDescription] = useState("")
    const navigate = useNavigate()

    // states for the popup after adding a new hike
    const [open, setOpen] = useState(false);

    const handleSubmit = () => {
        const apiWeatherUpdate = async () => {
            await API.updateWeatherMap({
                weatherInfo: {
                    lat: geospacialData[0][0],
                    lon: geospacialData[0][1],
                    radiusKms: geospacialData[1],
                    weatherStatus: status,
                    weatherDescription: description
                }
            })
        }

        apiWeatherUpdate().then(() => { setOpen(true) })
    }

    useEffect(() => {
        var loh = []
        const getHikes = async () => {
            loh = await API.getFilteredListOfHikes({})
        }
        getHikes().then(() => {
            setListOfHikes(loh)
        });
    }, [])

    useEffect(() => {
        if (geospacialData[0][0] === -1.0 && geospacialData[0][1] === -1.0 && geospacialData[1] === -1.0)
            return
        console.log('lat: ' + geospacialData[0][0] + ' - lon: ' + geospacialData[0][1] + ' - radius: ' + geospacialData[1])
    }, [geospacialData])

    useEffect(() => {
        var tmpListOfHikes = []
        const getHikes = async () => {
            tmpListOfHikes = await API.getListOfHikes()
        }
        getHikes().then(() => {
            setListOfHikes(tmpListOfHikes)
        });
    }, [])

    useEffect(() => {
        const fillingList = []
        const getGpxFiles = async () => {
            setLoaded(false)
            for (let hike of listOfHikes.map(x => x)) {
                const result = await API.getHikePathByHike(hike)
                fillingList.push(result)
            }
        }
        getGpxFiles().then(() => {
            let gpxParser = require('gpxparser');
            const tmpOutput = []
            for (let hike of fillingList.map(x => x)) {
                if (hike.positions === undefined || hike.positions === "")
                    continue
                const gpx = new gpxParser();
                gpx.parse(hike.positions);
                hike.positions = gpx.tracks[0].points.map(p => [p.lat, p.lon])
                tmpOutput.push(hike)
            }
            setHike2Positions(tmpOutput)
            setLoaded(true)
        })
    }, [listOfHikes])

    if (!loaded) {
        return (
            <Grid sx={{ marginTop: "20px", display: "flex", justifyContent: "center" }} container item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Typography className="unselectable" sx={{ fontFamily: "Unbounded" }} fontSize={32} display="flex" justifyContent="center">
                        <b>
                            Weather alert for location
                        </b>
                    </Typography>
                    <MapLoading />
                </Grid>
            </Grid>
        )
    }

    if (props.user?.role !== UserRoles.PLATFORM_MANAGER) {
        navigate('/unauthorized')
    }
    return (
        <Grid sx={{ marginTop: "20px", display: "flex", justifyContent: "center", paddingLeft: { xs: "10px", md: "200px" }, paddingRight: { xs: "10px", md: "200px" }, marginBottom: "50px" }} container item xs={12} sm={12} md={12} lg={12} xl={12}>
            <WeatherPopupMap open={open} setOpen={setOpen} />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography className="unselectable" sx={{ fontFamily: "Unbounded" }} fontSize={32} display="flex" justifyContent="center">
                    <b>
                        Weather alert for location
                    </b>
                </Typography>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <MapBrowseHike setGeospacialData={setGeospacialData} dataset={hike2Positions} />
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginTop: "24px", marginBottom: "12px" }}>
                <Typography><b>Set new weather condition by clicking on the following buttons</b></Typography>
            </Grid>
            <Grid container item xs={12} sm={8} md={8} lg={8} xl={8} sx={{ display: "flex", justifyContent: "center" }}>
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
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginBottom: "8px" }}>
                    <WeatherButton selected={status === 6} setStatus={setStatus} buttonType={6} />
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginBottom: "8px" }}>
                    <WeatherDescription description={description} setDescription={setDescription} />
                </Grid>
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6} xl={6} sx={{ display: "flex", justifyContent: "center", marginTop: "25px" }}>
                <Tooltip title="You need to select an area on the map before" arrow>
                    <Button onClick={handleSubmit} variant="outlined" sx={{ textTransform: "none", borderRadius: "160px" }}>Update weather condition for the selected zone</Button>
                </Tooltip>
            </Grid>
        </Grid>
    )
}

const MapBrowseHike = (props) => {
    const [clickedCenter, setClickedCenter] = useState([45.07412045176881, 7.621063528883495])
    const [selected, setSelected] = useState(-1)
    const [flyIndex, setFlyIndex] = useState(-1)

    const OnClickSelectHike = (index) => {
        setSelected(index)
        setFlyIndex(index)
    }

    const FlyToSelected = (props) => {
        const map = useMap()
        if (props.index === -1)
            return;
        map.flyTo(props.dataset.filter(x => x.id === props.index)[0].positions[0], 14)
    }

    const _circleCreated = (e) => {
        props.setGeospacialData([[e.layer.toGeoJSON().geometry.coordinates[1], e.layer.toGeoJSON().geometry.coordinates[0]], e.layer.getRadius() / 1000.0])
    }

    const _circleEdited = (e) => {
        console.log(e)
    }

    const _circleDeleted = (e) => {
        console.log(e)
    }

    return (
        <div style={{ display: "flex", justifyContent: "center" }}>
            <MapContainer center={clickedCenter} zoom={9}
                scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: true }} zoomControl={false}
                style={{ width: "100%", minHeight: "60vh", height: "60%" }}>
                <FeatureGroup>
                    <EditControl position="bottomright" draw={{
                        rectangle: false,
                        circle: true,
                        circlemarker: false,
                        marker: false,
                        polygon: false,
                        polyline: false
                    }} onCreated={e => _circleCreated(e)} onEdited={e => _circleEdited(e)} onDeleted={e => _circleDeleted(e)} />
                </FeatureGroup>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                />
                <FlyToSelected {...props} index={flyIndex} />
                <ZoomControl position='bottomright' />
                {
                    props.dataset.filter(x => x.gpxFile !== undefined || x.gpxFile !== "" || x.positions === null || x.positions === undefined || x.positions.length === 0).map((hike) => {
                        if (!hike?.positions?.[0]) { return null; }
                        if (selected === hike?.id) {
                            return (
                                <>
                                    <Marker
                                        key={hike.id}
                                        position={[hike?.positions[0][0], hike?.positions[0][1]]}>
                                        <Popup position={[hike?.positions[0][0], hike?.positions[0][1]]}>
                                            <HikePopup hike={hike} />
                                        </Popup>
                                    </Marker>
                                    <Polyline
                                        pathOptions={{ fillColor: 'red', color: 'blue' }}
                                        positions={hike?.positions}
                                    />
                                </>
                            );
                        } else {
                            return (
                                <>
                                    <Marker
                                        key={hike?.id}
                                        position={[hike?.positions[0][0], hike?.positions[0][1]]}>
                                        <Popup position={[hike?.positions[0][0], hike?.positions[0][1]]}>
                                            <HikePopup hike={hike} OnClickSelectHike={OnClickSelectHike} />
                                        </Popup>
                                    </Marker>
                                </>
                            );
                        }
                    })
                }
            </MapContainer>
        </div>
    );
}


export default WeatherAlertMap