import { Button, Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useMatch } from "react-router-dom";
import hutIcon from '../../Assets/hut-icon.png'
import { useEffect, useState } from "react";
import API from '../../API/API.js';
import { Skeleton } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import { PictureCard } from "../edit-hut/PictureCard";
import { APIURL } from "../../API/API.js";

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

const isEditable = (list, hutID) => {
    for (let index in list) {
        console.log(index)
        if (list[index].id === hutID) {
            return true
        }
    }
    return false
}

const ShowHut = (props) => {
    const navigate = useNavigate()
    const match = useMatch('/showhut/:hutid')
    const hutid = (match && match.params && match.params.hutid) ? match.params.hutid : -1
    const [hut, setHut] = useState({ title: "", numberOfBeds: -1, price: -1, ownerName: "", website: "", point: { id: -1, type: -1, position: { type: "", coordinates: [0.0, 0.0] } } })
    const [loading, setLoading] = useState(true)
    const [hutsHutWorker, setHutsHutWorker] = useState([])

    useEffect(() => {
        let tmpHike = { title: "", numberOfBeds: -1, price: -1, ownerName: "", website: "", pictures: [], point: { id: -1, type: -1, position: { type: "", coordinates: [0.0, 0.0] } } }
        const getHut = async () => {
            tmpHike = await API.getSingleHutByID(hutid)
        }

        getHut().then(() => {
            setHut(tmpHike)
            setLoading(false)
        })
    }, [])

    useEffect(() => {
        var tmpHutsHutWorker = []

        const getHutsHutWorkerWrapper = async () => {
            tmpHutsHutWorker = await API.getHutsHutWorker()
        }

        getHutsHutWorkerWrapper().then(() => {
            setHutsHutWorker(tmpHutsHutWorker)
            console.log(hutsHutWorker)
            setLoading(false)
        })
    }, [hut])

    return (
        <Grid container style={{ minHeight: "100vh", height: "100%" }}>
            <Grid item>
                <div style={{ display: "flex", justifyContent: "center", borderRadius: 12 }}>
                    {
                        !loading ?
                            <img src={APIURL + hut.pictures[0]} alt={"landscape"} style={{ objectFit: "cover", width: "100vw", height: "400px" }} />
                            :
                            <></>
                    }
                </div>
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "center", marginTop: {xs: "-350px",md: "-200px"} }}>
                {
                    !loading ? <Typography variant="h2" sx={{ fontFamily: "Unbounded", textShadow: "#1a1a1a 0px 0 20px", color: "#fafafa", textAlign: "center", zIndex: "15" }}>{hut.title}</Typography> :
                        <Skeleton variant='rectangular' height={50} width={600} style={{ marginBottom: "10px" }} />
                }
            </Grid>
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{marginTop: "12px"}}>
                <Divider>
                    <Difficulty loading={loading} diff={hut.difficulty} />
                </Divider>
            </Grid>
            <Grid style={{  marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "fit-content" }} item lg={3}>
                <Paper style={{ padding: "30px", height: "fit-content" }}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Typography variant="h4">General information</Typography>
                    </Grid>
                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Where we are" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ?
                                <Typography><b>Location:</b> {hut.point.address === "" || hut.point.address === null || hut.point.address === undefined ? "N/A" : hut.point.address}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ?
                                <Typography><b>Owner name:</b> {hut.ownerName === "" || hut.ownerName === null || hut.ownerName === undefined ? "N/A" : hut.ownerName}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    {
                        // <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        //     {
                        //         !loading ?
                        //             <Typography><b>Altitude:</b> {hut.altitude === "" || hut.altitude === null || hut.altitude === undefined ? "N/A" : hut.altitude}</Typography> :
                        //             <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        //     }
                        // </Grid>
                    }


                    <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                        <Chip label="Details" />
                    </Divider>

                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography><b>Price:</b> {hut.price.toString() === "" || hut.price === null || hut.price === undefined ? "N/A" : hut.price}€ per night</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography><b>Number of beds:</b> {hut.numberOfBeds.toString() === "" || hut.numberOfBeds === null || hut.numberOfBeds === undefined ? "N/A" : hut.numberOfBeds} beds</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography><b>Working time: </b>
                                {hut.workingTimeStart === "" || hut.workingTimeStart === null || hut.workingTimeStart === undefined ?
                                    "not provided"
                                    : hut.workingTimeStart.slice(0, -3)} - {hut.workingTimeEnd === "" || hut.workingTimeEnd === null || hut.workingTimeEnd === undefined ?
                                        "not provided"
                                        : hut.workingTimeEnd.slice(0, -3)}
                            </Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        {
                            !loading ? <Typography><b>Website:</b> {hut.website === "" || hut.website === null || hut.website === undefined ? "not provided" : <a href={`https://${hut.website}`}>{hut.website}</a>}</Typography> :
                                <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>

                    {
                        props?.user?.role === 4 ? <>
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ marginTop: "15px" }}>
                                {
                                    !loading && isEditable(hutsHutWorker, hut?.id) ?
                                        <Button variant="outlined"
                                            onClick={() => { navigate("/edithut/" + hut.id) }}
                                            sx={{
                                                color: "#1a1a1a",
                                                borderColor: "#1a1a1a",
                                                borderRadius: "50px",
                                                "&:hover": { backgroundColor: "#1a1a1a", color: "white", borderColor: "black" },
                                                textTransform: "none"
                                            }}>
                                            Edit
                                        </Button> : <></>
                                }
                            </Grid>
                        </> : <></>
                    }
                </Paper>
            </Grid>
            <Grid style={{  marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "80vh", paddingLeft: "25px", paddingRight: "25px" }} item lg={6}>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "30px" }}>
                    {
                        !loading ?
                            <Typography variant="h4">Some information on this hut</Typography>
                            : <Typography variant="h4">Loading...</Typography>
                    }
                </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                    {
                        !loading ? <Typography>{hut.description === "" || hut.description === undefined || hut.description === null ? "No description provided." : hut.description}</Typography> :
                            <>
                                <Skeleton variant='rectangular' height={20} width={400} style={{ marginBottom: "10px" }} />
                                <Skeleton variant='rectangular' height={20} width={400} style={{ marginBottom: "10px" }} />
                                <Skeleton variant='rectangular' height={20} width={150} style={{ marginBottom: "10px" }} />
                            </>
                    }
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
                            <MapContainer center={[hut.point.position.coordinates[1], hut.point.position.coordinates[0]]} zoom={9}
                                scrollWheelZoom={{ xs: false, sm: false, md: false, lg: false, xl: false }} zoomControl={false}
                                style={{ width: "auto", minHeight: "20vh", height: "40vh" }}>
                                <TileLayer
                                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                    url={"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"}
                                />
                                <Marker
                                    key={hut.id}
                                    position={[hut.point.position.coordinates[1], hut.point.position.coordinates[0]]}>
                                    <Popup position={[hut.point.position.coordinates[1], hut.point.position.coordinates[0]]}>
                                        <div>
                                            <div className='popup-line'><b>{hut.title}</b></div>

                                            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

                                            <div className='popup-line'>{hut.point.address}</div>

                                            <Divider style={{ marginTop: "2px", marginBottom: "2px" }} />

                                            <div className='popup-line'>Latitude: {hut.point.position.coordinates[1]}</div>
                                            <div className='popup-line'>Longitude: {hut.point.position.coordinates[0]}</div>
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
                <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} columns={4} sx={{ display: "flex", justifyContent: "left", marginTop: "24px", padding: "0px 64px 64px 64px" }}>
                    {
                        hut !== undefined && hut.pictures !== undefined && hut.pictures.length !== 0 ?
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} columns={4} sx={{ display: "flex", justifyContent: "center", marginTop: "18px", marginBottom: "24px" }}>
                                <Typography variant="h1" fontSize={52} className="unselectable">
                                    Some pictures from the hut
                                </Typography>
                            </Grid> : <></>
                    }

                    <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "left" }}>
                        {
                            hut !== undefined && hut.pictures !== undefined ?
                                hut?.pictures.map(picture => {
                                    console.log(picture)
                                    return (
                                        <Grid id={picture.id} container item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
                                            <PictureCard isEditable={false} isLocal={false} picture={picture} />
                                        </Grid>
                                    );
                                })
                                : <></>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </Grid>
    );
}

export default ShowHut;