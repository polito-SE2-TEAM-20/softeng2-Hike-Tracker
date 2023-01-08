import { HutDescription } from "./HutDescription";
import { AddressInformation } from './AddressInformation';
import { ReviewHutForm } from "./ReviewHutForm";
import { useState } from 'react';
import * as React from 'react';
import { Grid } from '@mui/material'
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Paper from '@mui/material/Paper';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import API from '../API/API.js';
import {UserRoles} from '../lib/common/UserRoles'



import Alert from '@mui/material/Alert';


import login from '../Assets//login.jpg'; // Import using relative path
import { useNavigate } from "react-router";

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
  const [phoneNumber, setPhoneNumber] = useState('');

  const [beds, setBeds] = useState('');
  const [price, setPrice] = useState('');

  // other informations
  const [description, setDescription] = useState('');
  const [activeStep, setActiveStep] = React.useState(0);

  const [errorMessage, setErrorMessage] = useState('');
  const [show, setShow] = useState(false);

  const [hutId, setHutId] = useState(-1);
  const [positionShow, setPositionsShow] = useState(false);
  const [pictures, setPictures] = useState([]);
  const [picData, setPicData] = useState([]);

  const handleUpload = event => {
    const fileUploaded = event.target.files[0];
    setPictures(fileUploaded);
    console.log(event.target.files[0])
    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e);
      setPicData({ 'id': pictures.name, 'img': reader.result })
      console.log(reader.result);
    };
    if (event.target.files[0] && event.target.files) {
      reader.readAsDataURL(fileUploaded);
    }
  }


  const handleDeleteLocal = () => {
    setPicData([])
    setPictures([])
  }



  const handleNext = () => {
    let addresssSenzaVirgole = address.split(',')[0]
    if (activeStep === (steps.length - 3)) {
      if ([name, latitude, longitude].some(t => t.length === 0)) {
        setErrorMessage("All fields with the * should be filled");
        setShow(true);

      } else if (!latitude.toString().match(/^[-+]?([0-9]*[.])?[0-9]+$/)) {
        setErrorMessage("insert a valid value for the latitude ");
        setShow(true);
      } else if (!longitude.toString().match(/^[-+]?([0-9]*[.])?[0-9]+$/)) {
        setErrorMessage("insert a valid value for the longitude ");
        setShow(true);
      } else if (addresssSenzaVirgole.indexOf(',') > -1) {

        setErrorMessage("insert an address without commas ");
        setShow(true);
      } else {
        setShow(false);
        setActiveStep(activeStep + 1);
      }
    } else if (activeStep === (steps.length - 2)) {
      if (beds === '' || price === '' || beds === null || price === null || phoneNumber === '' || phoneNumber === null || phoneNumber === undefined || emailAddress === null || emailAddress === '') {
        setErrorMessage("All fields with the * should be filled");
        setShow(true);
      } else if (pictures.length === 0) {
        setErrorMessage("insert a picture of the hut ");
        setShow(true);
      } else {
        setShow(false);
        setActiveStep(activeStep + 1);
      }
    } else if (activeStep === (steps.length - 1)) {
      let add = [addresssSenzaVirgole, city, province, region, country];
      console.log(add.join(','))
      let object = {
        title: name, elevation: parseFloat(elevation), description: description,
        website: website, ownerName: owner, numberOfBeds: parseInt(beds),
        location: { lat: parseFloat(latitude), lon: parseFloat(longitude), name: name, address: add.join(",") },
        price: parseFloat(price), phoneNumber: phoneNumber, email: emailAddress
      }
      setShow(false);
      setActiveStep(activeStep + 1);

      props.addNewHut(object)
        .then(newHut => {
          console.log(newHut);
          setHutId(newHut.id);
          setShow(false);
          setErrorMessage('');
          const formData = new FormData();
          formData.append("pictures", pictures);
          API.setHutPictures({ 'hutID': newHut.id, 'pictures': formData })
        })
        .catch(err => {
          setShow(true);
          setErrorMessage(err);
        })

    }
  };


  const handleClear = () => {
    if (activeStep === (steps.length - 3)) {
      setName(''); setElevation(''); setLatitude(''); setLongitude(''); setRegion(''); setProvince(''); setAddress('');
      setCountry(''); setCity(''); setElevation('');
    } else if (activeStep === (steps.length - 2)) {
      setWebsite(''); setOwner(''); setEmailAddress(''); setBeds(''); setDescription(''); setPrice(''); setPhoneNumber('');
      setPicData([]); setPictures([]);
    }


  };
  const goBackLocalGuide = () => {
    navigate('/');
  };

  const goToshowHut = () => {
    navigate(`/showHut/${hutId}`)

  }

  const goToAddNewHut = () => {
    navigate('/newHut');

  }

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <AddressInformation name={name} setName={setName} elevation={elevation} setElevation={setElevation} setLatitude={setLatitude} latitude={latitude}
          longitude={longitude} setLongitude={setLongitude} region={region} setRegion={setRegion} province={province}
          setProvince={setProvince} address={address} setAddress={setAddress} city={city} setCity={setCity} country={country} setCountry={setCountry}
          positionShow={positionShow} setPositionsShow={setPositionsShow} />;
      case 1:
        return <HutDescription owner={owner} setOwner={setOwner} website={website} setWebsite={setWebsite} emailAddress={emailAddress}
          setEmailAddress={setEmailAddress} beds={beds} setBeds={setBeds} description={description} setDescription={setDescription}
          price={price} setPrice={setPrice} phoneNumber={phoneNumber} setPhoneNumber={setPhoneNumber} handleDeleteLocal={handleDeleteLocal} handleUpload={handleUpload} pictures={pictures} picData={picData} />;
      case 2:
        return <ReviewHutForm name={name} elevation={elevation} latitude={latitude}
          longitude={longitude} region={region} province={province}
          address={address} owner={owner} website={website} emailAddress={emailAddress}
          beds={beds} description={description} price={price} country={country} city={city} phoneNumber={phoneNumber} />;
      default:
        throw new Error('Unknown step');
    }
  }

  if (
    props.user?.role !== UserRoles.LOCAL_GUIDE) {
    navigate('/unauthorized')
}

  return (
    <ThemeProvider theme={theme} >
      <CssBaseline />
      <Grid container sx={{ backgroundImage: `url(${login})`, minHeight: "100vh", height: "100%", minWidth: "100vw", width: "100%" }}>
        <Container component="main" sx={{ mb: 4, mt: 1 }} >

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
                {
                  errorMessage === '' ? (
                    <>
                      <Typography variant="h5" gutterBottom>
                        HUT INSERTED
                      </Typography>
                      <Typography variant="subtitle1">
                        Your new hut {name} has been inserted
                      </Typography>
                      <Button onClick={goBackLocalGuide} sx={{ mt: 3, ml: 1 }}>
                        Go Back
                      </Button>
                      <Button onClick={goToshowHut} sx={{ mt: 3, ml: 5 }}>
                        Go to hut deatils
                      </Button>
                    </>

                  ) : (
                    <>
                      <Typography variant="h5" gutterBottom>
                        HUT NOT INSERTED
                      </Typography>
                      <Typography variant="subtitle1">
                        Something went wrong: {errorMessage}
                      </Typography>
                      <Button onClick={goBackLocalGuide} sx={{ mt: 3, ml: 1 }}>
                        Go Back
                      </Button>
                      <Button onClick={goToAddNewHut} sx={{ mt: 3, ml: 5 }}>
                        Add new hut
                      </Button>
                    </>)
                }

              </React.Fragment>
            ) : (
              <>
                <React.Fragment>
                  {getStepContent(activeStep)}

                  {
                    show ?
                      <Alert sx={{ mt: 3 }} variant="outlined" severity="error" onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
                  }
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                    {activeStep !== 0 && (
                      <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                        Back
                      </Button>
                    )}
                    {activeStep !== steps.length - 1 && (
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
                  </Box>
                </React.Fragment>
              </>
            )}

          </Paper>
          <Copyright />

        </Container>
      </Grid>
    </ThemeProvider>
  );
}

export { NewHutForm }
