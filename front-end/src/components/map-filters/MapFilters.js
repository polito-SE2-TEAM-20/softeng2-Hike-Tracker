import { Chip, Divider, Grid, Paper } from "@mui/material"
import * as React from 'react';
import { useState, useEffect } from "react";
import HTButton from "../buttons/Button";
import { displayTypeFlex } from '../../extra/DisplayType';
import { TextDialog, SliderDialog } from './Dialogs'

const MapFilters = (props) => {
    const getMax = (a, b) => Math.max(a, b);
    const [openRegion, setOpenRegion] = useState(false);
    const [openProvince, setOpenProvince] = useState(false);
    const [openExpTime, setOpenExpTime] = useState(false);
    const [openLength, setOpenLength] = useState(false);
    const [openAscent, setOpenAscent] = useState(false);
    const [openDiff, setOpenDiff] = useState(false);
    const chipVariants = ["outlined", "filled"];

    var regions = []
    const [region, setRegion] = useState("")

    var provinces = []
    const [province, setProvince] = useState("")

    const [maxLen, setMaxLen] = useState(0)
    const [length, setLength] = useState([0, 0])

    const [maxExpTime, setMaxExpTime] = useState(0)
    const [expTime, setExpTime] = useState([0, 0])

    const [maxDiff, setMaxDiff] = useState(0)
    const [diff, setDiff] = useState([0, 0])

    const [maxAsc, setMaxAsc] = useState(0)
    const [asc, setAsc] = useState([0, 0])

    if (props.loading) {
        regions = Array.from(
            props?.listOfHikes.filter(x => { if (province != "") return x.province === province; return true })
                .map(x => x.region).filter(x => x !== undefined && x !== '')
                .reduce((set, x) => set.add(x), new Set()))
    }

    if (props.loading) {
        provinces = Array.from(
            props?.listOfHikes.filter(x => { if (region != "") return x.region === region; return true })
                .map(x => x.province).filter(x => x !== undefined && x !== '')
                .reduce((set, x) => set.add(x), new Set()))
    }

    useEffect(() => {
        setMaxLen(props?.listOfHikes.map(x => x.length).reduce(getMax, 0))
        setMaxExpTime(props?.listOfHikes.map(x => x.expectedTime).reduce(getMax, 0))
        setMaxDiff(props?.listOfHikes.map(x => x.difficulty).reduce(getMax, 0))
        setMaxAsc(props?.listOfHikes.map(x => x.ascent).reduce(getMax, 0))
    }, [props.listOfHikes])

    useEffect(() => {
        setLength([0, maxLen])
    }, [maxLen])
    useEffect(() => {
        setExpTime([0, maxExpTime])
    }, [maxExpTime])
    useEffect(() => {
        setDiff([0, maxDiff])
    }, [maxDiff])
    useEffect(() => {
        setAsc([0, maxAsc])
    }, [maxAsc])

    const resetAllFields = () => {
        setRegion("")
        setProvince("")
        props.setFilter(
            {
                "province": null,
                "region": null,
                "minLength": null,
                "maxLength": null,
                "expectedTimeMin": null,
                "expectedTimeMax": null,
                "difficultyMin": null,
                "difficultyMax": null,
                "ascentMin": null,
                "ascentMax": null
            }
        )
    }
    return (
        <>
            {/**
            * PC
            */}
            <Paper elevation={5} sx={{ display: displayTypeFlex.pc }} style={{ width: "300px", height: "fit-content", borderRadius: "25px", backgroundColor: "#ffffff", marginLeft: "15px", padding: "25px", zIndex: "15", position: "fixed" }}>
                <Grid zeroMinWidth columns={12} container spacing={1} >
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={region === "" ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenRegion(true) }} label="Region" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={province === "" ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenProvince(true) }} label="Province" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={length[0] == 0 && length[1] == maxLen ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenLength(true) }} label="Length" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={expTime[0] == 0 && expTime[1] == maxExpTime ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenExpTime(true) }} label="Expected time" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={asc[0] == 0 && asc[1] == maxAsc ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenAscent(true) }} label="Ascent" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={diff[0] == 0 && diff[1] == maxDiff ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenDiff(true) }} label="Difficulty" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left", marginTop: "50px"}} md={6} lg={6} xl={6}>
                        <HTButton text="Apply" color="black" textColor="white" size="14px" navigate={() => {
                            props.setFilter(
                                {
                                    "province": province === "" ? null : province,
                                    "region": region === "" ? null : region,
                                    "minLength": length[0],
                                    "maxLength": length[1],
                                    "expectedTimeMin": expTime[0],
                                    "expectedTimeMax": expTime[1],
                                    "difficultyMin": diff[0],
                                    "difficultyMax": diff[1],
                                    "ascentMin": asc[0],
                                    "ascentMax": asc[1]
                                }
                            )
                        }} />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left", marginTop: "50px"}} md={6} lg={6} xl={6}>
                        <HTButton text="Reset" color="black" textColor="white" size="14px" navigate={resetAllFields} />
                    </Grid>
                </Grid >
                <TextDialog dataset={regions} open={openRegion} setOpen={setOpenRegion} value={region} setFun={setRegion} text="Region" />
                <TextDialog dataset={provinces} open={openProvince} setOpen={setOpenProvince} value={province} setFun={setProvince} text="Province" />
                <SliderDialog max={maxLen} open={openLength} setOpen={setOpenLength} value={length} setFun={setLength} text="Length" />
                <SliderDialog max={maxExpTime} open={openExpTime} setOpen={setOpenExpTime} value={expTime} setFun={setExpTime} text="Expected time" />
                <SliderDialog max={maxDiff} open={openDiff} setOpen={setOpenDiff} value={diff} setFun={setDiff} text="Difficulty" />
                <SliderDialog max={maxAsc} open={openAscent} setOpen={setOpenAscent} value={asc} setFun={setAsc} text="Ascent" />

            </Paper>

            {/**
            * TABLET
            */}
            <Paper elevation={5} sx={{ display: displayTypeFlex.tablet }} style={{ width: "300px", height: "fit-content", borderRadius: "25px", backgroundColor: "#ffffff", marginLeft: "15px", padding: "25px", zIndex: "15", position: "fixed" }}>
                <Grid zeroMinWidth columns={12} container spacing={1}>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={region === "" ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenRegion(true) }} label="Region" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={province === "" ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenProvince(true) }} label="Province" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={length[0] == 0 && length[1] == maxLen ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenLength(true) }} label="Length" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={expTime[0] == 0 && expTime[1] == maxExpTime ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenExpTime(true) }} label="Expected time" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={asc[0] == 0 && asc[1] == maxAsc ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenAscent(true) }} label="Ascent" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left"}} md={6} lg={6} xl={6}>
                        <Chip variant={diff[0] == 0 && diff[1] == maxDiff ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenDiff(true) }} label="Difficulty" clickable />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left", marginTop: "50px"}} md={6} lg={6} xl={6}>
                        <HTButton text="Apply" color="black" textColor="white" size="14px" navigate={() => {
                            props.setFilter(
                                {
                                    "province": province === "" ? null : province,
                                    "region": region === "" ? null : region,
                                    "minLength": length[0],
                                    "maxLength": length[1],
                                    "expectedTimeMin": expTime[0],
                                    "expectedTimeMax": expTime[1],
                                    "difficultyMin": diff[0],
                                    "difficultyMax": diff[1],
                                    "ascentMin": asc[0],
                                    "ascentMax": asc[1]
                                }
                            )
                        }} />
                    </Grid>
                    <Grid item sx={{display: "flex", justifyContent: "left", marginTop: "50px"}} md={6} lg={6} xl={6}>
                        <HTButton text="Reset" color="black" textColor="white" size="14px" navigate={resetAllFields} />
                    </Grid>
                </Grid >
                <TextDialog dataset={regions} open={openRegion} setOpen={setOpenRegion} value={region} setFun={setRegion} text="Region" />
                <TextDialog dataset={provinces} open={openProvince} setOpen={setOpenProvince} value={province} setFun={setProvince} text="Province" />
                <SliderDialog max={maxLen} open={openLength} setOpen={setOpenLength} value={length} setFun={setLength} text="Length" />
                <SliderDialog max={maxExpTime} open={openExpTime} setOpen={setOpenExpTime} value={expTime} setFun={setExpTime} text="Expected time" />
                <SliderDialog max={maxDiff} open={openDiff} setOpen={setOpenDiff} value={diff} setFun={setDiff} text="Difficulty" />
                <SliderDialog max={maxAsc} open={openAscent} setOpen={setOpenAscent} value={asc} setFun={setAsc} text="Ascent" />

            </Paper>

            {/**
            * MOBILE
            */}
            <Paper elevation={5} sx={{ display: displayTypeFlex.mobile }} style={{ width: "100%", height: "200px", backgroundColor: "#ffffff", marginLeft: "auto", marginRight: "auto", padding: "25px", zIndex: "15", position: "fixed" }}>
                <Grid zeroMinWidth container spacing={1} direction="row">
                    <Grid item xs={3}>
                        <Chip variant={region === "" ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenRegion(true) }} label="Region" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip variant={province === "" ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenProvince(true) }} label="Province" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip variant={length[0] == 0 && length[1] == maxLen ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenLength(true) }} label="Length" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip variant={expTime[0] == 0 && expTime[1] == maxExpTime ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenExpTime(true) }} label="Expected time" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip variant={asc[0] == 0 && asc[1] == maxAsc ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenAscent(true) }} label="Ascent" clickable />
                    </Grid>
                    <Grid item xs={3}>
                        <Chip variant={diff[0] == 0 && diff[1] == maxDiff ? chipVariants[0] : chipVariants[1]} onClick={() => { setOpenDiff(true) }} label="Difficulty" clickable />
                    </Grid>
                    <Grid item container columns={12} zeroMinWidth style={{ display: "flex", justifyContent: "center" }}>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                            <HTButton text="Apply" color="black" textColor="white" size="14px" navigate={() => {
                                props.setFilter(
                                    {
                                        "province": province === "" ? null : province,
                                        "region": region === "" ? null : region,
                                        "minLength": length[0],
                                        "maxLength": length[1],
                                        "expectedTimeMin": expTime[0],
                                        "expectedTimeMax": expTime[1],
                                        "difficultyMin": diff[0],
                                        "difficultyMax": diff[1],
                                        "ascentMin": asc[0],
                                        "ascentMax": asc[1]
                                    }
                                )
                            }} />
                        </Grid>
                        <Grid item xs={6} sx={{ display: "flex", justifyContent: "center", marginTop: "15px" }}>
                            <HTButton text="Reset" color="black" textColor="white" size="14px" navigate={resetAllFields} />
                        </Grid>
                    </Grid>
                </Grid >
                <TextDialog dataset={regions} open={openRegion} setOpen={setOpenRegion} value={region} setFun={setRegion} text="Region" />
                <TextDialog dataset={provinces} open={openProvince} setOpen={setOpenProvince} value={province} setFun={setProvince} text="Province" />
                <SliderDialog max={maxLen} open={openLength} setOpen={setOpenLength} value={length} setFun={setLength} text="Length" />
                <SliderDialog max={maxExpTime} open={openExpTime} setOpen={setOpenExpTime} value={expTime} setFun={setExpTime} text="Expected time" />
                <SliderDialog max={maxDiff} open={openDiff} setOpen={setOpenDiff} value={diff} setFun={setDiff} text="Difficulty" />
                <SliderDialog max={maxAsc} open={openAscent} setOpen={setOpenAscent} value={asc} setFun={setAsc} text="Ascent" />


            </Paper>
        </>

    )
}

export default MapFilters
