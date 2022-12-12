import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { MapHut } from '../NewHut/MapHut';


function AddressInformationParking(props) {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        Parking Address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="name"
            name="name"
            label="Name of the Parking"
            fullWidth
            autoComplete="name"
            variant="standard"
            value={props.name}
            onChange={(e) => { props.setName(e.target.value) }}

          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="spots"
            name="spots"
            label="Maximum number of spots"
            fullWidth
            autoComplete="spots"
            variant="standard"
            value={props.spots}
            onChange={(e) => { props.setSpots(e.target.value) }}

          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            
            id="country"
            name="country"
            label="Country"
            fullWidth
            disabled
            autoComplete="country"
            variant="standard"

            value={props.country}
            onChange={(e) => { props.setCountry(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            
            id="region"
            name="region"
            label="Region"
            fullWidth
            disabled
            autoComplete="region"
            variant="standard"

            value={props.region}
            onChange={(e) => { props.setRegion(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            
            id="province"
            name="province"
            label="Province"
            fullWidth
            disabled
            autoComplete="province"
            variant="standard"

            value={props.province}
            onChange={(e) => { props.setProvince(e.target.value) }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="city"
            name="city"
            label="City"
            fullWidth
            disabled
            autoComplete="city"
            variant="standard"

            value={props.city}
            onChange={(e) => { props.setCity(e.target.value) }}
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

            value={props.latitude}
            onChange={(e) => { props.setLatitude(e.target.value) }}
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

            value={props.longitude}
            onChange={(e) => { props.setLongitude(e.target.value) }}
          />
        </Grid>

        <Grid item xs={12} >
          <TextField
            id="address"
            name="address"
            label="Address"
            fullWidth
            autoComplete="address"
            variant="standard"

            value={props.address}
            onChange={(e) => { props.setAddress(e.target.value) }}
          />
        </Grid>

      </Grid>
      <Grid sx={{ mt: 2 }}>
        <MapHut {...props} />
      </Grid>
    </React.Fragment>
  );
}

export { AddressInformationParking }