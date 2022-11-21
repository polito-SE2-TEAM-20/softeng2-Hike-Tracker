import React, { useEffect, useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'
import './browse-hikes-style.css'

import { MapBrowseHike } from '../../components/map/MapBrowseHike';
import { useNavigate } from 'react-router';
import BH_API from './BH-API';
import { Grid } from '@mui/material';
import HTNavbar from '../../components/HTNavbar/HTNavbar';

const HTBrowseHikes = (props) => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [listOfHikes, setListOfHikes] = useState([])
    const [positions, setPositions] = useState([])
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    useEffect(() => {
        var tmpListOfHikes = []
        const getHikes = async () => {
            tmpListOfHikes = await BH_API.getListOfHikes()
        }
        getHikes().then(() => {
            console.log(tmpListOfHikes)
            setListOfHikes(tmpListOfHikes)
        });
    }, [])

    useEffect(() => {
        var gpxFile = {}
        const getGpxFile = async () => {
            setLoading(false)
            gpxFile = await BH_API.getPathByID("/static/gpx/12e4a1f1-553c-4050-a7c8-1c7be946cdeb.gpx")
        }
        getGpxFile().then(() => {
            let gpxParser = require('gpxparser');
            var gpx = new gpxParser();
            gpx.parse(gpxFile);
            setPositions(gpx.tracks[0].points.map(p => [p.lat, p.lon]));
            console.log(positions)
            setLoading(true)
        })
    }, [listOfHikes])

    return (
        <Grid container spacing={0} sx={{ backgroundColor: "#f2f2f2", minHeight: "100vh", height: "100%", minWidth: "100vw", width: "100%" }}>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                {loading ? <MapBrowseHike dataset={positions} /> : <></>}
            </Grid>
        </Grid>
    );
}

export default HTBrowseHikes;
