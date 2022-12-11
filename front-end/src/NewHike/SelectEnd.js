import * as React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {  FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import API from '../API/API.js';

function EndPointSelect(props) {

    return <>
      <FormControl fullWidth required>
        <Select
          labelId="demo-simple-select-label"
          id="demo-seimple-select"
          value={props.endPointType}
          fullWidth
          name="endPointType"
          variant="standard"
          label="endPointType"
          onChange={ev => props.setEndPointType(ev.target.value)}
        >
          <MenuItem value={0} >
            GPS coordinates as End Point
          </MenuItem>
          <MenuItem value={1}>
            Choose a Parking Lot as End Point
          </MenuItem>
          <MenuItem value={2}>
            Choose an Hut as End Point
          </MenuItem>
        </Select>
      </FormControl>
      {
        props.endPointType === 0 &&  <EndCoordinates {...props}/>
      }
      {
        props.endPointType === 1 &&  <EndParking {...props}/>
      }
      {
        props.endPointType ===2 &&  <EndHut {...props}/>
      }
    </>
  }

  export {EndPointSelect}



function EndCoordinates(props) {
    console.log(props.endPointType)

    if(props.endPointType===0 && props.positionsState.length!==0){
        props.setHutIdEnd(null);
        props.setParkingIdEnd(null);
        props.setEndPointLat(props.positionsState[props.positionsState.length - 1][0]);
        console.log("set end point lat")
        console.log(props.positionsState[props.positionsState.length - 1][0])
        
        props.setEndPointLon(props.positionsState[props.positionsState.length - 1][1]);

        console.log("set end point lon")
        console.log(props.positionsState[props.positionsState.length - 1][1])

        props.setEndPointAdd(props.informationEnd.display_name);

        console.log("set end point lat")
        console.log(props.informationEnd.display_name)

    }
    return <>
  <Grid item xs={12} sm={12}>
                    <TextField
                      required id="endPointName"
                      name="endPointName" label="End Point Name"
                      fullWidth autoComplete="endPointName"
                      variant="standard" type="text"
                      value={props.endPointName}
                      onChange={(e) => props.setEndPointName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="endPointAdd"
                      name="endPointAdd" label="End  Point Address"
                      fullWidth autoComplete="endPointAdd" variant="standard"
                      value={props.endPointAdd}
                      onChange={(e) => props.setEndPointAdd(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      name="endPointLat"
                      label="End Point Latitude"
                      variant="standard"
                      type="text"
                      fullWidth
                      value={props.endPointLat}
                      onChange={(e) => props.setEndPointLat(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      name="endPointLon"
                      label="End Point Longitude"
                      fullWidth
                      variant="standard"
                      min={0}
                      value={props.endPointLon}
                      onChange={(e) => props.setEndPointLon(e.target.value)}
                    />
                  </Grid>
    </>
  }


function EndHut(props) {

    const [listHutsPl, setListHutsPl] = useState([]);
    const [listHuts, setListHuts] = useState([]);

    useEffect(() => {
        if(props.endPointType===2){
            props.setEndPointLat(null);
            props.setEndPointLon(null);
            var loh = []
        let radiusPoint= {lon: parseFloat(props.positionsState[props.positionsState.length - 1][1]), lat: (props.positionsState[props.positionsState.length - 1][0]), radiusKms:5}
        const getHutsPlot = async () => {
            loh = await API.getListOfHutsAndParkingLots(radiusPoint);
        }
        getHutsPlot().then(() => {
            console.log(loh);
            setListHutsPl(loh);
            setListHuts(loh.huts);
            console.log(loh.huts);
        });
        }
    }, [])


    useEffect(() => {
        if(props.hutIdEnd !== null && props.hutIdEnd!== ''){
            let element = listHuts.filter((el)=> el.id === props.hutIdEnd);
            console.log(element);
            console.log(element[0]?.point.address);
            props.setEndPointAdd(element[0]?.point.address)
        }
        
    }, [props.hutIdEnd])
    
  
  return <>

    <FormControl fullWidth required sx={{mt: 3}}>
        <InputLabel id="demo-simple-select-label">Choose an hut</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-seimple-select"
          value={props.hutIdEnd}
          fullWidth
          name="hutIdEnd"
          variant="standard"
          label="Hut"
          onChange={ev => {props.setHutIdEnd(ev.target.value); props.setParkingIdEnd(null)}}
        >
            {
                listHuts.map((el) => { 
                    {console.log(el)}
                    return(
                        
            <MenuItem value={el.id} >
            <Grid item xs={12} sm={12}>
                    <TextField
                      name="hutName"
                      label="Hut name"
                      fullWidth
                      //disabled
                      variant="standard"
                      value={el.title}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="coordinates"
                      label="Coordinates"
                      fullWidth
                      //disabled
                      variant="standard"
                      value={el.point.position.coordinates}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="address"
                      label="Address"
                      fullWidth
                      //disabled
                      variant="standard"
                      value={el.point.address}
                    />
                  </Grid>
          </MenuItem>
                    )
                })
            }
        </Select>
      </FormControl>
    
</>
  }

function EndParking(props) {

    const [listHutsPl, setListHutsPl] = useState([]);
    const [listParking, setListParking] = useState([]);

    useEffect(() => {
        if(props.endPointType===1){
            props.setEndPointLat(null);
            props.setEndPointLon(null);
            var loh = []
        let radiusPoint= {lon: parseFloat(props.positionsState[props.positionsState.length - 1][1]), lat: parseFloat(props.positionsState[props.positionsState.length - 1][0]), radiusKms:5}
        const getHutsPlot = async () => {
            loh = await API.getListOfHutsAndParkingLots(radiusPoint);
        }
        getHutsPlot().then(() => {
            console.log(loh);
            setListHutsPl(loh);
            setListParking(loh.parkingLots);
            console.log(loh.parkingLots);
        });
        }
    }, [])


    useEffect(() => {
        if(props.parkingIdEnd !== null && props.parkingIdEnd!== ''){
            let element = listParking.filter((el)=> el.id === props.parkingIdEnd);
            console.log(element);
            console.log(element[0]?.point.address);
            props.setEndPointAdd(element[0]?.point.address);

        }
    }, [props.parkingIdEnd])
    
  
  return <>

    <FormControl fullWidth required sx={{mt: 3}}>
        <InputLabel id="demo-simple-select-label">Choose a parking lot</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-seimple-select"
          value={props.parkingIdEnd}
          fullWidth
          name="parkingIdEnd"
          variant="standard"
          label="Parking"
          onChange={ev => {props.setParkingIdEnd(ev.target.value); props.setHutIdEnd(null)}}
        >
            {
                listParking.map((el) => { 
                    return(
                        
            <MenuItem value={el.id} >
            <Grid item xs={12} sm={12}>
                    <TextField
                      name="parkingName"
                      label="Parking name"
                      fullWidth
                      //disabled
                      variant="standard"
                      value={el?.point.name}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="spots"
                      label="Spots"
                      fullWidth
                      //disabled
                      variant="standard"
                      value={el?.maxCars}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12}>
                    <TextField
                      name="address"
                      label="Address"
                      fullWidth
                      //disabled
                      variant="standard"
                      value={el.point.address}

                    />
                  </Grid>
          </MenuItem>
                    )
          

                })
            }
        </Select>
      </FormControl>
    
</>
  }