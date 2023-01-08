import React, { useEffect, useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'
import './browse-hikes-style.css'

import { MapBrowseHike } from '../../components/map/MapBrowseHike';
import { Grid } from '@mui/material';
import MapLoading from '../../components/map/MapLoading';
import MapFilters from '../../components/map-filters/MapFilters';
import API from '../../API/API.js';
import { useNavigate } from 'react-router';
import { UserRoles } from '../../lib/common/UserRoles'

const HTBrowseHikes = (props) => {
    const [loading, setLoading] = useState(false)
    const [listOfHikes, setListOfHikes] = useState([])
    const [hike2Positions, setHike2Positions] = useState([])
    const [isRadiusProcedureActive, setIsRadioProcedureActive] = useState(false)
    const [radiusFilter, setRadiusFilter] = useState([[0.0, 0.0], 0.0])

    const [filter, setFilter] = useState({
        "province": null,
        "region": null,
        "maxLength": null,
        "minLength": null,
        "expectedTimeMin": null,
        "expectedTimeMax": null,
        "difficultyMin": null,
        "difficultyMax": null,
        "ascentMin": null,
        "ascentMax": null,
        "inPointRadius": {
            "lat": null,
            "lon": null,
            "radiusKms": null
        }
    })

    useEffect(() => {
        setFilter({
            "province": filter.province,
            "region": filter.region,
            "maxLength": filter.maxLength,
            "minLength": filter.minLength,
            "expectedTimeMin": filter.expectedTimeMin,
            "expectedTimeMax": filter.expectedTimeMax,
            "difficultyMin": filter.difficultyMin,
            "difficultyMax": filter.difficultyMax,
            "ascentMin": filter.ascentMin,
            "ascentMax": filter.ascentMax,
            "inPointRadius": {
                "lat": radiusFilter[0][0],
                "lon": radiusFilter[0][1],
                "radiusKms": radiusFilter[1]
            }
        })
    }, [radiusFilter])

    useEffect(() => {
        var loh = []
        const getHikes = async () => {
            loh = await API.getFilteredListOfHikes({ filter })
        }
        getHikes().then(() => {
            setListOfHikes(loh)
        });
    }, [filter])

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
            setLoading(false)
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
            setLoading(true)
        })
    }, [listOfHikes])


    const navigate = useNavigate()

    if (props.user?.role !== UserRoles.HIKER &&
        props.user?.role !== UserRoles.LOCAL_GUIDE &&
        props.user?.role !== UserRoles.PLATFORM_MANAGER &&
        props.user?.role !== UserRoles.HUT_WORKER &&
        props.user?.role !== UserRoles.EMERGENCY_OPERATOR) {
        navigate('/unauthorized')
    }

    return (
        <Grid container spacing={0} sx={{ backgroundColor: "#f2f2f2", minWidth: "100vw", width: "100%" }}>
            <MapFilters setIsRadioProcedureActive={setIsRadioProcedureActive} loading={loading}
                listOfHikes={hike2Positions} setFilter={setFilter} />
            <Grid item xs={12} sm={12} md={12} lg={12} xl={12}>
                {loading ? <MapBrowseHike setRadiusFilter={setRadiusFilter} dataset={hike2Positions} /> : <MapLoading></MapLoading>}
            </Grid>
        </Grid>
    );
}

export default HTBrowseHikes;
