import { Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router";
import { useMatch } from "react-router-dom";
import HTNavbar from "../../components/HTNavbar/HTNavbar";
import hutIcon from '../../Assets/hut-icon.png'
import { useEffect, useState } from "react";
import API from '../../API/API.js';
import { Skeleton } from "@mui/material";
import { MapContainer, TileLayer, FeatureGroup, Marker, Popup, useMapEvents, ZoomControl, Polyline, useMap } from 'react-leaflet'


const Difficulty = (props) => {
    if (!props.loading) {
        return (
            <>
                <img src={hutIcon} alt="tourist" width="30px" height="30px" />
                <div style={{ backgroundColor: "#f2f250", color: "#1a1a1a", borderRadius: "8px", paddingLeft: "12px", paddingTop: "3px", paddingBottom: "3px", paddingRight: "12px", width: "fit-content", display: "inline-block", marginLeft: "8px" }}><b>Hut</b></div>
            </>
        );
    }
    else {
        return (
            <Skeleton variant='rectangular' height={25} width={200} style={{ marginBottom: "10px" }} />
        );
    }

}

const ShowHut = (props) => {
    const navigate = useNavigate()
    const match = useMatch('/showhut/:hutid')
    const hutid = (match && match.params && match.params.hutid) ? match.params.hutid : -1
    const [hut, setHut] = useState({ title: "", numberOfBeds: -1, price: -1, ownerName: "", website: "", point: { id: -1, type: -1, position: { type: "", coordinates: [0.0, 0.0] } } })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let tmpHike = { title: "", numberOfBeds: -1, price: -1, ownerName: "", website: "", point: { id: -1, type: -1, position: { type: "", coordinates: [0.0, 0.0] } } }
        const getHut = async () => {
            tmpHike = await API.getSingleHutByID(hutid)
        }
        getHut().then(() => {
            setHut(tmpHike)
            setLoading(false)
        })
    }, [])


    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    return (
        <Grid container style={{ minHeight: "100vh", height: "100%" }}>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <Grid style={{ marginTop: "105px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "40vh" }} item lg={3}>
                <Paper style={{ padding: "30px", height: "50vh" }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h4">General information</Typography>
                    </Grid>
                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Where we are" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ?
                                <Typography>Location: {hut.address === "" || hut.address === null || hut.address === undefined ? "N/A" : hut.point.address}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ?
                                <Typography>Owner name: {hut.ownerName === "" || hut.ownerName === null || hut.ownerName === undefined ? "N/A" : hut.ownerName}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ?
                                <Typography>Altitude: {hut.altitude === "" || hut.altitude === null || hut.altitude === undefined ? "N/A" : hut.altitude}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Details" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Price: {hut.price === "" || hut.price === null || hut.price === undefined ? "N/A" : hut.price}€ per night</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Number of beds: {hut.numberOfBeds === "" || hut.numberOfBeds === null || hut.numberOfBeds === undefined ? "N/A" : hut.numberOfBeds} beds</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography>Website: {hut.website === "" || hut.website === null || hut.website === undefined ? "not provided" : hut.website}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                </Paper>
            </Grid>
            <Grid style={{ marginTop: "105px", marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "80vh", paddingLeft: "25px", paddingRight: "25px" }} item lg={6}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                    {
                        !loading ? <Typography variant="h2">{hut.title}</Typography> :
                            <Skeleton variant='rectangular' height={50} width={600} style={{ marginBottom: "10px" }} />
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    <Divider>
                        <Difficulty loading={loading} diff={hut.difficulty} />
                    </Divider>
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "30px" }}>
                    {
                        !loading ?
                            <Typography variant="h4">Find us on the map</Typography>
                            : <Typography variant="h4">Loading...</Typography>
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {
                        !loading ?
                            <MapContainer center={hut.point.position.coordinates} zoom={9}
                                scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: false }} zoomControl={false}
                                style={{ width: "auto", minHeight: "20vh", height: "40vh" }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                                />
                                <Marker
                                    key={hut.id}
                                    position={[hut.point.position.coordinates[0], hut.point.position.coordinates[1]]}>
                                    <Popup position={[hut.point.position.coordinates[0], hut.point.position.coordinates[1]]}>
                                        <div>
                                            <div className='popup-line'><b>{hut.title}</b></div>

                                            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

                                            <div className='popup-line'>{hut.point.address}</div>

                                            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

                                            <div className='popup-line'>Latitude: {hut.point.position.coordinates[0]}</div>
                                            <div className='popup-line'>Longitude: {hut.point.position.coordinates[1]}</div>
                                        </div>
                                    </Popup>
                                </Marker>
                                <ZoomControl position='bottomright' />
                            </MapContainer> :
                            <>
                                <Skeleton variant='rectangular' height={400} width={900} style={{ marginBottom: "10px" }} />
                            </>
                    }
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ShowHut;