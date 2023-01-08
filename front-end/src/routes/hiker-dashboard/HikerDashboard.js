import { Button, Grid, TextField, Typography, Switch, FormControlLabel, FormGroup, Checkbox } from "@mui/material";
import { useNavigate } from "react-router";
import { displayTypeFlex } from "../../extra/DisplayType";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import './hiker-dashboard-style.css'
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { MapContainer, TileLayer, Marker, ZoomControl, useMap, FeatureGroup } from 'react-leaflet'
import L from 'leaflet';
import { EditControl } from 'react-leaflet-draw'
import { useState, useEffect } from "react";
import API from '../../API/API'
import { fromMinutesToHours } from '../../lib/common/FromMinutesToHours'
import { styled } from '@mui/material/styles';
import { BEGINNER, ADVANCED } from '../../lib/common/PreferencesConstants'
import QueryStatsIcon from '@mui/icons-material/QueryStats';
import {UserRoles} from '../../lib/common/UserRoles'

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});

const PerformacesButton = (props) => {
    return (
        <Grid container item xs={7} sm={7} md={7} lg={12} xl={12} sx={{
            borderStyle: "solid", borderWidth: "1px", borderRadius: "24px 0px 12px 0px", borderColor: "#4c4c4c",
            width: "fit-content", height: "fit-content", marginBottom: "8px", "&:hover": {
                backgroundColor: "#f5f5f5", borderColor: "purple", color: "purple"
            }
        }}
            onClick={props.handleNavigatePerformaces}
        >
            <Grid item sx={{ marginTop: "5px", marginBottom: "5px", marginLeft: "24px", marginRight: "24px" }}>
                <Grid item sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    <QueryStatsIcon />
                    {/* <img src={QueryStatsIcon} alt="weatherMap" width="30px" height="auto" /> */}
                    <Typography className="unselectable" sx={{ fontFamily: "Unbounded", marginLeft: "12px" }} fontSize={16} textAlign="left">
                        Performances
                    </Typography>
                </Grid>
            </Grid>
        </Grid>
    )
}

