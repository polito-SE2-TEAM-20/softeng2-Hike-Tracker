import * as React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import {FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import API from '../API/API.js';

function StartPointSelect(props) {

    return <>
      <FormControl fullWidth required>
        <Select
          labelId="demo-simple-select-label"
          id="demo-seimple-select"
          value={props.startPointType}
          fullWidth
          name="startPointType"
          variant="standard"
          label="startPointType"
          onChange={ev => props.setStartPointType(ev.target.value)}
        >
          <MenuItem value={0} >
            GPS coordinates as Start Point
          </MenuItem>
          <MenuItem value={1}>
            Choose a Parking Lot as Start Point
          </MenuItem>
          <MenuItem value={2}>
            Choose an Hut as Start Point
          </MenuItem>
        </Select>
      </FormControl>
      {
        props.startPointType === 0 &&  <StartCoordinates {...props}/>
      }
      {
        props.startPointType === 1 &&  <StartParking {...props}/>
      }
      {
        props.startPointType ===2 &&  <StartHut {...props}/>
      }
    </>
  }

  export {StartPointSelect}



function StartCoordinates(props) {
    console.log(props.startPointType)

    if(props.startPointType===0 && props.positionsState.length!==0){
        props.setHutId(null);
        props.setParkingId(null);
       props.setStartPointLat(props.positionsState[0][0]);
       console.log("set start point lat")
       console.log(props.positionsState[0][0])
       props.setStartPointLon(props.positionsState[0][1]);
       console.log("set start point lon")
       console.log(props.positionsState[0][1])

       props.setStartPointAdd(props.information.display_name);
       console.log("set start point address")
       console.log(props.information.display_name)
    }
    return <>
  <Grid item xs={12} sm={12}>
                    <TextField
                      required id="startPointName"
                      name="startPointName" label="Start Point Name"
                      fullWidth autoComplete="startPointName"
                      variant="standard" type="text"
                      value={props.startPointName}
                      onChange={(e) => props.setStartPointName(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      id="startPointAdd"
                      name="startPointAdd" label="Start  Point Address"
                      fullWidth autoComplete="startPointAdd" variant="standard"
                      value={props.startPointAdd}
                      onChange={(e) => props.setStartPointAdd(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      name="startPointLat"
                      label="Start Point Latitude"
                      variant="standard"
                      type="text"
                      fullWidth
                      value={props.startPointLat}
                      onChange={(e) => props.setStartPointLat(e.target.value)}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12}>
                    <TextField
                      required
                      name="startPointLon"
                      label="Start Point Longitude"
                      fullWidth
                      variant="standard"
                      min={0}
                      value={props.startPointLon}
                      onChange={(e) => props.setStartPointLon(e.target.value)}
                    />
                  </Grid>
    </>
  }


function StartHut(props) {

    const [listHutsPl, setListHutsPl] = useState([]);
    const [listHuts, setListHuts] = useState([]);

    useEffect(() => {
        if(props.startPointType===2){
            props.setStartPointLat(null);
            props.setStartPointLon(null);
            var loh = []
        let radiusPoint= {lon: parseFloat(props.positionsState[0][1]), lat: parseFloat(props.positionsState[0][0]), radiusKms:5}
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
      if(props.hutId !== null && props.hutId !== ''){
          let element = listHuts.filter((el)=> el.id === props.hutId);
          console.log(element);
          console.log(element[0]?.point.address);
          props.setStartPointAdd(element[0]?.point.address)
      }
      
  }, [props.hutId])
    
  
  return <>

    <FormControl fullWidth required sx={{mt: 3}}>
        <InputLabel id="demo-simple-select-label">Choose an hut</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-seimple-select"
          value={props.hutId}
          fullWidth
          name="hutId"
          variant="standard"
          label="Hut"
          onChange={ev => {props.setHutId(ev.target.value); props.setParkingId(null)}}
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

function StartParking(props) {

    const [listHutsPl, setListHutsPl] = useState([]);
    const [listParking, setListParking] = useState([]);

    useEffect(() => {
        if(props.startPointType===1){
            props.setStartPointAdd('');
            props.setStartPointLat(null);
            props.setStartPointLon(null);
            var loh = []
        let radiusPoint= {lon: parseFloat(props.positionsState[0][1]), lat: parseFloat(props.positionsState[0][0]), radiusKms:5}
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
      if(props.parkingId !== null && props.parkingId!== ''){
          let element = listParking.filter((el)=> el.id === props.parkingId);
          console.log(element);
          console.log(element[0]?.point.address);
          props.setStartPointAdd(element[0]?.point.address);
          
      }
      
  }, [props.parkingId])
    
  
  return <>

    <FormControl fullWidth required sx={{mt: 3}}>
        <InputLabel id="demo-simple-select-label">Choose a parking lot</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-seimple-select"
          value={props.parkingId}
          fullWidth
          name="parkingId"
          variant="standard"
          label="Parking"
          onChange={ev => {props.setParkingId(ev.target.value); props.setHutId(null)}}
        >
            {
                
                listParking.map((el) => { 
                    return(
                        
            <MenuItem value={el?.id} >
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