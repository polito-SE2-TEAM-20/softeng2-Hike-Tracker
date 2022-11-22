import * as React from 'react';
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { spacing } from '@mui/system';
import { Button, Box } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import UploadFileIcon from "@mui/icons-material/UploadFile";





import HTNavbar from '../components/HTNavbar/HTNavbar'



function HTAddHike(props){

    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContents, setFileContents] = useState(null);
    const [isFilePicked, setIsFilePicked] = useState(false);

    const [title, setTitle] = useState('');
    const [lengthStr, setLengthStr] = useState('');
    const [ascentStr, setAscentStr] = useState('');
    const [expectedTimeStr, setExpectedTimeStr] = useState('');
    const [expectedTimeMinutes, setExpectedTimeMinutes] = useState('');

    const [difficultyStr, setDifficultyStr] = useState('');
    const [country, setCountry] =useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [startPoint, setStartPoint] = useState();
    const [endPoint, setEndPoint ] = useState();
    const [referencePoints, setReferencePoints] = useState([]);
    //points can be: address, name of location, GPS coordinates, hut, parking lot
    // const [listReferencePoint, setListReferencePoint] = useState();
    const [description, setDescription] = useState();
    const [positionsState, setPositionsState] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState('');
    const [listReferencePoint, setListReferencePoint] = useState();
    //{ [name: "prova1", address: "provaAdd", lon: 4.5 ,  lat: 4.3]
    const [presenceWayPoints, setPresenceWaypoints] = useState(false);



    const hiddenFileInput = React.useRef(null);
    const handleClick = event => {
        hiddenFileInput.current.click();
    };

    const handleChange = event => {
        const fileUploaded = event.target.files[0];
        setIsFilePicked(true);
        setSelectedFile(fileUploaded);

        const reader = new FileReader()
        reader.onload = (e) => {
            setFileContents(reader.result)
        };
        if(event.target.files[0] && event.target.files){

        reader.readAsText(fileUploaded)
        // props.handleFile(fileUploaded);
        }

    };



    useEffect(() => {
        if (fileContents) {
            let gpxParser = require('gpxparser');
            var gpx = new gpxParser();
            gpx.parse(fileContents);
            const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
            // controllare perchè se non ci sono i punti da errore


            setPositionsState(positions);
            setStartPoint(positions[0]);
            setEndPoint(positions[positions.length-1]);

            setDescription(gpx.tracks[0].desc);
            setDifficultyStr(gpx.tracks[0].type);
            setAscentStr(gpx.tracks[0].elevation.pos);
            setTitle(gpx.tracks[0].name);
            setLengthStr(gpx.tracks[0].distance.total);
            console.log(gpx);
            console.log(gpx.tracks[0].points.map(p => [p.lat, p.lon]));
        }

    }, [fileContents]);


    const handleSubmit = (event) => {
        event.preventDefault();
        if(title.trim().length === 0){
            setErrorMessage('The title cannot be empty')
        }else{
            const length = parseFloat(lengthStr);
            let a = expectedTimeStr.split(':'); // split it at the colons
            let minutes = parseInt(a[0])*60 + parseInt(a[1]);

            console.log(expectedTimeStr)
            setExpectedTimeMinutes(minutes);
            console.log(minutes);
            const expectedTime = parseInt(minutes);
            const ascent = parseFloat(ascentStr);
            const difficulty = parseFloat(difficultyStr);
            const formData = new FormData();
                formData.append('gpxFile', selectedFile);
                formData.append('title', title);
                formData.append('length', length);
                formData.append('expectedTime', expectedTime);
                formData.append('ascent', ascent);
                formData.append('difficulty', difficulty);
                formData.append('description', description);
                formData.append('region', region);
                formData.append('province', province);
                //add start point and end point
                console.log(formData.items);
            
            props.addNewGpx(formData).catch((err)=> {setErrorMessage(err); setShow(true)})
            navigate('/localGuide');
        }

    }

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }
    const gotoLocalGuide = () => {
        navigate("/localGuide", { replace: false })
    }



  return (
    <React.Fragment>
        {/*
        <Grid container spacing={0} style={{ backgroundColor: "#ffffff", height: "100%", minHeight: "100vh" }}>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} navigate={gotoLocalGuide} />
  */}
      <Typography variant="h6" gutterBottom sx={{ p: 2 }} mt={12}>
        INSERT A NEW HIKE
      </Typography>
        <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={12} sm={6}>
        <Button
        component="label"
        variant="outlined"
        startIcon={<UploadFileIcon />}
        sx={{ marginRight: "1rem" }}
        onClick ={handleClick}
      >
        Upload gpx
         </Button>
        <input type="file" accept=".gpx" hidden ref={hiddenFileInput} onChange={handleChange} style={{ display: 'none' }} />
     
        </Grid>
        <Grid item xs={12} sm={6}>
            {selectedFile ?(
                <Grid>
                    Filename: {selectedFile?.name}
                </Grid>
            ):
            (
                <Grid>
                    Select a file to show details
                </Grid>
            )}
        </Grid>
        </Grid>
      <Typography variant="h6" gutterBottom sx={{ p: 2 }}>
        Insert information on the hike
      </Typography>
      {/*

            <FormGroup className="col-4" controlId = "expectedTimeStr">
                <FormLabel className="Text">Expected Time</FormLabel>
                <FormControl className="InputBox" type="number" min={0} placeholder="Expected Time" value= {expectedTimeStr} onChange={(e) => setExpectedtimeStr(e.target.value)}></FormControl>
            </FormGroup>
</Row>
<Row>
            <FormGroup className="col-4" controlId = "ascentStr">
                <FormLabel className="Text">Ascent</FormLabel>
                <FormControl className="InputBox" type="number" min={0} placeholder="Ascent in meters" value= {ascentStr} onChange={(e) => setAscentStr(e.target.value)}></FormControl>
            </FormGroup>
      */ }
      <Grid container spacing={3} sx={{ p: 2 }}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="title"
            name="title"
            label="Title"
            fullWidth
            variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lengthStr"
            name="lengthStr"
            label="Length (m)"
            fullWidth
            variant="standard"
            type="number" 
            min={0} 
            value= {lengthStr}
            onChange={(e) => {setLengthStr(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="expectedTimeStr"
            name="expectedTimeStr"
            label="Expected Time (hh:mm)"
            fullWidth
            variant="standard"
            min={0} 
            type="text"
            value={expectedTimeStr}
            onChange={(e) => {setExpectedTimeStr(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="ascentStr"
            name="ascentStr"
            label="Ascent (m)"
            fullWidth
            variant="standard"
            type="number" 
            min={0} 
            value= {ascentStr}
            onChange={(e) => setAscentStr(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="region"
            name="region"
            label="Region"
            fullWidth
            autoComplete="region"
            variant="standard"
            type="text"
            value={region}
            onChange= {(e) => setRegion(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            variant="standard"
          />
        </Grid>
        <Grid item xs={12}>
          <FormControlLabel
            control={<Checkbox color="secondary" name="saveAddress" value="yes" />}
            label="Use this address for payment details"
          />
        </Grid>
      </Grid>
      {/*</Grid>*/}
    </React.Fragment>
  );
}

export {HTAddHike}