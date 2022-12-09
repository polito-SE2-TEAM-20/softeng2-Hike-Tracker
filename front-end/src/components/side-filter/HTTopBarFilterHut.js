import { Grid } from "@mui/material";
import Button from '../buttons/Button'
import './httopfilter-style.css'
import { useEffect, useState } from "react";
import HTSlider from './HTSlider'
import { displayTypeFlex } from '../../extra/DisplayType';

const HTTopBarFilterHut = (props) => {
    const [maxPrice, setMaxPrice] = useState(0)
    const [price, setPrice] = useState([0, 0])

    const [maxNumOfBeds, setMaxNumOfBeds] = useState(0)
    const [numOfBeds, setNumOfBeds] = useState([0, 0])

    const [maxAltitude, setMaxAltitude] = useState(0)
    const [altitude, setAltitude] = useState([0, 0])

    const getMax = (a, b) => Math.max(a, b);
    const resetAllFields = () => {
        props.setFilter(
            {
                "priceMin": null,
                "priceMax": null,
                "numberOfBedsMin": null,
                "numberOfBedsMax": null
            }
        )
    }

    useEffect(() => {
        setMaxPrice(props?.listOfHuts.map(x => x.price).reduce(getMax, 0))
        setMaxNumOfBeds(props?.listOfHuts.map(x => x.numberOfBeds).reduce(getMax, 0))
        setMaxAltitude(props?.listOfHuts.map(x => x.altitude).reduce(getMax, 0))
    }, [props.listOfHuts])

    useEffect(() => {
        setPrice([0, maxPrice])
    }, [maxPrice])
    useEffect(() => {
        setNumOfBeds([0, maxNumOfBeds])
    }, [maxNumOfBeds])

    return (
        <>
            {/**
             * PC
             */}
            <Grid container item lg={3} xl={3} columns={12} spacing={0} sx={{ display: displayTypeFlex.pc }} style={{
                borderStyle: "solid", borderColor: "#f2f2f2", width: "100vw", justifyContent: "center",
                paddingTop: "15px", paddingBottom: "15px", position: "fixed", zIndex: "1", height: "30vh", marginTop: "25px", marginLeft: "25px",
                borderRadius: "8px", backgroundColor: "#fbfbfb"
            }}>
                <Grid item lg={12} xl={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={price} setFun={setPrice} max={maxPrice} text="Price" />
                </Grid>
                <Grid item lg={12} xl={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={numOfBeds} setFun={setNumOfBeds} max={maxNumOfBeds} text="Number of beds" />
                </Grid>
                {
                    // <Grid item lg={12} xl={12} style={{ display: "flex", justifyContent: "center" }}>
                    //     <HTSlider value={altitude} setFun={setAltitude} max={maxAltitude} text="Altitude" />
                    // </Grid>
                }


                <Grid lg={12} item style={{ display: "flex", justifyContent: "center" }}>
                    <Grid item>
                        <Button text="Apply filters" size="16px" textColor="white" navigate={() => {
                            props.setFilter(
                                {
                                    "priceMin": price[0],
                                    "priceMax": price[1],
                                    "numberOfBedsMin": numOfBeds[0],
                                    "numberOfBedsMax": numOfBeds[1]
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

            {/**
             * MOBILE
             */}
            <Grid container item xs={12} sm={12} columns={12} spacing={0} sx={{ display: displayTypeFlex.mobile }} style={{
                borderStyle: "solid", borderColor: "#f2f2f2", width: "100vw", justifyContent: "center",
                paddingTop: "15px", paddingBottom: "15px",
                zIndex: "1", height: "40vh", marginTop: "25px", marginLeft: "auto", marginRight: "auto",
                borderRadius: "8px", backgroundColor: "#fbfbfb"
            }}>
                <Grid item xs={12} sm={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={price} setFun={setPrice} max={maxPrice} text="Price" />
                </Grid>
                <Grid item xs={12} sm={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={numOfBeds} setFun={setNumOfBeds} max={maxNumOfBeds} text="Number of beds" />
                </Grid>
                {
                    // <Grid item xs={12} sm={12} style={{ display: "flex", justifyContent: "center" }}>
                    //     <HTSlider value={altitude} setFun={setAltitude} max={maxAltitude} text="Altitude" />
                    // </Grid>
                }

                <Grid xs={12} sm={12} item style={{ display: "flex", justifyContent: "center" }}>
                    <Grid item>
                        <Button text="Apply filters" size="16px" textColor="white" navigate={() => {
                            props.setFilter(
                                {
                                    "priceMin": 0,
                                    "priceMax": 0,
                                    "numberOfBedsMin": 0,
                                    "numberOfBedsMax": 0
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

            {/**
             * TABLET
             */}
            <Grid container item md={12} columns={12} spacing={0} sx={{ display: displayTypeFlex.tablet }} style={{
                borderStyle: "solid", borderColor: "#f2f2f2", width: "100vw", justifyContent: "center",
                paddingTop: "15px", paddingBottom: "15px",
                zIndex: "1", height: "40vh", marginTop: "25px", marginLeft: "auto", marginRight: "auto",
                borderRadius: "8px", backgroundColor: "#fbfbfb"
            }}>
                <Grid item md={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={price} setFun={setPrice} max={maxPrice} text="Price" />
                </Grid>
                <Grid item md={12} style={{ display: "flex", justifyContent: "center" }}>
                    <HTSlider value={numOfBeds} setFun={setNumOfBeds} max={maxNumOfBeds} text="Number of beds" />
                </Grid>
                {
                    // <Grid item xs={12} sm={12} style={{ display: "flex", justifyContent: "center" }}>
                    //     <HTSlider value={altitude} setFun={setAltitude} max={maxAltitude} text="Altitude" />
                    // </Grid>
                }

                <Grid md={12} item style={{ display: "flex", justifyContent: "center" }}>
                    <Grid item>
                        <Button text="Apply filters" size="16px" textColor="white" navigate={() => {
                            props.setFilter(
                                {
                                    "priceMin": 0,
                                    "priceMax": 0,
                                    "numberOfBedsMin": 0,
                                    "numberOfBedsMax": 0
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

export default HTTopBarFilterHut