import { Divider, Grid, Button, Typography, Paper, Chip, Skeleton, SvgIcon } from "@mui/material"
import { useMatch, useNavigate } from "react-router"
import { MapContainer, TileLayer, Marker, Popup, ZoomControl, Polyline, } from 'react-leaflet'
import L from 'leaflet';
import { useState, useEffect } from "react";
import API from "../../API/API";
import '../../components/hike-popup/hikepopup-style.css'
import { fromMinutesToHours } from "../../lib/common/FromMinutesToHours";
import { HikeWeatherByCode } from "../../lib/common/WeatherConditions";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TroubleshootIcon from '@mui/icons-material/Troubleshoot';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


const FriendTracking = () => {
    const match = useMatch('/friend-tracking/:userID/:hikeid/:friendCode')
    const hikeid = (match && match.params && match.params.hikeid) ? match.params.hikeid : -1
    const friendCode = (match && match.params && match.params.friendCode) ? match.params.friendCode : -1
    const [hike, setHike] = useState({})
    const [loaded, setLoaded] = useState(false)
    const [referencePoints, setReferencePoints] = useState([])
    const [isHikeTerminated, setIsHikeTerminated] = useState(false)

    useEffect(() => {
        let tmpHike = {}
        let tmpRP = []

        const getHike = async () => {
            tmpHike = await API.getSingleHikeByID(hikeid)
        }

        const fetchGPXFile = async () => {
            tmpHike = await API.getHikePathByHike(tmpHike)
        }


        const apiGetRefPoints = async () => {
            tmpRP = await API.getHikeByFriendCode(friendCode)
            if (tmpRP.status !== undefined && tmpRP.status === 422) {
                /**
                 * The hike has been terminated
                 */
                setIsHikeTerminated(true)
            }
        }

        getHike().then(() => {
            fetchGPXFile().then(() => {
                let gpxParser = require('gpxparser');
                const gpx = new gpxParser();
                gpx.parse(tmpHike.positions);
                tmpHike.positions = gpx.tracks[0].points.map(p => [p.lat, p.lon])
                setHike(tmpHike)
                setLoaded(true)
            })
        }).then(() => {
            apiGetRefPoints().then(() => {
                setReferencePoints(tmpHike.referencePoints)
            }).then(() => {
                let latestReferencePoints = tmpHike.referencePoints
                for (let index in latestReferencePoints) {
                    for (let index2 in tmpRP.trackPoints) {
                        if (latestReferencePoints[index].id === tmpRP.trackPoints[index2].point.id) {
                            latestReferencePoints[index].reached = true
                        }
                    }
                    if (latestReferencePoints[index].reached === undefined) {
                        latestReferencePoints[index].reached = false
                    }
                }
            })
        })
    }, [])

    if (!loaded) return <></>
    return (
        <Grid container sx={{ marginLeft: { md: "32px" }, marginRight: { md: "32px" }, marginTop: "20px" }}>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                <Typography className="unselectable" variant="h3" sx={{ fontFamily: "Unbounded", display: "flex", justifyContent: "left", marginBottom: "18px", padding: "12px", fontSize: { xs: "32px", md: "38px" }, alignItems: "center" }}>
                    <Typography className="unselectable" variant="h3" sx={{ fontFamily: "Unbounded", display: "flex", justifyContent: "left", padding: "5px", fontSize: { xs: "18px", md: "18px" }, backgroundColor: isHikeTerminated ? "red" : "green", color: "white", borderRadius: "8px" }}>{isHikeTerminated?"Closed":"Active"}</Typography>
                    <Typography className="unselectable" variant="h3" sx={{ fontFamily: "Unbounded", display: "flex", justifyContent: "left", paddingLeft: "12px", fontSize: { xs: "18px", md: "18px" } }}>Tracking</Typography>
                    &nbsp;
                    <TroubleshootIcon sx={{ fontSize: { xs: "32px", md: "38px" } }}></TroubleshootIcon>
                    &nbsp;
                    {hike.title}
                </Typography>
            </Grid>

            <Grid item xs={12} sm={12} md={4} lg={4} xl={4} sx={{ marginTop: "12px" }}>
                <Paper style={{ padding: "30px" }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h4">General information</Typography>
                    </Grid>
                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Where to find" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            loaded ?
                                <Typography>Region: {hike.region === "" ? "N/A" : hike.region}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            loaded ? <Typography>Province: {hike.province === "" ? "N/A" : hike.province}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="About the hike" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            loaded ? <Typography>Length: {hike.length === "" ? "N/A" : (Math.round(hike.length * 10) / 10000).toFixed(2)}km</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            loaded ? <Typography>Expected time: {hike.expectedTime === "" ? "N/A" : fromMinutesToHours(hike.expectedTime)}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            loaded ? <Typography>Ascent: {hike.ascent === "" ? "N/A" : hike.ascent}m</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Weather conditions" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            loaded ? <Typography>Weather status:&nbsp;
                                {HikeWeatherByCode[hike.weatherStatus].name}
                                <SvgIcon component={HikeWeatherByCode[hike.weatherStatus].image} />
                            </Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            loaded ? <Typography>Description of weather: {hike.weatherDescription}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                </Paper>
            </Grid>
            <Grid item xs={12} sm={12} md={8} lg={8} xl={8} sx={{ marginTop: "12px" }}>
                <Map loaded={loaded} hike={hike} referencePoints={referencePoints} />
            </Grid>

            {isHikeTerminated ? <></> :
                <>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography className="unselectable" variant="h4" sx={{ fontFamily: "Unbounded", marginTop: "24px", padding: "16px", display: "flex", justifyContent: "center" }}>Reference points reached</Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginBottom: "24px" }}>
                        <TableContainer sx={{ maxWidth: { xs: "90vw", md: "45vw" } }} component={Paper}>
                            <Table aria-label="simple table">
                                <TableHead>
                                    <TableRow sx={{ backgroundColor: "#CCE5D6" }}>
                                        <TableCell align="left">Name</TableCell>
                                        <TableCell align="left">Coordinates</TableCell>
                                        <TableCell align="left">Point type</TableCell>
                                        <TableCell align="left">Reached</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {
                                        referencePoints
                                            .sort((x, y) => x.reached.toString() < y.reached.toString())
                                            .map((refPoint) => (
                                                <TableRow
                                                    key={refPoint.name}
                                                    sx={{
                                                        '&:last-child td, &:last-child th': { border: 0 },
                                                        backgroundColor: refPoint.reached ? "#5EE671" : "#E6B0A7"
                                                    }}
                                                >
                                                    <TableCell align="left" component="th" scope="refPoint">
                                                        <b>{refPoint.name}</b>
                                                    </TableCell>
                                                    <TableCell align="left">{refPoint.position.coordinates[0]} - {refPoint.position.coordinates[1]}</TableCell>
                                                    <TableCell align="left">{fromIntToPointType(refPoint.type)}</TableCell>
                                                    <TableCell align="left">{refPoint.reached ? "Yes" : "No"}</TableCell>
                                                </TableRow>
                                            ))
                                    }
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Grid>
                </>
            }
        </Grid>
    )
}

