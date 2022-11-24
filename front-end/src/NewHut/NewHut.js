import { HutDescription } from "./HutDescription";
import { AddressInformation } from './AddressInformation';
import { ReviewHutForm } from "./ReviewHutForm";
import { useState } from 'react';


import * as React from 'react';
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

import Alert from '@mui/material/Alert';


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
    const [elevation, setElevation] = useState(null); // elevation in meters
    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [address, setAddress] = useState('');

    // contact details of the HuT
    const [owner, setOwner] = useState('');
    const [website, setWebsite] = useState('');
    const [emailAddress, setEmailAddress] = useState('');

    // services / facilities
    const [beds, setBeds] = useState(null); // number of beds
    const [foodSupply, setFoodSupply] = useState(null); // one of: none / simple buffet / diner / restaurant
    const [price, setPrice] = useState(null);

    // other informations
    const [description, setDescription] = useState('');
  const [activeStep, setActiveStep] = React.useState(0);

  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);

  const handleNext = () => {
    if(activeStep ===(steps.length - 3)){
        if(name === ''){
            setErrorMessage('Insert a valid name for the Hut');
            setShow(true)
        }else if(latitude === null || latitude === ''){

            setErrorMessage('Insert a valid value for the latitude');
            setShow(true)
        }
        else if(longitude === null || longitude === ''){

            setErrorMessage('Insert a valid value for the longitude');
            setShow(true)
        }
        else if(region === ''){
            setErrorMessage('Insert a valid value for the region');
            setShow(true)
        }
        else if(province === ''){
            setErrorMessage('Insert a valid value for the province');
            setShow(true)
        }
        else if(address === '' ){
            setErrorMessage('Insert a valid value for the address');
            setShow(true)
        }else{
            console.log('arrivo qui')
            setActiveStep(activeStep + 1);
            
        }

    }else if(activeStep===(steps.length - 2)){
        if(beds=== null){
            setErrorMessage('Insert a valid value for the number of beds');
            setShow(true)
        }else if(description === ''){

            setErrorMessage('Insert a valid description for the hut');
            setShow(true)
        }else{
            console.log('secondo if')
            setActiveStep(activeStep + 1);
        }
    }else if(activeStep === (steps.length - 1) ){
        
        {/*let numberOfBeds = parseInt(beds);
        let lat = parseFloat(latitude);
        let lon = parseFloat(longitude);
    let pri = parseFloat(price)*/}

        //cosa cambia tra title e name???
        let object = {title: name, description: description, numberOfBeds: parseInt(beds), location : {lat: parseFloat(latitude), lon: parseFloat(longitude), name: name, address:address}, price: parseFloat(price)}
setActiveStep(activeStep + 1);
        props.addNewHut(object).catch((err)=> {setErrorMessage(err); setShow(true)})

    }


    
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddressInformation name={name} setName = {setName} elevation={elevation} setElevation={setElevation} setLatitude={setLatitude} latitude={latitude} 
        longitude={longitude} setLongitude={setLongitude} region={region} setRegion={setRegion} province={province} 
       setProvince={setProvince} address={address} setAddress={setAddress}/>;
      case 1:
        return <HutDescription owner={owner} setOwner={setOwner} website={website} setWebsite={setWebsite} emailAddress={emailAddress} 
        setEmailAddress={setEmailAddress} beds={beds} setBeds={setBeds} description={description} setDescription={setDescription}
         price={price} setPrice={setPrice}/>;
      case 2:
        return <ReviewHutForm name={name}  elevation={elevation}  latitude={latitude} 
        longitude={longitude} region={region}  province={province} 
        address={address} owner={owner}  website={website}  emailAddress={emailAddress} 
        beds={beds} description={description} price={price}/>;
      default:
        throw new Error('Unknown step');
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {/*<AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: 'relative',
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      >
        <Toolbar>
          <Typography variant="h6" color="inherit" noWrap>
            Hike Tracking
          </Typography>
        </Toolbar>
      </AppBar>*/}

      <Container component="main" maxWidth="sm" sx={{ mb: 4 }}>
        <Paper variant="outlined" sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }} style={styles.paperContainer}>
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
            </React.Fragment>
          ) : (

            <React.Fragment>
              {getStepContent(activeStep)}

        {
                show?
                  <Alert variant="outlined" severity="error"  onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
              }
              <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Back
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={handleNext}
                  sx={{ mt: 3, ml: 1 }}
                >
                  {activeStep === steps.length - 1 ? 'Enter the new Hut' : 'Next'}
                </Button>
              </Box>
            </React.Fragment>
          )}
        </Paper>
        <Copyright />
      </Container>
    </ThemeProvider>
  );
}

export {NewHutForm}