const HikerDashboard = (props) => {
    const navigate = useNavigate()
    const [updateFinished, setUpdateFinished] = useState(false)
    const [updateError, setUpdateError] = useState(false)
    const [position, setPosition] = useState({ 'lat': 45.0651752130794, 'lon': 7.661497396350511 })
    const [radius, setRadius] = useState(0.0)
    const [length, setLength] = useState(0.0)
    const [expectedTime, setExpectedTime] = useState(0.0)
    const [difficulty, setDifficulty] = useState(0)
    const [ascent, setAscent] = useState(0.0)
    const [suggestionType, setSuggestionType] = useState(false)

    const [isStartingPoint, setIsStartingPoint] = useState(false)
    const [isRadius, setIsRadius] = useState(false)
    const [isLength, setIsLength] = useState(false)
    const [isExpectedTime, setIsExpectedTime] = useState(false)
    const [isDifficulty, setIsDifficulty] = useState(false)
    const [isAscent, setIsAscent] = useState(false)

    const [radiusFilter, setRadiusFilter] = useState([[0.0, 0.0], 0.0])

    const positionStatic = position.lat === null || position.lon === null ? { "lat": 0.0, "lon": 0.0 } : position
    const radiusStatic = radius === null ? 0.0 : radius
    const lengthStatic = length === null ? 0.0 : length
    const expectedTimeStatic = expectedTime === null ? 0 : expectedTime
    const ascentStatic = ascent === null ? 0.0 : ascent

    useEffect(() => {
        setPosition({ "lat": radiusFilter[0][0], "lon": radiusFilter[0][1] })
        setRadius(radiusFilter[1])
    }, [radiusFilter])

    useEffect(() => {
        var tmpPref = {}
        const getPreferences = async () => {
            tmpPref = await API.getPreferences()
        }
        getPreferences().finally(() => {
            if (Object.keys(tmpPref).length !== 0) {
                setPosition({ 'lat': tmpPref.lat, 'lon': tmpPref.lon })
                setRadius(tmpPref.radiusKms)
                setLength(tmpPref.minLength)
                setExpectedTime(tmpPref.expectedTimeMin)
                setDifficulty(tmpPref.difficultyMin)
                setAscent(tmpPref.ascentMin)
                setSuggestionType(tmpPref.suggestionType)

                setIsStartingPoint(tmpPref.lat !== null && tmpPref.lon !== null)
                setIsRadius(tmpPref.radiusKms !== null)
                setIsLength(tmpPref.minLength !== null)
                setIsExpectedTime(tmpPref.expectedTimeMin !== null)
                setIsDifficulty(tmpPref.difficultyMin !== null)
                setIsAscent(tmpPref.ascentMin !== null)
            }
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const isAlmostOnePreferenceSelected = () => {
        return isStartingPoint || isRadius || isLength || isExpectedTime || isDifficulty || isAscent
    }

    const handlePreferencesUpdate = () => {
        if (!isAlmostOnePreferenceSelected()) {
            setUpdateError(true)
            setTimeout(() => {
                if (updateError)
                    setUpdateError(false)
            }, 3000);
            return
        }
        const prefFilter =
        {
            "lat": position.lat,
            "lon": position.lon,
            "radiusKms": radius <= (!suggestionType ? BEGINNER : ADVANCED).minRadius ?
                (!suggestionType ? BEGINNER : ADVANCED).minRadius :
                radius,
            "minLength": length,
            "maxLength": length + (!suggestionType ? BEGINNER : ADVANCED).lengthOffset,
            "expectedTimeMin": expectedTime,
            "expectedTimeMax": expectedTime + (!suggestionType ? BEGINNER : ADVANCED).expectedTimeOffset,
            "difficultyMin": difficulty,
            "difficultyMax": difficulty + (!suggestionType ? BEGINNER : ADVANCED).difficultyOffset,
            "ascentMin": ascent,
            "ascentMax": ascent + (!suggestionType ? BEGINNER : ADVANCED).ascentOffset,
            'suggestionType': suggestionType
        }

        const preFilter = () => {
            if (!isStartingPoint) {
                prefFilter.lat = null
                prefFilter.lon = null
            }
            if (!isRadius) {
                prefFilter.radiusKms = null
            }
            if (!isLength) {
                prefFilter.minLength = null
                prefFilter.maxLength = null
            }
            if (!isExpectedTime) {
                prefFilter.expectedTimeMin = null
                prefFilter.expectedTimeMax = null
            }
            if (!isDifficulty) {
                prefFilter.difficultyMin = null
                prefFilter.difficultyMax = null
            }
            if (!isAscent) {
                prefFilter.ascentMin = null
                prefFilter.ascentMax = null
            }
        }

        const setPreferences = async () => {
            preFilter()
            await API.setPreferences(prefFilter)
        }
        setPreferences().then(() => {
            setUpdateError(false)
            setUpdateFinished(true)
        }).catch(() => {
            setUpdateFinished(false)
            setUpdateError(true)
        })
    }

    useEffect(() => {
        setTimeout(() => {
            if (updateFinished)
                setUpdateFinished(false)
        }, 3000);
    }, [updateFinished])

    useEffect(() => {
        setTimeout(() => {
            if (updateError)
                setUpdateError(false)
        }, 3000);
    }, [updateError])

    const handleNavigatePerformaces = () => {
        navigate("/hikerPerformance")
    }
    

    if (props.user?.role !== UserRoles.HIKER) {
        navigate('/unauthorized')
    }

    return (
        <>
            <Grid sx={{ marginTop: "20px" }} container columns={12} display={displayTypeFlex.pc} style={{ marginBottom: "50px", justifyContent: "center" }}>
                <Grid container item xl={2} lg={3} height="fit-content">
                    <Grid item lg={12} xl={12}>
                        <AccountCircleIcon sx={{ fontSize: 300 }} />
                    </Grid>
                    <Grid item lg={12} xl={12}>
                        <Typography fontSize={32}>
                            <b>
                                {props?.user?.firstName + " " + props?.user?.lastName}
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item lg={12} xl={12}>
                        <Typography fontSize={20} color="#666666">
                            {props?.user?.email}
                        </Typography>
                    </Grid>
                    <Grid item lg={12} xl={12} sx={{ marginTop: "12px" }}>
                        <Typography className="unselectable" fontSize={18} sx={{
                            backgroundColor: "white", color: "purple", borderColor: "purple",
                            borderStyle: "solid", borderWidth: "1px",
                            borderRadius: "18px", width: "fit-content",
                            padding: "4px 12px 4px 12px", fontFamily: "Unbounded",
                            fontWeight: "50"
                        }}>
                            <b>
                                {props?.user?.role === 0 ? "Hiker" : ""}
                                {props?.user?.role === 1 ? "Friend" : ""}
                                {props?.user?.role === 2 ? "Local guide" : ""}
                                {props?.user?.role === 3 ? "Platform manager" : ""}
                                {props?.user?.role === 4 ? "Hut worker" : ""}
                                {props?.user?.role === 5 ? "Emergency operator" : ""}
                            </b>
                        </Typography>
                    </Grid>
                    <Grid container item lg={10} xl={10} height="fit-content" sx={{ justifyContent: "center", marginTop: "18px", marginBottom: "18px" }}>
                        <PerformacesButton handleNavigatePerformaces={handleNavigatePerformaces} />
                    </Grid>
                </Grid>
                <Grid container item lg={6} xl={6} height="fit-content" justifyContent="center" sx={{ marginLeft: "25px" }}>
                    <Grid lg={12} xl={12}>
                        <Typography fontSize={32}>
                            <b>Preferences</b>
                        </Typography>
                    </Grid>
                    <Grid lg={12} xl={12}>
                        <Typography fontSize={14} color="#555555">
                            <b><a href="/">HackTheHike.com</a></b> will use your preferences exclusively to suggest you more pertinent hikes and to improve your experience on our website.
                        </Typography>
                    </Grid>
                    <Grid lg={12} xl={12} sx={{ marginTop: "28px" }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Starting point</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>Latitude: {positionStatic.lat.toFixed(5)} - Longitude: {positionStatic.lon.toFixed(5)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Choose a point on the map to fix your favorite starting point.
                                </Typography>
                                <HikerDashboardMap setRadiusFilter={setRadiusFilter} centerPosition={[position.lat === null ? 0.0 : position.lat, position.lon === null ? 0.0 : position.lon]} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Radius</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{radiusStatic.toFixed(2)}km</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the radius to determine the area from which you'd prefer to start your hikes.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setRadius(0.0) : setRadius(parseFloat(e.target.value))
                                }} variant="outlined" label="Radius (in km)" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Length</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{(lengthStatic.toFixed(2) / 1000).toFixed(2)}km</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the length of your ideal hike.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setLength(0.0) : setLength(parseFloat(e.target.value))
                                }} variant="outlined" label="Length (in meters)" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Expected time</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{fromMinutesToHours(expectedTimeStatic)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the expected time for your ideal hike.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setExpectedTime(0.0) : setExpectedTime(parseFloat(e.target.value))
                                }} variant="outlined" label="Expected time (in minutes)" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Difficulty</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>
                                    {difficulty === 0 ? "Tourist" : <></>}
                                    {difficulty === 1 ? "Hiker" : <></>}
                                    {difficulty === 2 ? "Pro" : <></>}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Choose the difficulty level that better fits your needings and your past experiences.
                                </Typography>
                                <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "25%", marginRight: "25%" }}>
                                    <Button onClick={() => {
                                        setDifficulty(0)
                                    }} variant="outlined" sx={{
                                        borderRadius: "28px", color: difficulty === 0 ? "white" : "black", borderColor: "black", "&:hover":
                                        {
                                            backgroundColor: "#55B657", color: "white"
                                        }, backgroundColor: difficulty === 0 ? "#55B657" : "white"
                                    }}><b>Tourist</b></Button>
                                    <Button onClick={() => {
                                        setDifficulty(1)
                                    }} variant="outlined" sx={{
                                        borderRadius: "28px", color: difficulty === 1 ? "white" : "black", borderColor: "black", "&:hover":
                                        {
                                            backgroundColor: "#1a79aa", color: "white"
                                        }, backgroundColor: difficulty === 1 ? "#1a79aa" : "white"
                                    }}><b>Hiker</b></Button>
                                    <Button onClick={() => {
                                        setDifficulty(2)
                                    }} variant="outlined" sx={{
                                        borderRadius: "28px", color: difficulty === 2 ? "white" : "black", borderColor: "black", "&:hover":
                                        {
                                            backgroundColor: "#FA6952", color: "white"
                                        }, backgroundColor: difficulty === 2 ? "#FA6952" : "white"
                                    }}><b>Pro</b></Button>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Ascent</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{ascentStatic}m</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the ascent for your ideal hike.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setAscent(0.0) : setAscent(parseFloat(e.target.value))
                                }} variant="outlined" label="Ascent" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item sx={{ marginTop: "24px" }}>
                        <Typography sx={{ fontSize: "20px" }}>
                            <b>Select which parameters you want us to consider while suggesting you the best hikes based on your preferences.</b>
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onChange={() => { setIsStartingPoint(!isStartingPoint) }} checked={isStartingPoint} />} label="Starting point" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsRadius(!isRadius) }} checked={isRadius} />} label="Radius" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsLength(!isLength) }} checked={isLength} />} label="Length" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsExpectedTime(!isExpectedTime) }} checked={isExpectedTime} />} label="Expected time" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsDifficulty(!isDifficulty) }} checked={isDifficulty} />} label="Difficulty" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsAscent(!isAscent) }} checked={isAscent} />} label="Ascent" />
                        </FormGroup>
                    </Grid>
                    <Grid item lg={12} xl={12} sx={{ marginTop: "28px", display: "flex", justifyContent: "right" }}>
                        {updateFinished ? <div style={{ marginRight: "25px" }}>
                            <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                <b>Your preferences have been correctly updated.</b>
                            </Typography>
                        </div> : <></>}
                        {updateError ? <div style={{ marginRight: "25px" }}>
                            <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                <b>There's been an error with your preferences. Check fields value.</b>
                            </Typography>
                        </div> : <></>}
                        <FormControlLabel control={<MaterialUISwitch onChange={e => { setSuggestionType(!suggestionType) }} checked={suggestionType} />} label={!suggestionType ? "Beginner" : "Advanced"} />
                        <Button variant="filled"
                            onClick={handlePreferencesUpdate}
                            sx={{
                                backgroundColor: "green", color: "white",
                                borderRadius: "50px",
                                "&:hover": { backgroundColor: "darkgreen" }
                            }}>
                            Update preferences
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container sx={{ marginTop: "20px" }} columns={12} display={displayTypeFlex.tablet} style={{ marginBottom: "50px" }}>
                <Grid container item md={12} height="fit-content">
                    <Grid item md={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <AccountCircleIcon sx={{ fontSize: 300 }} />
                    </Grid>
                    <Grid item md={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography fontSize={32}>
                            <b>
                                {props?.user?.firstName + " " + props?.user?.lastName}
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item md={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography fontSize={20} color="#666666">
                            {props?.user?.email}
                        </Typography>
                    </Grid>
                    <Grid item md={12} sx={{ marginTop: "12px", display: "flex", justifyContent: "center" }}>
                        <Typography className="unselectable" fontSize={18} sx={{
                            backgroundColor: "white", color: "purple", borderColor: "purple",
                            borderStyle: "solid", borderWidth: "1px",
                            borderRadius: "18px", width: "fit-content",
                            padding: "4px 12px 4px 12px", fontFamily: "Unbounded",
                            fontWeight: "50"
                        }}>
                            <b>
                                {props?.user?.role === 0 ? "Hiker" : ""}
                                {props?.user?.role === 1 ? "Friend" : ""}
                                {props?.user?.role === 2 ? "Local guide" : ""}
                                {props?.user?.role === 3 ? "Platform manager" : ""}
                                {props?.user?.role === 4 ? "Hut worker" : ""}
                                {props?.user?.role === 5 ? "Emergency operator" : ""}
                            </b>
                        </Typography>
                    </Grid>
                    <Grid container item md={12} height="fit-content" sx={{ justifyContent: "center", marginTop: "18px", marginBottom: "18px" }}>
                        <PerformacesButton handleNavigatePerformaces={handleNavigatePerformaces} />
                    </Grid>
                </Grid>
                <Grid container item md={12} height="fit-content" justifyContent="center" sx={{ marginLeft: "25px", marginRight: "25px", marginTop: "25px" }}>
                    <Grid md={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography className="unselectable" fontSize={32}>
                            <b>Preferences</b>
                        </Typography>
                    </Grid>
                    <Grid md={12}>
                        <Typography fontSize={14} color="#555555">
                            <b><a href="/">HackTheHike.com</a></b> will use your preferences exclusively to suggest you more pertinent hikes and to improve your experience on our website.
                        </Typography>
                    </Grid>
                    <Grid md={12} sx={{ marginTop: "28px" }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Starting point</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>Latitude: {positionStatic.lat.toFixed(5)} - Longitude: {positionStatic.lon.toFixed(5)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Choose a point on the map to fix your favorite starting point.
                                </Typography>
                                <HikerDashboardMap setRadiusFilter={setRadiusFilter} centerPosition={[position.lat === null ? 0.0 : position.lat, position.lon === null ? 0.0 : position.lon]} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Radius</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{radiusStatic.toFixed(2)}km</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the radius to determine the area from which you'd prefer to start your hikes.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setRadius(0.0) : setRadius(parseFloat(e.target.value))
                                }} variant="outlined" label="Radius (in km)" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Length</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{(lengthStatic.toFixed(2) / 1000).toFixed(2)}km</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the length of your ideal hike.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setLength(0.0) : setLength(parseFloat(e.target.value))
                                }} variant="outlined" label="Length (in meters)" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Expected time</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{fromMinutesToHours(expectedTimeStatic)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the expected time for your ideal hike.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setExpectedTime(0.0) : setExpectedTime(parseFloat(e.target.value))
                                }} variant="outlined" label="Expected time (in minutes)" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Difficulty</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>
                                    {difficulty === 0 ? "Tourist" : <></>}
                                    {difficulty === 1 ? "Hiker" : <></>}
                                    {difficulty === 2 ? "Pro" : <></>}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Choose the difficulty level that better fits your needings and your past experiences.
                                </Typography>
                                <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "25%", marginRight: "25%" }}>
                                    <Button onClick={() => {
                                        setDifficulty(0)
                                    }} variant="outlined" sx={{
                                        borderRadius: "28px", color: difficulty === 0 ? "white" : "black", borderColor: "black", "&:hover":
                                        {
                                            backgroundColor: "#55B657", color: "white"
                                        }, backgroundColor: difficulty === 0 ? "#55B657" : "white"
                                    }}><b>Tourist</b></Button>
                                    <Button onClick={() => {
                                        setDifficulty(1)
                                    }} variant="outlined" sx={{
                                        borderRadius: "28px", color: difficulty === 1 ? "white" : "black", borderColor: "black", "&:hover":
                                        {
                                            backgroundColor: "#1a79aa", color: "white"
                                        }, backgroundColor: difficulty === 1 ? "#1a79aa" : "white"
                                    }}><b>Hiker</b></Button>
                                    <Button onClick={() => {
                                        setDifficulty(2)
                                    }} variant="outlined" sx={{
                                        borderRadius: "28px", color: difficulty === 2 ? "white" : "black", borderColor: "black", "&:hover":
                                        {
                                            backgroundColor: "#FA6952", color: "white"
                                        }, backgroundColor: difficulty === 2 ? "#FA6952" : "white"
                                    }}><b>Pro</b></Button>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Ascent</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{ascentStatic}m</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the ascent for your ideal hike.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setAscent(0.0) : setAscent(parseFloat(e.target.value))
                                }} variant="outlined" label="Ascent" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item sx={{ marginTop: "24px" }}>
                        <Typography sx={{ fontSize: "20px" }}>
                            <b>Select which parameters you want us to consider while suggesting you the best hikes based on your preferences.</b>
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onChange={() => { setIsStartingPoint(!isStartingPoint) }} checked={isStartingPoint} />} label="Starting point" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsRadius(!isRadius) }} checked={isRadius} />} label="Radius" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsLength(!isLength) }} checked={isLength} />} label="Length" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsExpectedTime(!isExpectedTime) }} checked={isExpectedTime} />} label="Expected time" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsDifficulty(!isDifficulty) }} checked={isDifficulty} />} label="Difficulty" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsAscent(!isAscent) }} checked={isAscent} />} label="Ascent" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sx={{ marginTop: "28px", display: "flex", justifyContent: "right" }}>
                        {updateFinished ? <div style={{ marginRight: "25px" }}>
                            <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                <b>Your preferences have been correctly updated.</b>
                            </Typography>
                        </div> : <></>}
                        {updateError ? <div style={{ marginRight: "25px" }}>
                            <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                <b>There's been an error with your preferences. Check fields value.</b>
                            </Typography>
                        </div> : <></>}
                        <FormControlLabel control={<MaterialUISwitch onChange={e => { setSuggestionType(!suggestionType) }} defaultChecked />} label={!suggestionType ? "Beginner" : "Advanced"} />
                        <Button variant="filled"
                            onClick={handlePreferencesUpdate}
                            sx={{
                                backgroundColor: "green", color: "white",
                                borderRadius: "50px",
                                "&:hover": { backgroundColor: "darkgreen" }
                            }}>
                            Update preferences
                        </Button>
                    </Grid>
                </Grid>
            </Grid>

            <Grid container sx={{ marginTop: "20px" }} columns={12} display={displayTypeFlex.mobile} style={{ marginBottom: "50px" }}>
                <Grid container item xs={12} sm={12} height="fit-content">
                    <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <AccountCircleIcon sx={{ fontSize: 300 }} />
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "center", textAlign: "center" }}>
                        <Typography fontSize={32}>
                            <b>
                                {props?.user?.firstName + " " + props?.user?.lastName}
                            </b>
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography fontSize={20} color="#666666">
                            {props?.user?.email}
                        </Typography>
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ marginTop: "12px", display: "flex", justifyContent: "center" }}>
                        <Typography className="unselectable" fontSize={18} sx={{
                            backgroundColor: "white", color: "purple", borderColor: "purple",
                            borderStyle: "solid", borderWidth: "1px",
                            borderRadius: "18px", width: "fit-content",
                            padding: "4px 12px 4px 12px", fontFamily: "Unbounded",
                            fontWeight: "50"
                        }}>
                            <b>
                                {props?.user?.role === 0 ? "Hiker" : ""}
                                {props?.user?.role === 1 ? "Friend" : ""}
                                {props?.user?.role === 2 ? "Local guide" : ""}
                                {props?.user?.role === 3 ? "Platform manager" : ""}
                                {props?.user?.role === 4 ? "Hut worker" : ""}
                                {props?.user?.role === 5 ? "Emergency operator" : ""}
                            </b>
                        </Typography>
                    </Grid>
                    <Grid container item xs={10} sm={10} height="fit-content" sx={{ justifyContent: "center", marginTop: "18px", marginBottom: "18px" }}>
                        <PerformacesButton handleNavigatePerformaces={handleNavigatePerformaces} />
                    </Grid>
                </Grid>
                <Grid container item xs={12} sm={12} height="fit-content" justifyContent="center" sx={{ marginLeft: "25px", marginRight: "25px", marginTop: "25px" }}>
                    <Grid xs={12} sm={12} sx={{ display: "flex", justifyContent: "center" }}>
                        <Typography className="unselectable" fontSize={32}>
                            <b>Preferences</b>
                        </Typography>
                    </Grid>
                    <Grid xs={12} sm={12}>
                        <Typography fontSize={14} color="#555555">
                            <b><a href="/">HackTheHike.com</a></b> will use your preferences exclusively to suggest you more pertinent hikes and to improve your experience on our website.
                        </Typography>
                    </Grid>
                    <Grid xs={12} sm={12} sx={{ marginTop: "28px" }}>
                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Starting point</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>Latitude: {positionStatic.lat.toFixed(5)} - Longitude: {positionStatic.lon.toFixed(5)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Choose a point on the map to fix your favorite starting point.
                                </Typography>
                                <HikerDashboardMap setRadiusFilter={setRadiusFilter} centerPosition={[position.lat === null ? 0.0 : position.lat, position.lon === null ? 0.0 : position.lon]} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Radius</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{radiusStatic.toFixed(2)}km</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the radius to determine the area from which you'd prefer to start your hikes.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setRadius(0.0) : setRadius(parseFloat(e.target.value))
                                }} variant="outlined" label="Radius (in km)" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Length</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{(lengthStatic.toFixed(2) / 1000).toFixed(2)}km</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the length of your ideal hike.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setLength(0.0) : setLength(parseFloat(e.target.value))
                                }} variant="outlined" label="Length (in meters)" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Expected time</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{fromMinutesToHours(expectedTimeStatic)}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the expected time for your ideal hike.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setExpectedTime(0.0) : setExpectedTime(parseFloat(e.target.value))
                                }} variant="outlined" label="Expected time (in minutes)" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Difficulty</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>
                                    {difficulty === 0 ? "Tourist" : <></>}
                                    {difficulty === 1 ? "Hiker" : <></>}
                                    {difficulty === 2 ? "Pro" : <></>}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Choose the difficulty level that better fits your needings and your past experiences.
                                </Typography>
                                <div style={{ display: "flex", justifyContent: "space-between", marginLeft: "25%", marginRight: "25%" }}>
                                    <Button onClick={() => {
                                        setDifficulty(0)
                                    }} variant="outlined" sx={{
                                        borderRadius: "28px", color: difficulty === 0 ? "white" : "black", borderColor: "black", "&:hover":
                                        {
                                            backgroundColor: "#55B657", color: "white"
                                        }, backgroundColor: difficulty === 0 ? "#55B657" : "white"
                                    }}><b>Tourist</b></Button>
                                    <Button onClick={() => {
                                        setDifficulty(1)
                                    }} variant="outlined" sx={{
                                        borderRadius: "28px", color: difficulty === 1 ? "white" : "black", borderColor: "black", "&:hover":
                                        {
                                            backgroundColor: "#1a79aa", color: "white"
                                        }, backgroundColor: difficulty === 1 ? "#1a79aa" : "white"
                                    }}><b>Hiker</b></Button>
                                    <Button onClick={() => {
                                        setDifficulty(2)
                                    }} variant="outlined" sx={{
                                        borderRadius: "28px", color: difficulty === 2 ? "white" : "black", borderColor: "black", "&:hover":
                                        {
                                            backgroundColor: "#FA6952", color: "white"
                                        }, backgroundColor: difficulty === 2 ? "#FA6952" : "white"
                                    }}><b>Pro</b></Button>
                                </div>
                            </AccordionDetails>
                        </Accordion>

                        <Accordion>
                            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Typography className="unselectable" sx={{ fontSize: "18px", width: '33%', flexShrink: 0 }}>
                                    <b>Ascent</b>
                                </Typography>
                                <Typography className="unselectable" sx={{ fontSize: "18px", color: 'text.secondary' }}>{ascentStatic}m</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                    Insert here the ascent for your ideal hike.
                                </Typography>
                                <TextField onChange={(e) => {
                                    e.target.value === "" ? setAscent(0.0) : setAscent(parseFloat(e.target.value))
                                }} variant="outlined" label="Ascent" sx={{ width: "100%" }} />
                            </AccordionDetails>
                        </Accordion>
                    </Grid>
                    <Grid item sx={{ marginTop: "24px" }}>
                        <Typography sx={{ fontSize: "20px" }}>
                            <b>Select which parameters you want us to consider while suggesting you the best hikes based on your preferences.</b>
                        </Typography>
                        <FormGroup>
                            <FormControlLabel control={<Checkbox onChange={() => { setIsStartingPoint(!isStartingPoint) }} checked={isStartingPoint} />} label="Starting point" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsRadius(!isRadius) }} checked={isRadius} />} label="Radius" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsLength(!isLength) }} checked={isLength} />} label="Length" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsExpectedTime(!isExpectedTime) }} checked={isExpectedTime} />} label="Expected time" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsDifficulty(!isDifficulty) }} checked={isDifficulty} />} label="Difficulty" />
                            <FormControlLabel control={<Checkbox onChange={() => { setIsAscent(!isAscent) }} checked={isAscent} />} label="Ascent" />
                        </FormGroup>
                    </Grid>
                    <Grid item xs={12} sm={12} sx={{ marginTop: "28px", display: "flex", justifyContent: "right" }}>
                        {updateFinished ? <div style={{ marginRight: "25px" }}>
                            <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                <b>Your preferences have been correctly updated.</b>
                            </Typography>
                        </div> : <></>}
                        {updateError ? <div style={{ marginRight: "25px" }}>
                            <Typography className="unselectable" sx={{ fontSize: "18px" }}>
                                <b>There's been an error with your preferences. Check fields value.</b>
                            </Typography>
                        </div> : <></>}
                        <FormControlLabel control={<MaterialUISwitch onChange={e => { setSuggestionType(!suggestionType) }} defaultChecked />} label={!suggestionType ? "Beginner" : "Advanced"} />
                        <Button variant="filled"
                            onClick={handlePreferencesUpdate}
                            sx={{
                                backgroundColor: "green", color: "white",
                                borderRadius: "50px",
                                "&:hover": { backgroundColor: "darkgreen" }
                            }}>
                            Update preferences
                        </Button>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
    width: 62,
    height: 34,
    padding: 7,
    '& .MuiSwitch-switchBase': {
        margin: 1,
        padding: 0,
        transform: 'translateX(6px)',
        '&.Mui-checked': {
            color: '#fff',
            transform: 'translateX(22px)',
            '& .MuiSwitch-thumb:before': {
                backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 0 16 16"><path fill="${encodeURIComponent(
                    '#fff',
                )}" d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16Zm.25-14.75v1.5a.25.25 0 0 1-.5 0v-1.5a.25.25 0 0 1 .5 0Zm0 12v1.5a.25.25 0 1 1-.5 0v-1.5a.25.25 0 1 1 .5 0ZM4.5 1.938a.25.25 0 0 1 .342.091l.75 1.3a.25.25 0 0 1-.434.25l-.75-1.3a.25.25 0 0 1 .092-.341Zm6 10.392a.25.25 0 0 1 .341.092l.75 1.299a.25.25 0 1 1-.432.25l-.75-1.3a.25.25 0 0 1 .091-.34ZM2.28 4.408l1.298.75a.25.25 0 0 1-.25.434l-1.299-.75a.25.25 0 0 1 .25-.434Zm10.392 6 1.299.75a.25.25 0 1 1-.25.434l-1.3-.75a.25.25 0 0 1 .25-.434ZM1 8a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 0 .5h-1.5A.25.25 0 0 1 1 8Zm12 0a.25.25 0 0 1 .25-.25h1.5a.25.25 0 1 1 0 .5h-1.5A.25.25 0 0 1 13 8ZM2.03 11.159l1.298-.75a.25.25 0 0 1 .25.432l-1.299.75a.25.25 0 0 1-.25-.432Zm10.392-6 1.299-.75a.25.25 0 1 1 .25.433l-1.3.75a.25.25 0 0 1-.25-.434ZM4.5 14.061a.25.25 0 0 1-.092-.341l.75-1.3a.25.25 0 0 1 .434.25l-.75 1.3a.25.25 0 0 1-.342.091Zm6-10.392a.25.25 0 0 1-.091-.342l.75-1.299a.25.25 0 1 1 .432.25l-.75 1.3a.25.25 0 0 1-.341.09ZM6.494 1.415l.13.483a.25.25 0 1 1-.483.13l-.13-.483a.25.25 0 0 1 .483-.13ZM9.86 13.972l.13.483a.25.25 0 1 1-.483.13l-.13-.483a.25.25 0 0 1 .483-.13ZM3.05 3.05a.25.25 0 0 1 .354 0l.353.354a.25.25 0 0 1-.353.353l-.354-.353a.25.25 0 0 1 0-.354Zm9.193 9.193a.25.25 0 0 1 .353 0l.354.353a.25.25 0 1 1-.354.354l-.353-.354a.25.25 0 0 1 0-.353ZM1.545 6.01l.483.13a.25.25 0 1 1-.13.483l-.483-.13a.25.25 0 1 1 .13-.482Zm12.557 3.365.483.13a.25.25 0 1 1-.13.483l-.483-.13a.25.25 0 1 1 .13-.483Zm-12.863.436a.25.25 0 0 1 .176-.306l.483-.13a.25.25 0 1 1 .13.483l-.483.13a.25.25 0 0 1-.306-.177Zm12.557-3.365a.25.25 0 0 1 .176-.306l.483-.13a.25.25 0 1 1 .13.483l-.483.13a.25.25 0 0 1-.306-.177ZM3.045 12.944a.299.299 0 0 1-.029-.376l3.898-5.592a.25.25 0 0 1 .062-.062l5.602-3.884a.278.278 0 0 1 .392.392L9.086 9.024a.25.25 0 0 1-.062.062l-5.592 3.898a.299.299 0 0 1-.382-.034l-.005-.006Zm3.143 1.817a.25.25 0 0 1-.176-.306l.129-.483a.25.25 0 0 1 .483.13l-.13.483a.25.25 0 0 1-.306.176ZM9.553 2.204a.25.25 0 0 1-.177-.306l.13-.483a.25.25 0 1 1 .483.13l-.13.483a.25.25 0 0 1-.306.176Z"/></svg>')`,
            },
            '& + .MuiSwitch-track': {
                opacity: 1,
                backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
            },
        },
    },
    '& .MuiSwitch-thumb': {
        backgroundColor: theme.palette.mode === 'dark' ? '#003892' : '#001e3c',
        width: 32,
        height: 32,
        '&:before': {
            content: "''",
            position: 'absolute',
            width: '100%',
            height: '100%',
            left: 0,
            top: 0,
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="21" width="21" viewBox="0 0 18 18"><path fill="${encodeURIComponent(
                '#fff',
            )}" d="M4.5 1A1.5 1.5 0 0 0 3 2.5V3h4v-.5A1.5 1.5 0 0 0 5.5 1h-1zM7 4v1h2V4h4v.882a.5.5 0 0 0 .276.447l.895.447A1.5 1.5 0 0 1 15 7.118V13H9v-1.5a.5.5 0 0 1 .146-.354l.854-.853V9.5a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5v.793l.854.853A.5.5 0 0 1 7 11.5V13H1V7.118a1.5 1.5 0 0 1 .83-1.342l.894-.447A.5.5 0 0 0 3 4.882V4h4zM1 14v.5A1.5 1.5 0 0 0 2.5 16h3A1.5 1.5 0 0 0 7 14.5V14H1zm8 0v.5a1.5 1.5 0 0 0 1.5 1.5h3a1.5 1.5 0 0 0 1.5-1.5V14H9zm4-11H9v-.5A1.5 1.5 0 0 1 10.5 1h1A1.5 1.5 0 0 1 13 2.5V3z"/></svg>')`,
        },
    },
    '& .MuiSwitch-track': {
        opacity: 1,
        backgroundColor: theme.palette.mode === 'dark' ? '#8796A5' : '#aab4be',
        borderRadius: 20 / 2,
    },
}));

