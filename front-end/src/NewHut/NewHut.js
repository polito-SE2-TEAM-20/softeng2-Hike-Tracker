import { HutDescription } from "./HutDescription";
import { AddressInformation } from './AddressInformation';
import { ReviewHutForm } from "./ReviewHutForm";
import { useState, useEffect } from 'react';
import * as React from 'react';
import {Grid} from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import AppBar from '@mui/material/AppBar';
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
import HTNavbar from '../components/HTNavbar/HTNavbar';

import Alert from '@mui/material/Alert';
import {MapHut} from './MapHut.js';


import login from '../Assets//login.jpg'; // Import using relative path
import { useNavigate } from "react-router";




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

const steps = ['Hut Address', 'Hut information', 'Review hut infos'];

const theme = createTheme(

);

function NewHutForm(props) {
    const navigate = useNavigate();
    const [name, setName] = useState(''); 
    // location of the hut
    const [elevation, setElevation] = useState(''); // elevation in meters
    const [latitude, setLatitude] = useState('');
    const [longitude, setLongitude] = useState('');
    const [city, setCity] = useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [address, setAddress] = useState('');
    const [country, setCountry] = useState('');

    // contact details of the HuT
    const [owner, setOwner] = useState('');
    const [website, setWebsite] = useState('');
    const [emailAddress, setEmailAddress] = useState('');

    // services / facilities
    const [beds, setBeds] = useState(''); // number of beds
    // const [foodSupply, setFoodSupply] = useState(''); // one of: none / simple buffet / diner / restaurant
    const [price, setPrice] = useState('');

    // other informations
    const [description, setDescription] = useState('');
  const [activeStep, setActiveStep] = React.useState(0);

  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);


  const handleNext = () => {
    if(activeStep ===(steps.length - 3)){
        if([name, latitude, longitude, region, province, address, city].some(t=> t.length ===0)){
        setErrorMessage("All fields with the * should be filled");
        setShow(true);
    }else if(name.match(/^\s+$/)){
        setErrorMessage("insert a valid name for the hut");
        setShow(true);
    {/*else if(!province.match(/^[a-zA-Z]+[a-zA-Z]+$/) || !region.match(/^[a-zA-Z]+[a-zA-Z]+$/) ){
            setErrorMessage("insert a valid name for region and province");
            setShow(true);
            //check if the coordinate are with the comma or the point*/}
    }
    else if(!latitude.toString().match(/^[-+]?([0-9]*[.])?[0-9]+$/)) {
            setErrorMessage("insert a valid value for the latitude ");
            setShow(true);
    }else if(!longitude.toString().match(/^[-+]?([0-9]*[.])?[0-9]+$/)) {
            setErrorMessage("insert a valid value for the longitude ");
            setShow(true);
    }else if(address.indexOf(',') > -1) {
            setErrorMessage("insert an address without commas ");
            setShow(true);
}else{
        setShow(false);
        setActiveStep(activeStep + 1);
    }}else if(activeStep===(steps.length - 2)){
        if(beds === '' || price === '' || beds === null || price === null){
 setErrorMessage("All fields with the * should be filled");
            setShow(true);
        }else{
        setShow(false);
        setActiveStep(activeStep + 1);
    }}else if(activeStep === (steps.length - 1) ){
        //cosa cambia tra title e name???
        let add = [address, city, province, region, country];
        console.log(add.join(','))
        let object = {title: name, elevation: parseFloat(elevation), description: 'd',  website: website, ownerName: owner, numberOfBeds: parseInt(beds), location : {lat: parseFloat(latitude), lon: parseFloat(longitude), name: name, address: add.join(",")}, price: parseFloat(price)}
        setShow(false);
        setActiveStep(activeStep + 1);
        props.addNewHut(object).catch((err)=> {setErrorMessage(err); setShow(true)})

    }
  };


  const handleClear =() =>{
    if(activeStep ===(steps.length - 3)){
    setName(''); setElevation(''); setLatitude(''); setLongitude(''); setRegion(''); setProvince(''); setAddress('');
    setCountry(''); setCity(''); setElevation('');
    }else if(activeStep ===(steps.length - 2)){
         setWebsite(''); setOwner(''); setEmailAddress(''); setBeds(''); setDescription(''); setPrice('');
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
        return <AddressInformation name={name} setName = {setName} elevation={elevation} setElevation={setElevation} setLatitude={setLatitude} latitude={latitude} 
        longitude={longitude} setLongitude={setLongitude} region={region} setRegion={setRegion} province={province} 
       setProvince={setProvince} address={address} setAddress={setAddress} city={city} setCity={setCity} country={country} setCountry={setCountry}/>;
      case 1:
        return <HutDescription owner={owner} setOwner={setOwner} website={website} setWebsite={setWebsite} emailAddress={emailAddress} 
        setEmailAddress={setEmailAddress} beds={beds} setBeds={setBeds} description={description} setDescription={setDescription}
         price={price} setPrice={setPrice}/>;
      case 2:
        return <ReviewHutForm name={name}  elevation={elevation}  latitude={latitude} 
        longitude={longitude} region={region}  province={province} 
        address={address} owner={owner}  website={website}  emailAddress={emailAddress} 
        beds={beds} description={description} price={price} country={country} city={city}/>;
      default:
        throw new Error('Unknown step');
    }
  }
  const gotoLogin = () => {
    navigate("/login", { replace: false })
}

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
      <Grid container spacing={0} sx={{ backgroundImage: `url(${login})`, minHeight: "100vh", height: "100%", minWidth: "100vw", width: "100%" }}>
      <Container component="main" maxWidth="sm" sx={{ mb: 4, mt: 9 }} >
        
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} >
          <Typography component="h1" variant="h4" align="center">
            ADD A NEW HUT
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
                HUT INSERTED
              </Typography>
              <Typography variant="subtitle1">
                Your new hut {name} has been inserted
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
                  <Alert sx={{mt: 3}} variant="outlined" severity="error"  onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
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
                  {activeStep === steps.length - 1 ? 'Enter the new Hut' : 'Next'}
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

export {NewHutForm}
