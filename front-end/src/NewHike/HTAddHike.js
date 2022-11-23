import * as React from 'react';
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react';
import {Map} from './Map.js';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import { spacing } from '@mui/system';
import { Button, Box, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import FormGroup from '@mui/material/FormGroup';
import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

import WarningIcon from '@mui/icons-material/Warning';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import Alert from '@mui/material/Alert';





import HTNavbar from '../components/HTNavbar/HTNavbar'
import { warning } from '@remix-run/router';



function HTAddHike(props){

    const navigate = useNavigate();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContents, setFileContents] = useState(null);
    const [isFilePicked, setIsFilePicked] = useState(false);

    const [title, setTitle] = useState('');
    const [lengthStr, setLengthStr] = useState('');
    const [ascentStr, setAscentStr] = useState('');
    const [expectedTimeStr, setExpectedTimeStr] = useState('');

    const [difficultyStr, setDifficultyStr] = useState(0);
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    //const [referencePoints, setReferencePoints] = useState([]);
    //points can be: address, name of location, GPS coordinates, hut, parking lot
    // const [listReferencePoint, setListReferencePoint] = useState();
    const [description, setDescription] = useState('');
    const [positionsState, setPositionsState] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState('');

    const [newReferencePoint, setNewReferencePoint] = useState(false);
    const [listReferencePoint, setListReferencePoint] = useState([]);
    //{ [name: "prova1", address: "provaAdd", lon: 4.5 ,  lat: 4.3]
    const [presenceWayPoints, setPresenceWaypoints] = useState(false);

    const [puntiDaTrack, setPuntiDaTrack] = useState([]);


    const [startPoint, setStartPoint] = useState({name: "", address: null, lat: "", lon: ""});
    const [startPointLon, setStartPointLon] = useState('');
    const [startPointLat, setStartPointLat] = useState('');
    const [startPointName, setStartPointName] = useState('Start Point');
    const [startPointAdd, setStartPointAdd] = useState(null);

    const [endPoint, setEndPoint] = useState({name: "", address: null, lat: "", lon: ""});
    const [endPointLat, setEndPointLat] = useState('');
    const [endPointLon, setEndPointLon] = useState('');
    const [endPointName, setEndPointName] = useState('End Point');
    const [endPointAdd, setEndPointAdd] = useState(null);

    const [referencePoint, setReferencePoint] = useState({});
    const [referencePointLat, setReferencePointLat] = useState('');
    const [referencePointLon, setReferencePointLon] = useState('');
    const [referencePointName, setReferencePointName] = useState('');
    const [referencePointAdd, setReferencePointAdd] = useState(null);

  

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
        }

    };

    useEffect(()=>{

      if(puntiDaTrack?.length!==0){
        setNewReferencePoint(true);}
        if(referencePoint){

        setReferencePointLat(referencePoint.lat);
        setReferencePointLon(referencePoint.lon);
        }
    }, [puntiDaTrack,  referencePoint])

    useEffect(() => {
        if (fileContents) {
            let gpxParser = require('gpxparser');
            var gpx = new gpxParser();
            gpx.parse(fileContents);
            const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
            console.log(gpx);
            // controllare perchè se non ci sono i punti da errore
            const waypoints = gpx.waypoints.map(reference => [reference.name, reference.desc, reference.lat, reference.lon] )
            console.log(waypoints);
            setListReferencePoint([]);
            let i=1;

            let prova =[];
            waypoints.forEach(el=>{
              console.log(i);
              console.log(el.name)
              if(el.name === '' || el.name=== null || el.name=== undefined){
                prova = [...prova, {name: i, address: el[1], lat: el[2], lon: el[3]}];
                i++;
              }else{

              prova = [...prova, {name: el[0], address: el[1], lat: el[2], lon: el[3]}];
              }

              // controllare che due waypoints non abbiano lo stesso nome
              console.log(prova);
              setListReferencePoint(prova);
            })

            
            //set List reference point con i waypoints se presenti nel gpx file
            setReferencePoint([]);
            setStartPointLat(positions[0][0]);
            setStartPointLon(positions[0][1]);
            setEndPointLat(positions[positions.length-1][0]);
            setEndPointLon(positions[positions.length-1][1]);
            setPositionsState(positions);
            setStartPoint([{name: startPointName, address: startPointAdd, lat: positions[0][0], lon: positions[0][1]}]);
            setEndPoint([{name: endPointName, address: endPointAdd, lat: positions[positions.length-1][0], lon: positions[positions.length-1][1]}]);
            setDescription(gpx.tracks[0].desc);
            setDifficultyStr(gpx.tracks[0].type);
            setAscentStr(gpx.tracks[0].elevation.pos);
            setTitle(gpx.tracks[0].name);
            setLengthStr(gpx.tracks[0].distance.total);
        }
    }, [fileContents]);

    const handleNewReferencePoint = (event) =>{
      setNewReferencePoint(true);
    }

    function handleDeleteReferencePoint(n){
      const indexOfObject = listReferencePoint.findIndex(object => object.name === n)
      const prova = listReferencePoint.splice(indexOfObject, 1);
      setListReferencePoint(listReferencePoint.filter(el => el.name!==prova.name));
    }

    const handleListreferencePoints = (event) =>{

      if(listReferencePoint.map(el => el.name).includes(referencePointName)){
        console.log("c'è già un reference point con quel nome")
        setErrorMessage("There is already a reference point with  the same name, choose another one");
        setShow(true);
      }else if(referencePointName==='' || referencePointLat==='' || referencePointLon==='' ){
        setErrorMessage("Name, Longitude and Latitude of the reference points cannot be empty");
        setShow(true);
      }else{
      setListReferencePoint([...listReferencePoint, {name: referencePointName, address: referencePointAdd, lat: referencePointLat, lon: referencePointLon}]);
      setNewReferencePoint(false);
      setReferencePoint(null);
      }
    }

    const handleSubmit = (event) => {
        event.preventDefault();
        if(title.trim().length === 0){
            setErrorMessage('The title cannot be empty');
            setShow(true);
        }else if(lengthStr.length === 0){

          setErrorMessage('The length cannot be empty');
          setShow(true);

        }else if(expectedTimeStr.trim().length === 0){

          setErrorMessage('The time expected for the hike cannot be empty')
          setShow(true);
        
        }else if(ascentStr.length === 0){

          setErrorMessage('The ascent for the hike cannot be empty');
          setShow(true);

        }else if(difficultyStr.length === 0){

          setErrorMessage('The difficulty for the hike cannot be empty');
          setShow(true);

        
        }else if(description.trim().length === 0){

          setErrorMessage('The description for the hike cannot be empty');
          setShow(true);
        }else if(region.length === 0){

          setErrorMessage('The rgion for the hike cannot be empty');
          setShow(true);
        }else if(province.length === 0){

          setErrorMessage('The province for the hike cannot be empty');
          setShow(true);
        }else if(startPointName==='' || startPointLat==='' || endPointLon===''){

          setErrorMessage('The name, latitude and longitude of the starting point cannot be empty');
          setShow(true);
        }else if(endPointName==='' || endPointLat==='' || endPointLon===''){

          setErrorMessage('The name, latitude and longitude of the ending point cannot be empty');
          setShow(true);


        }else{
            const length = parseFloat(lengthStr);
            let a = expectedTimeStr.split(':'); // split it at the colons
            let minutes = parseInt(a[0])*60 + parseInt(a[1]);
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
                formData.append('referencePoints', JSON.stringify(listReferencePoint));
                formData.append('startPoint', JSON.stringify([{name: startPointName, address: startPointAdd, lat: startPointLat, lon: startPointLon}]));
                formData.append('endPoint', JSON.stringify([{name: endPointName, address: endPointAdd, lat: endPointLat, lon: endPointLon}]));
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
        <Grid >
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} navigate={gotoLocalGuide} />

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
            {selectedFile ?
            (<Grid> Filename: {selectedFile?.name}</Grid>)
            :
            (<Grid> Select a file to show details </Grid>)
            }
        </Grid>
        </Grid>
      <Grid>
        {
          selectedFile?(
            <>
            <Typography variant="h6" gutterBottom sx={{ p: 2 }}>Insert information on the hike</Typography>
      <Grid container spacing={3} sx={{ p: 2 }} >
        <Grid item xs={12}>
          <TextField
            required id="title" name="title" label="Title"
            fullWidth variant="standard"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required id="lengthStr" name="lengthStr"
            label="Length (m)" fullWidth variant="standard" type="number" min={0} 
            value= {lengthStr}
            onChange={(e) => {setLengthStr(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required id="expectedTimeStr" name="expectedTimeStr" label="Expected Time (hh:mm)"
            fullWidth variant="standard" min={0}  type="text"
            value={expectedTimeStr}
            onChange={(e) => {setExpectedTimeStr(e.target.value)}}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required id="ascentStr" name="ascentStr" label="Ascent (m)"
            fullWidth variant="standard" type="number" min={0} 
            value= {ascentStr}
            onChange={(e) => setAscentStr(e.target.value)}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
            <DifficultySelect setDifficultyStr={setDifficultyStr} difficultyStr={difficultyStr}></DifficultySelect>
        </Grid>
            <Grid item xs={12} sm={3}>
          <TextField
            required id="startPointName"
            name="startPointName" label="Start Point Name"
            fullWidth autoComplete="startPointName"
            variant="standard" type= "text"
            value = {startPointName}
            onChange={(e) => setStartPointName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            name="startPointLat"
            label="Start Point Latitude" 
             variant="standard"
            id="startPointLat" 
            type= "text"
            fullWidth
            value = {startPointLat}
            onChange={(e) => setStartPointLat(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required id="startPointLon"
            name="startPointLon" 
            label="Start Point Longitude"
            fullWidth
            variant="standard"
            min={0} 
            value = {startPointLon}
            onChange={(e) => setStartPointLon(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required id="startPointAdd"
            name="startPointAdd" label="Start  Point Address"
            fullWidth autoComplete="startPointAdd" variant="standard"
            value = {startPointAdd}
            onChange={(e) => setStartPointAdd(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required
            id="endPointName" name="endPointName"
            label="End Point Name" fullWidth
            autoComplete="endPointName" variant="standard"
            value = {endPointName}
            onChange={(e) => setEndPointName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required id="endPointLat"
            name="endPointLat" label="End Point Name"
            fullWidth autoComplete="endPointLat" variant="standard"
            value = {endPointLat}
            onChange={(e) => setEndPointLat(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required id="endPointLon"
            name="endPointLon" label="End Point Longitude"
            fullWidth autoComplete="endPointLon" variant="standard"
            value = {endPointLon}
            onChange={(e) => setEndPointLon(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={3}>
          <TextField
            required id="endPointAdd"
            name="endPointAdd" label=" End Point Address"
            fullWidth autoComplete="endPointAdd" variant="standard"
            value = {endPointAdd}
            onChange={(e) => setEndPointAdd(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required id="region"
            name="region" label="Region"
            fullWidth  autoComplete="region"
            variant="standard" type="text"
            value={region}
            onChange= {(e) => setRegion(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="province" name="province"
            label="Province" fullWidth
            autoComplete="province" variant="standard" type="text"
            value={province}
            onChange = {(e) => setProvince(e.target.value)}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required id="description"
            name="description" label="Description (max 1000 characters)"
            fullWidth autoComplete="description"
            variant="standard" multiline
            inputProps={
              {maxLength: 999}
          }
          //mettere un alert se vai oltre
          value={description}
          onChange = {(e) => setDescription(e.target.value)}
          />
        </Grid>
        
        {
          listReferencePoint.length?
          (<>
          {listReferencePoint.map((reference) => {
            return (
              <>
              <>
            <Grid item xs={12} sm={3}>
              <TextField  id="referencename" name="referencename"
                label="Reference Point Name" fullWidth
                autoComplete="referencename" variant="standard"
                value = {reference.name}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField name="referencelat"
                label="Reference Point Latitude" fullWidth
                autoComplete="referencelat" variant="standard"
                disabled
                id="outlined-disabled"
                value = {reference.lat}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                name="referencePointLon"
                label="Reference Point Longitude"
                fullWidth
                autoComplete="referencePointLon"
                variant="standard"
                disabled
                id="outlined-disabled"
                value = {reference.lon}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                required
                name="referencePointAdd"
                label="Reference Point Address"
                fullWidth
                autoComplete="referencePointAdd"
                variant="standard"
                value = {reference.address}
              />
               </Grid>
              <Grid item xs={12} sm={2}>
              <Button edge="end"  onClick={() => handleDeleteReferencePoint(reference.name)} >
                      <DeleteIcon />
              </Button>
              </Grid>
           
            </>
</>
            )})}

            </>

        ):(<h2></h2>)
        }
        
          
        {
          !newReferencePoint?
          (
            <>
            {console.log(newReferencePoint)}
            <Grid item xs={12}>
            <Button onClick = {handleNewReferencePoint}>ADD A NEW REFERENCE POINT</Button>
              </Grid>
            </>
          )
          :
          (<>  
            <Grid item xs={12} sm={3}>
          <TextField
            required
            id="referencePointName" name="referencePointName"
            label="Reference Point Name" fullWidth
            autoComplete="referencePointName" variant="standard"
            value = {referencePointName}
            onChange={(e) => setReferencePointName(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            required
            id="referencePointLat" name="referencePointLat"
            label="Reference Point Latitude" fullWidth
            autoComplete="referencePointLat" variant="standard"
            value = {referencePointLat}
            onChange={(e) => setReferencePointLat(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            required id="referencePointLon"
            name="referencePointLon" label="Reference Point Longitude"
            fullWidth autoComplete="referencePointLon" variant="standard"
            value = {referencePointLon}
            onChange={(e) => setReferencePointLon(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2}>
          <TextField
            required id="referencePointAdd"
            name="referencePointAdd" label="Reference Point Address"
            fullWidth autoComplete="referencePointAdd" variant="standard"
            value = {referencePointAdd}
            onChange={(e) => setReferencePointAdd(e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={2} mt={2}><Button onClick={handleListreferencePoints}>ADD</Button></Grid>
        </>)
        }
      </Grid>
      </>
          ):(<h1></h1>)
        }
        {
                show?
                  <Alert variant="outlined" severity="error"  onClose={() => { setErrorMessage(''); setShow(false) }}>{errorMessage}</Alert> : <></>
              }
        <Grid><Button variant="contained" color="success" onClick={handleSubmit}>SUBMIT FORM</Button></Grid>
        
        <Grid>
          <Map positionsState = {positionsState} setPuntiDaTrack={setPuntiDaTrack} puntiDaTrack={puntiDaTrack} referencePoint={referencePoint} setReferencePoint={setReferencePoint} listReferencePoint={listReferencePoint}/>
        </Grid>
      </Grid>
      </Grid>
    </React.Fragment>
  );
}

export {HTAddHike}


function DifficultySelect(props) {
  return <>

    <FormControl fullWidth required>
      <InputLabel id="demo-simple-select-label">Difficulty</InputLabel>
      <Select

        labelId="demo-simple-select-label"
        id="demo-seimple-select"
        value={props.difficultyStr}
        fullWidth
        name="difficultyStr"
        variant="standard"
        label="difficultyStr"
        onChange={ev => props.setDifficultyStr(ev.target.value)}
      >
        <MenuItem value={0}>
          Tourist
        </MenuItem>
        <MenuItem value={1}>
          Hiker
        </MenuItem>
        <MenuItem value={2}>
          Professional Hiker
        </MenuItem>
      </Select>
    </FormControl>
  </>
}

