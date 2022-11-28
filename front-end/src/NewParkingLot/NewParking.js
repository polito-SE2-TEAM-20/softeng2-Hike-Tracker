import { AddressInformationParking } from './AddressInformationParking';
import { ReviewParkingForm } from "./ReviewParkingForm";
import { useState, useEffect } from 'react';
import * as React from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Toolbar from '@mui/material/Toolbar';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/material/Alert';
import login from '../Assets//login.jpg'; // Import using relative path
import { useNavigate } from "react-router";
import {Grid} from '@mui/material'
import HTNavbar from '../components/HTNavbar/HTNavbar'



const styles = {
    paperContainer: {
        backgroundImage: `url(${login})`
    }
};

function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {'Copyright © '}
      <Link color="inherit" href="/">
        Hiker
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

const steps = ['Parking information',  'Review parking infos'];

const theme = createTheme(
);

function NewParking(props) {
    const navigate = useNavigate();
    const [name, setName] = useState(''); 
    // location of the hut
    //const [elevation, setElevation] = useState(''); // elevation in meters
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');
    const [city, setCity] = useState('');

    const [spots, setSpots] = useState(''); // number of spots
    // const [price, setPrice] = useState('');
    // other informations
  // const [description, setDescription] = useState('');
  const [activeStep, setActiveStep] = React.useState(0);

  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);


  const handleNext = () => {
    if(activeStep === (steps.length - 2)){
        if([name, latitude, longitude, country, region, province, city, address].some(t=> t.length ===0)){
        setErrorMessage("All fields with the * should be filled");
        setShow(true);
    }else if(name.toString().match(/^\s+$/)){
        setErrorMessage("insert a valid name for the hut");
        setShow(true);
    }else if(!province.match(/^[a-zA-Z]+[a-zA-Z]+$/) || !region.match(/^[a-zA-Z]+[a-zA-Z]+$/) || !country.match(/^[a-zA-Z]+[a-zA-Z]+$/) || !city.match(/^[a-zA-Z]+[a-zA-Z]+$/)){
            setErrorMessage("insert a valid name for country, region, province and city");
            setShow(true);
            //check if the coordinate are with the comma or the point
    }else if(!latitude.toString().match(/^([0-9]*[.])?[0-9]+$/)) {
            setErrorMessage("insert a valid value for the latitude ");
            setShow(true);
    }else if(!longitude.toString().match(/^([0-9]*[.])?[0-9]+$/)) {
            setErrorMessage("insert a valid value for the longitude ");
            setShow(true);
        }else if([spots].some(t=> t.length ===0)){
                setErrorMessage("All fields with the * should be filled");
                setShow(true);
}else{
        setShow(false);
        setActiveStep(activeStep + 1);
    }}else if(activeStep === (steps.length - 1) ){
        let object = {maxCars: parseInt(spots), country: country, region: region, province : province, city: city, location :{lat: parseFloat(latitude), lon: parseFloat(longitude), name: name, address: address}}
        setShow(false);
        setActiveStep(activeStep + 1);
        props.addNewParkingLot(object).catch((err)=> {setErrorMessage(err); setShow(true)});
        {/*{ 
    "maxCars": 2, 
    "country": "Italy", 
    "region": "Piemonte", 
    "province": "Torino", 
    "city": "Torino", 
    "location": { 
        "lat": 5.056, 
        "lon": 4.0586, 
        "name": "testF", 
        "address": "testF" 
    } 
}*/ }
    }
  };


  const handleClear =() =>{
    if(activeStep ===(steps.length - 3)){
    setName('');  setLatitude(''); setLongitude(''); setCountry(''); setRegion(''); setProvince(''); 
    setCity('');  setAddress('');  setSpots(''); 
    setCountry('');
    }
  };

  const goBackLocalGuide = () => {
    navigate('/localGuide');
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddressInformationParking name={name} setName = {setName} 
        setLatitude={setLatitude} latitude={latitude} longitude={longitude} setLongitude={setLongitude} region={region} 
        setRegion={setRegion} province={province} 
       setProvince={setProvince} address={address} setAddress={setAddress} country={country} setCountry={setCountry} city={city} 
       setCity={setCity} spots={spots} setSpots={setSpots} />;
      case 1:
        return <ReviewParkingForm name={name}    latitude={latitude} 
        longitude={longitude} region={region}  province={province}  country={country} city={city}
        address={address} spots={spots}  />;
      default:
        throw new Error('Unknown step');
    }
  }

  const gotoLogin = () => {
    navigate("/login", { replace: false })
  }
  const gotoLocalGuide = () => {
    navigate("/localGuide", { replace: false })
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} navigate={gotoLocalGuide} />
      <Grid container spacing={0} sx={{ backgroundImage: `url(${login})`, minHeight: "100vh", height: "100%", minWidth: "100vw", width: "100%" }}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4 , mt:8 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} >
          <Typography component="h1" variant="h4" align="center">
            ADD A NEW PARKING LOT
          </Typography>
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                PARKING LOT INSERTED
              </Typography>
              <Typography variant="subtitle1">
                Your new parking lot {name} has been inserted
              </Typography>
              <Button onClick={goBackLocalGuide} sx={{ mt: 3, ml: 1 }}>
                    Go to my page
                  </Button>
            </React.Fragment>
          ) : (
            <>
          {/*<Box component="form" onSubmit={handleNext}>*/}
            <React.Fragment>
              {getStepContent(activeStep)}

        {
                show?
                  <Alert sx={{mt: 3}}variant="outlined" severity="error"  onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
              }
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}
                {activeStep !==steps.length -1 &&( 
                 <Button
                  variant="contained"
                  startIcon={<DeleteIcon />}
                  onClick={handleClear}
                  sx={{ mt: 3, ml: 1 }}
                  color="error"
                >
                  {'Reset'}
                </Button>
                )}
                <Button
                  variant="contained"
                  onClick={handleNext}
                  type="submit"
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Enter the new Parking Lot' : 'Next'}
                </Button>
               {/*<MapHut latitude={latitude} longitude={longitude}/>*/}
              </Box>
            </React.Fragment>
            {/*</Box>*/}
            </>
          )}
          
        </Paper>
        <Copyright />
        
      </Container>
      </Grid>
    </ThemeProvider>
  );
}

export {NewParking}