const ClickServiceManagement = (props) => {
    const map = useMap()
    map.on('click', (e) => {
        props.setPosition({ 'lat': e.latlng.lat, 'lon': e.latlng.lng })
    })
}

const FetchServiceManagement = (props) => {
    const map = useMap()
    useEffect(() => {
        map.flyTo([props.position.lat, props.position.lon], 11)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.position])
}

const HikerDashboardMap = (props) => {
    const _circleCreated = (e) => {
        props.setRadiusFilter([[e.layer.toGeoJSON().geometry.coordinates[1], e.layer.toGeoJSON().geometry.coordinates[0]], e.layer.getRadius() / 1000.0])
    }

    const _circleEdited = (e) => {
        console.log(e)
    }

    const _circleDeleted = (e) => {
        console.log(e)
    }

    return (
        <div>
            <MapContainer center={props.centerPosition} zoom={9}
                scrollWheelZoom={{ xs: false, sm: false, md: false, lg: true, xl: true }} zoomControl={false}
                style={{ width: "auto", minHeight: "40vh", height: "40%" }}>
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
                <ZoomControl position='bottomright' />
                <Marker
                    key={"center"}
                    position={props.centerPosition}>
                </Marker>
            </MapContainer>
        </div>
    );
}

export default HikerDashboard;