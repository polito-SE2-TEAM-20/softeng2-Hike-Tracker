import React, { useEffect, useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'
import './browse-hikes-style.css'

import { MapBrowseHike } from '../../components/map/MapBrowseHike';
import { useNavigate } from 'react-router';
import BH_API from './BH-API';
import { Grid } from '@mui/material';
import HTNavbar from '../../components/HTNavbar/HTNavbar';
import MapLoading from '../../components/map/MapLoading';
import MapFilters from '../../components/map-filters/MapFilters';

const HTBrowseHikes = (props) => {
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()
    const [listOfHikes, setListOfHikes] = useState([])
    const [hike2Positions, setHike2Positions] = useState([])
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    useEffect(() => {
        var tmpListOfHikes = []
        const getHikes = async () => {
            tmpListOfHikes = await BH_API.getListOfHikes()
        }
        getHikes().then(() => {
            setListOfHikes(tmpListOfHikes)
        });
    }, [])

    useEffect(() => {
        const fillingList = []
        const getGpxFiles = async () => {
            setLoading(false)
            for (let hike of listOfHikes.map(x => x)) {
                const result = await BH_API.getHikePathByHike(hike)
                fillingList.push(result)
            }
        }
        getGpxFiles().then(() => {
            let gpxParser = require('gpxparser');
            const tmpOutput = []
            for (let hike of fillingList.map(x => x)) {
                if (hike.positions == undefined || hike.positions == "")
                    continue
                const gpx = new gpxParser();
                gpx.parse(hike.positions);
                hike.positions = gpx.tracks[0].points.map(p => [p.lat, p.lon])
                tmpOutput.push(hike)
            }
            setHike2Positions(tmpOutput)
            setLoading(true)
        })
    }, [listOfHikes])

    return (
        <Grid container spacing={0} sx={{ backgroundColor: "#f2f2f2", minHeight: "100vh", height: "100%", minWidth: "100vw", width: "100%" }}>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <MapFilters />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                {loading ? <MapBrowseHike dataset={hike2Positions} /> : <MapLoading></MapLoading>}
            </Grid>
        </Grid>
    );
}

export default HTBrowseHikes;
