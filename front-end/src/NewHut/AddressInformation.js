import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import styled from '@emotion/styled'
import { MapHut } from './MapHut';


function AddressInformation(props) {
    const lookup = require('country-code-lookup');

    

  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Hut Address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            name="name"
            label="Name of the Hut"
            fullWidth
            autoComplete="name"
            variant="standard"
            value ={props.name}
            onChange={(e) => {props.setName(e.target.value)}}

        />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="elevation"
            name="elevation"
            label="Elevation [m]"
            fullWidth
            autoComplete="elevation"
            variant="standard"
            required
            value ={props.elevation}
            onChange={(e) => {props.setElevation(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="country"
            variant="standard"
            value ={props.country}
            onChange={(e) => {props.setCountry(e.target.value); console.log(lookup.byCountry(e.target.value))}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="region"
            name="region"
            label="Region"
            fullWidth
            autoComplete="region"
            variant="standard"

            value ={props.region}
            onChange={(e) => {props.setRegion(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="province"
            name="province"
            label="Province"
            fullWidth
            autoComplete="province"
            variant="standard"

            value ={props.province}
            onChange={(e) => {props.setProvince(e.target.value)}}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="city"
            variant="standard"

            value ={props.city}
            onChange={(e) => {props.setCity(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="latitude"
            name="latitude"
            label="Latitude"
            fullWidth
            autoComplete="latitude"
            variant="standard"

            value ={props.latitude}
            onChange={(e) => {props.setLatitude(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="longitude"
            name="longitude"
            label="Longitude"
            fullWidth
            autoComplete="longitude"
            variant="standard"
            
            value ={props.longitude}
            onChange={(e) => {props.setLongitude(e.target.value)}}
          />
        </Grid>

        <Grid item xs={12} >
          <TextField
            required
            id="address"
            name="address"
            label="Address"
            fullWidth
            autoComplete="address"
            variant="standard"
            
            value ={props.address}
            onChange={(e) => {props.setAddress(e.target.value)}}
          />
        </Grid>
        
        
      </Grid>

      <Typography variant="h6" gutterBottom>
       Choose a Point from the map!
      </Typography>
      <Grid sx={{mt:2}}>
      <MapHut {...props}/>
      </Grid>
    </React.Fragment>
  );
}

export {AddressInformation}