const Map = (props) => {
    if (props.loaded)
        return (
            <div style={{ display: "flex", justifyContent: "center" }}>
                <MapContainer center={props.hike.positions[0]} zoom={13}
                    scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: true }} zoomControl={false}
                    style={{ width: "85%", minHeight: "50vh", height: "50%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                    />
                    <ZoomControl position='bottomright' />
                    <Marker
                        key={props.hike.id}
                        position={[props.hike?.positions[0][0], props.hike?.positions[0][1]]}>
                        <Popup position={[props.hike?.positions[0][0], props.hike?.positions[0][1]]}>
                            <HikePopup hike={props.hike} />
                        </Popup>
                    </Marker>
                    <Polyline
                        pathOptions={{ fillColor: 'red', color: 'blue' }}
                        positions={props.hike?.positions}
                    />
                    {
                        props.referencePoints.map(refPoint => {
                            return (
                                <Marker
                                    key={refPoint.title}
                                    position={[refPoint.position.coordinates[1], refPoint.position.coordinates[0]]}>
                                    <Popup position={[refPoint.position.coordinates[1], refPoint.position.coordinates[0]]}>
                                        <ReferencePointPopup refPoint={refPoint} />
                                    </Popup>
                                </Marker>
                            )
                        })
                    }
                </MapContainer>
            </div>
        );
}

const HikePopup = (props) => {
    const navigate = useNavigate()
    return (
        <div>
            <div className='popup-line'><b>{props.hike.title}</b></div>

            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

            <div className='popup-line'>{props.hike.region} - {props.hike.province}</div>

            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

            <div className='popup-line'>Length: {props.hike.length}km</div>

            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

            <div className='popup-line'>Latitude: {props.hike.positions[0][0]}</div>
            <div className='popup-line'>Longitude: {props.hike.positions[0][1]}</div>

            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

            <Button variant="filled" sx={{
                borderRadius: "10px", textTransform: "none", backgroundColor: "#1a1a1a", color: "white", "&:hover": { backgroundColor: "#3f3f3f" }
            }}
                onClick={() => { navigate(`/showhike/${props.hike.id}`) }} >See details</Button>

        </div>
    )
}

const ReferencePointPopup = (props) => {
    return (
        <div>
            <div className='popup-line'><b>{props.refPoint.title}</b></div>


            {/* <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

            <div className='popup-line'>Length: {props.refPoint.length}km</div> */}

            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

            <div className='popup-line'>Latitude: {props.refPoint.position.coordinates}</div>
            <div className='popup-line'>Longitude: {props.refPoint.position.coordinates}</div>

            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

            <div className='popup-line'>{props.refPoint.reached ? "Reached" : "Not reached yet"}</div>
        </div>
    )
}

/* also for point type: 
enum PointType {
  point = 0,
  hut = 1,
  parkingLot = 2,
  referencePoint = 3,
  linkedPoint = 4,
  startPoint = 5,
  endPoint = 6,
}, can you confirm? */
const fromIntToPointType = (pointType) => {
    switch (pointType) {
        case 0:
            return "Generic point"
        case 1:
            return "Hut"
        case 2:
            return "Parking lot"
        case 3:
            return "Reference point"
        case 4:
            return "Linked point"
        case 5:
            return "Starting point"
        case 6:
            return "Ending point"
        default:
            return ""
    }
}

export default FriendTracking