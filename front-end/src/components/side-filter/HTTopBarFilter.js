import { Grid, Paper } from "@mui/material";
import Button from '../../components/buttons/Button'
import './httopfilter-style.css'
import HTDropdown from './HTDropdown'
import { useEffect, useState } from "react";
import HTSlider from './HTSlider'

const HTTopBarFilter = (props) => {
    const displayType =
    {
        mobile: {
            xs: "flex",
            sm: "flex",
            md: "none",
            lg: "none",
            xl: "none"
        },
        tablet: {
            xs: "none",
            sm: "none",
            md: "flex",
            lg: "none",
            xl: "none"
        },
        pc: {
            xs: "none",
            sm: "none",
            md: "none",
            lg: "flex",
            xl: "flex"
        }
    }

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

    const getMax = (a, b) => Math.max(a, b);
    const resetAllFields = () => {
        setRegion("")
        setProvince("")
        setLength([0, maxLen])
        setExpTime([0, maxExpTime])
        setDiff([0, maxDiff])
        setAsc([0, maxAsc])
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
        setLength([0, maxLen])
        setExpTime([0, maxExpTime])
        setDiff([0, maxDiff])
        setAsc([0, maxAsc])
    }, [props.listOfHikes])

    return (
        <>
            <Grid container item lg={3} columns={12} spacing={0} sx={{ display: displayType.pc }} style={{
                borderStyle: "solid", borderColor: "#f2f2f2", width: "100vw", justifyContent: "center",
                paddingTop: "15px", paddingBottom: "15px", position: "fixed", zIndex: "1", height: "70vh", marginTop: "25px", marginLeft: "25px",
                borderRadius: "8px", backgroundColor: "#fbfbfb"
            }}>
                <Grid item lg={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTDropdown dataset={regions} hint="Region" setFun={setRegion} val={region} />
                </Grid>
                <Grid item lg={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTDropdown dataset={provinces} hint="Province" setFun={setProvince} val={province} />
                </Grid>
                <Grid item lg={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={length} setFun={setLength} max={maxLen} text="Length" />
                </Grid>
                <Grid item lg={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={expTime} setFun={setExpTime} max={maxExpTime} text="Expected time" />
                </Grid>
                <Grid item lg={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={diff} setFun={setDiff} max={maxDiff} text="Difficulty" />
                </Grid>
                <Grid item lg={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={asc} setFun={setAsc} max={maxAsc} text="Ascent" />
                </Grid>

                <Grid lg={12} item style={{ display: "flex", justifyContent: "center" }}>
                    <Grid item>
                        <Button text="Apply filters" size="16px" textColor="white" navigate={() => {
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
                    <Grid item style={{ marginLeft: "12px" }}>
                        <Button text="Reset filters" size="16px" textColor="white" navigate={() => {
                            resetAllFields();
                        }} />
                    </Grid>
                </Grid>
            </Grid>

            <Grid container item xs={12} sm={12} columns={12} spacing={0} sx={{ display: displayType.mobile }} style={{
                borderStyle: "solid", borderColor: "#f2f2f2", width: "100vw", justifyContent: "center",
                paddingTop: "15px", paddingBottom: "15px",
                zIndex: "1", height: "70vh", marginTop: "25px", marginLeft: "auto", marginRight: "auto",
                borderRadius: "8px", backgroundColor: "#fbfbfb"
            }}>
                <Grid item xs={12} sm={12} sx={{display: "flex", justifyContent: "center"}}>
                    <HTDropdown dataset={regions} hint="Region" setFun={setRegion} val={region} />
                </Grid>
                <Grid item xs={12} sm={12} sx={{display: "flex", justifyContent: "center"}}>
                    <HTDropdown dataset={provinces} hint="Province" setFun={setProvince} val={province} />
                </Grid>
                <Grid item xs={12} sm={12} sx={{display: "flex", justifyContent: "center"}}>
                    <HTSlider value={length} setFun={setLength} max={maxLen} text="Length" />
                </Grid>
                <Grid item xs={12} sm={12} sx={{display: "flex", justifyContent: "center"}}>
                    <HTSlider value={expTime} setFun={setExpTime} max={maxExpTime} text="Expected time" />
                </Grid>
                <Grid item xs={12} sm={12} sx={{display: "flex", justifyContent: "center"}}>
                    <HTSlider value={diff} setFun={setDiff} max={maxDiff} text="Difficulty" />
                </Grid>
                <Grid item xs={12} sm={12} sx={{display: "flex", justifyContent: "center"}}>
                    <HTSlider value={asc} setFun={setAsc} max={maxAsc} text="Ascent" />
                </Grid>

                <Grid xs={12} sm={12} item style={{ display: "flex", justifyContent: "center" }}>
                    <Grid item>
                        <Button text="Apply filters" size="16px" textColor="white" navigate={() => {
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
                    <Grid item style={{ marginLeft: "12px" }}>
                        <Button text="Reset filters" size="16px" textColor="white" navigate={() => {
                            resetAllFields();
                        }} />
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default HTTopBarFilter