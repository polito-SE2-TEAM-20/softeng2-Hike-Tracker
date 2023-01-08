import { Button, Chip, Divider, Grid, Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useMatch } from "react-router-dom";
import hutIcon from '../../Assets/hut-icon.png'
import { useEffect, useState } from "react";
import API from '../../API/API.js';
import { Skeleton } from "@mui/material";
import { MapContainer, TileLayer, Marker, Popup, ZoomControl } from 'react-leaflet'
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import { PopupModifyHut } from './PopupModifyHut'
import * as React from 'react';
import { AddPictureCard, PictureCard } from "./PictureCard";
import {UserRoles} from '../../lib/common/UserRoles'


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

const EditHut = (props) => {
    const navigate = useNavigate()
    const match = useMatch('/edithut/:hutid')
    const hutid = (match && match.params && match.params.hutid) ? match.params.hutid : -1
    const [hut, setHut] = useState({ title: "", numberOfBeds: -1, description: "", workingTimeStart: -1, workingTimeEnd: -1, price: -1, ownerName: "", website: "", point: { id: -1, type: -1, position: { type: "", coordinates: [0.0, 0.0] } } })
    const [loading, setLoading] = useState(true)
    const [pictures, setPictures] = useState([])
    const [picData, setPicData] = useState([])
    const [dirty, setDirty] = useState(false)
    const [dirty2, setDirty2] = useState(false)

    useEffect(() => {
        let tmpHut = { title: "", description: "", workingTimeStart: -1, workingTimeEnd: -1, numberOfBeds: -1, price: -1, ownerName: "", website: "", pictures: [], point: { id: -1, type: -1, position: { type: "", coordinates: [0.0, 0.0] } } }
        const getHut = async () => {
            tmpHut = await API.getSingleHutByID(hutid)
        }
        getHut().then(() => {
            setHut(tmpHut)
            console.log(hut)
            setLoading(false);
            setDescription(tmpHut.description);
            setPrice(tmpHut.price);
            setWorkingTimeEnd(tmpHut.workingTimeEnd.slice(0, -3));
            setWorkingTimeStart(tmpHut.workingTimeStart.slice(0, -3));

        })
    }, [hutid, dirty2])

    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);
    const [workingTimeStart, setWorkingTimeStart] = useState(-1);
    const [workingTimeEnd, setWorkingTimeEnd] = useState(-1);
    const [price, setPrice] = useState(-1);

    //states for the popup after modifying the hut 
    const [op, setOp] = useState(false);
    const [err, setErr] = useState(null);

    const handleClear = () => {
        setDescription(hut.description); setWorkingTimeStart(hut.workingTimeStart);
        setWorkingTimeEnd(hut.workingTimeEnd); setPrice(hut.price);
    }

    const handleUpload = event => {
        const fileUploaded = event.target.files[0]
        const tmpPictures = [...pictures]
        tmpPictures.push(fileUploaded)
        setPictures(tmpPictures)
    }

    const handleDeleteLocal = id => {
        let tmpPicData = [...picData]
        tmpPicData = tmpPicData.filter(x => x.id !== id)
        setPicData(tmpPicData)

        let tmpPictures = [...pictures]
        tmpPictures = tmpPictures.filter(x => x.name !== id)
        setPictures(tmpPictures)
    }

    const handleDeleteRemote = pathname => {
        const remainingFiles = hut.pictures.filter(filename => filename !== pathname)
        const updateRemote = async () => {
            await API.modifyHutPictures({ 'hutID': hut.id, 'params': remainingFiles })
        }
        updateRemote().then(() => { setLoading(true); setDirty2(!dirty2) })
    }

    useEffect(() => {
        const images = [...picData];
        pictures.forEach(picture => {
            console.log(picture)
            const reader = new FileReader()
            reader.onload = (e) => {
                const { result } = e.target;
                if (result && !images.map(x => x.img).includes(result)) {
                    images.push({ 'id': picture.name, 'img': result })
                    setPicData(images);
                }
            }
            reader.onloadend = () => setDirty(!dirty)
            reader.readAsDataURL(picture)
        })
    }, [pictures])

    const handleSubmit = () => {
        if (description === '' || description === null || description === undefined) {
            setErrorMessage("insert a valid description");
            setShow(true);
        } else if (workingTimeStart == '' || workingTimeStart === null || workingTimeStart === undefined || workingTimeEnd === null || workingTimeEnd === undefined || workingTimeEnd == '') {
            console.log(workingTimeStart);
            console.log(workingTimeEnd)
            setErrorMessage("insert valid time");
            setShow(true);
        } else if (!workingTimeStart.match(/^([01][0-9]|2[0-3]):([0-5][0-9])$/) || !workingTimeEnd.match(/^([01][0-9]|2[0-3]):([0-5][0-9])$/)) {
            console.log(workingTimeEnd);
            console.log(workingTimeStart);
            setErrorMessage("insert valid time e.g 12:40, 18:20");
            setShow(true);
        } else if (price == '' || price === null || price === undefined) {
            console.log(price);
            setErrorMessage("insert valid value for the price");
            setShow(true);
        } else if (hut.pictures.length === 0 && picData.length === 0) {
            setErrorMessage("insert at least one picture of the hut");
            setShow(true);
        } else {
            let object = { description: description, workingTimeStart: workingTimeStart, workingTimeEnd: workingTimeEnd, price: parseFloat(price) }
            setShow(false);
            props.modifyHutInformation(object, hutid)
                .then(modifiedHut => {
                    console.log(modifiedHut);
                    setOp(true);
                    setErr(null)
                })
                .catch((err) => {
                    setOp(true);
                    setErr(err)
                })
        }
        const formData = new FormData()
        pictures.forEach(picture => formData.append("pictures", picture))
        API.setHutPictures({ 'hutID': hutid, 'pictures': formData })
    }

    if (
        props.user?.role !== UserRoles.HUT_WORKER) {
        navigate('/unauthorized')
    }

    return (
        <>
            <Grid container style={{ marginTop: "20px", minHeight: "100vh", height: "100%" }}>
                <Grid style={{ marginLeft: "auto", marginRight: "auto", marginBottom: "550px", height: "40vh" }} item lg={3}>
                    {
                        op &&
                        <PopupModifyHut id={hutid} err={err} open={op} setOpen={setOp} />
                    }
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
                                !loading ? <><Typography><b>Description:</b></Typography>
                                    <TextField required fullWidth variant="standard"
                                        value={description}
                                        multiline
                                        inputProps={
                                            { maxLength: 998 }
                                        }
                                        onChange={(e) => { setDescription(e.target.value) }}
                                    ></TextField></> :
                                    <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                            }
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            {
                                !loading ? <><Typography><b>Price:</b></Typography>
                                    <TextField required fullWidth variant="standard"
                                        value={price}
                                        id="price"
                                        onChange={(e) => { setPrice(e.target.value) }}
                                    ></TextField></> :
                                    <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                            }
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            {
                                !loading ?
                                    <Typography><b>Number of beds</b> {hut.numberOfBeds == "" || hut.numberOfBeds === null || hut.numberOfBeds === undefined ? "N/A" : hut.numberOfBeds}</Typography> :
                                    <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                            }
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={1}>
                            {
                                !loading ?
                                    <Typography><b>Website:</b> {hut.website === "" || hut.website === null || hut.website === undefined ? "N/A" : hut.website}</Typography> :
                                    <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                            }
                        </Grid>
                        <Divider textAlign="left" style={{ marginTop: "25px", marginBottom: "10px" }}>
                            <Chip label="Working Hours" />
                        </Divider>

                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            {
                                !loading ? <><Typography><b>Working time start:</b></Typography>
                                    <TextField required fullWidth variant="standard"
                                        value={workingTimeStart}
                                        id="workingTimeStart"
                                        onChange={(e) => { setWorkingTimeStart(e.target.value) }}
                                    ></TextField></> :
                                    <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                            }
                        </Grid>
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                            {
                                !loading ? <><Typography><b>Working time finish:</b></Typography>
                                    <TextField required fullWidth variant="standard"
                                        value={workingTimeEnd}
                                        id="workingTimeEnd"
                                        onChange={(e) => { setWorkingTimeEnd(e.target.value) }}
                                    ></TextField></> :
                                    <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "10px" }} />
                            }
                        </Grid>
                        {
                            show ?
                                <Alert sx={{ mt: 3 }} variant="outlined" severity="error" onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
                        }
                        <Grid >
                            <Grid item xs={12} sm={12} md={12} lg={12} xl={12} mt={3} pl={5} pr={5}>
                                <Button variant="outlined"
                                    startIcon={<DeleteIcon />}
                                    onClick={handleClear}
                                    sx={{
                                        color: "#1a1a1a",
                                        borderColor: "#1a1a1a",
                                        borderRadius: "50px",
                                        "&:hover": { backgroundColor: "#1a1a1a", color: "white", borderColor: "black" },
                                        textTransform: "none",
                                        align: "right"
                                    }}>
                                    Reset
                                </Button>
                                <Button variant="outlined"
                                    onClick={handleSubmit}
                                    sx={{
                                        color: "#1a1a1a",
                                        borderColor: "#1a1a1a",
                                        borderRadius: "50px",
                                        "&:hover": { backgroundColor: "#1a1a1a", color: "white", borderColor: "black" },
                                        textTransform: "none"
                                    }}>
                                    Submit
                                </Button>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                <Grid style={{ marginLeft: "auto", marginRight: "auto", marginBottom: "25px", height: "80vh", paddingLeft: "25px", paddingRight: "25px" }} item lg={6}>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ display: "flex", justifyContent: "center", marginBottom: "15px" }}>
                        {
                            !loading ? <Typography variant="h2" sx={{ fontFamily: "Unbounded" }}>{hut.title}</Typography> :
                                <Skeleton variant='rectangular' height={50} width={600} style={{ marginBottom: "10px" }} />
                        }
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                        <Divider>
                            <Difficulty loading={loading} diff={hut.difficulty} />
                        </Divider>
                    </Grid>
                    <Grid item xs={12} sm={12} md={12} lg={12} xl={12} style={{ marginTop: "60px" }}>
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
                        <Grid item xs={12} sm={12} md={12} lg={12} xl={12} columns={4} sx={{ display: "flex", justifyContent: "center", marginTop: "18px", marginBottom: "24px" }}>
                            <Typography variant="h1" fontSize={52} className="unselectable">
                                Some pictures from the hut
                            </Typography>
                        </Grid>
                        <Grid container item xs={12} sm={12} md={12} lg={12} xl={12} sx={{ display: "flex", justifyContent: "left" }}>
                            {
                                picData.map(picture => {
                                    return (
                                        <Grid id={picture.id} container item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
                                            <PictureCard isEditable={true} isLocal={true} picture={picture} handleDelete={handleDeleteLocal} />
                                        </Grid>
                                    );
                                })
                            }
                            {
                                hut !== undefined && hut.pictures !== undefined ?
                                    hut?.pictures.map(picture => {
                                        console.log(picture)
                                        return (
                                            <Grid id={picture.id} container item xs={4} sm={4} md={4} lg={4} xl={4} sx={{ display: "flex", justifyContent: "center" }}>
                                                <PictureCard isEditable={true} isLocal={false} picture={picture} handleDelete={handleDeleteRemote} />
                                            </Grid>
                                        );
                                    })
                                    : <></>
                            }
                            <Grid item xs={3} sm={3} md={3} lg={3} xl={3} sx={{ display: "flex", justifyContent: "center" }}>
                                <AddPictureCard handleUpload={handleUpload} />
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {/*
            {console.log(hut.description)};
            {console.log(hut.workingTimeEnd)};
            {console.log(hut.workingTimeStart)};
            <Grid style={{ marginTop: "0px", marginLeft: "30px", marginRight: "30px", marginBottom: "50px", height: "60vh" }} item lg={3}>
                <Paper style={{ padding: "30px", height: "60vh" }}>
                    <EditHutForm hut={hut} hutid={hutid} description={hut.description}
                        workingTimeStart={hut.workingTimeStart} workingTimeEnd={hut.workingTimeEnd}
                        modifyHutInformation={props.modifyHutInformation} price={hut.price} />
                </Paper>
                    </Grid>*/}
        </>

    );
}

export { EditHut };

