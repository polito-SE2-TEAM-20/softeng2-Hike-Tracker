import * as React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { MapHut } from './MapHut';


function AddressInformation(props) {
    const lookup = require('country-code-lookup');
    // const [showPosition, setShowPosition] = useState(false);

    const handleShow= () =>{
      props.setPositionShow(true);
    }
    

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
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="country"
            variant="standard"
            disabled
            value ={props.country}
            onChange={(e) => {props.setCountry(e.target.value); console.log(lookup.byCountry(e.target.value))}}
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

            value ={props.region}
            onChange={(e) => {props.setRegion(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="province"
            name="province"
            label="Province"
            fullWidth
            autoComplete="province"
            variant="standard"
            disabled
            value ={props.province}
            onChange={(e) => {props.setProvince(e.target.value)}}
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

        <Grid item xs={12} sx ={{mb:2}}>
          <TextField
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

      <Typography variant="h7" gutterBottom sx={{mt:100}}>
       Choose a Point from the map or insert the coordinates of the hut! 
       
       {/*} <Button onClick={setShowPosition(true)}>SHOW on the map</Button>*/}
      </Typography>
      {/*<Button
                        variant="contained"
                        //startIcon={<DeleteIcon />}
                        onClick={handleShow}
                        sx={{ mt: 3, ml: 1 }}
                        //color="error"
                      >
                        {'Show on the map '}
  </Button>*/}
      <Grid sx={{mt:2}}>
      <MapHut {...props}/>
      </Grid>
    </React.Fragment>
  );
}

export {AddressInformation}


