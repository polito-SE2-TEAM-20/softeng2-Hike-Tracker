import React from 'react';
import {useState, useEffect} from 'react';
import { Container, Form, Button, Col, Row, FormGroup, FormControl, FormLabel, FormSelect, Alert } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css'
import './GuideHike.css';
import { useNavigate } from 'react-router';
import {Map} from './Map.js';
import MainTitle from '../components/main-title/MainTitle';
import ButtonHeader from '../components/buttons/Button';
import Navbar from 'react-bootstrap/Navbar';

function AddHike(props){

    const [title, setTitle] = useState('');
    const [lengthStr, setLengthStr] = useState('lenght in km');
    const [expectedTimeStr, setExpectedtimeStr] = useState('');
    const [ascentStr, setAscentStr] = useState('');
    const [difficultyStr, setDifficultyStr] = useState('');
    const [country, setCountry] =useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    const [city, setCity] = useState('');
    const [startPoint, setStartPoint] = useState();
    const [endPoint, setEndPoint ] = useState();
    const [referencePoints, setReferencePoints] = useState();
    //points can be: address, name of location, GPS coordinates, hut, parking lot
    const [listReferencePoint, setListReferencePoint] = useState();
    const [description, setDescription] = useState();
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContents, setFileContents] = useState(null);
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [positionsState, setPositionsState] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState('');
    const [presenceWayPoints, setPresenceWaypoints] = useState(false);


    const hiddenFileInput = React.useRef(null);
    // Programatically click the hidden file input element
    // when the Button component is clicked
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
        reader.readAsText(fileUploaded)
        // props.handleFile(fileUploaded);
    };

    {/*
    async function getInformation(lat, lon) {
        let response = await fetch(('https://nominatim.openstreetmap.org/ui/reverse.html?format=html&lat=43.653225&lon=-79.383186&zoom=14'), {
          method: 'GET',

    headers: {
        'Content-Type': 'application/json',
      },
        });
        if (response.ok) {
          const informationCountry = await response.json();
          return informationCountry;
        } else {
          const errDetail = await response.json();
          throw errDetail.message;
        }
      }*/}
    useEffect(() => {
        if (fileContents) {
            let gpxParser = require('gpxparser');
            var gpx = new gpxParser();
            gpx.parse(fileContents);
            const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
            setPositionsState(positions);
            setStartPoint(positions[0]);
            setEndPoint(positions[positions.length-1]);
            for(const i in gpx.waypoints){
                let listOfWaypoints = {};
                // listOfWaypoints.push(gpx.waypoints[i]);
                console.log(listOfWaypoints);
                console.log(`${i}: ${gpx.waypoints[i].name}`)
                setListReferencePoint(listOfWaypoints);
                {/*}
                if(listOfWaypoints.length()!==0){
                    setPresenceWaypoints(true);
                }*/}
            }
            setDescription(gpx.tracks[0].desc);
            setDifficultyStr(gpx.tracks[0].type);
            setAscentStr(gpx.tracks[0].elevation.avg);
            setTitle(gpx.tracks[0].name);
            setLengthStr(gpx.tracks[0].distance.total);
            console.log(gpx);
            console.log(gpx.tracks[0].points.map(p => [p.lat, p.lon]));
            //numero di track nel file:
            const track = gpx.tracks.map(t=> [t]);
            console.log(gpx.tracks.map(t => [t]));
            //console.log(gpx.segment.length());
            console.log("distance: " + gpx.tracks[0].distance.total);
            console.log("descrizione: " + gpx.tracks[0].desc);
            console.log("type: " + gpx.tracks[0].type);
            console.log("ascent: " + gpx.tracks[0].elevation.avg);
            console.log("title: " + gpx.tracks[0].name);
  

            {/*
            console.log(gpx.waypoints);
            let information = getInformation(positions[0].lat, positions[0].lon );
            console.log(information);
        */}
            
        }

    }, [fileContents]);

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append('gpxFile', selectedFile);
        formData.append('title', title);
        if(title.trim().length === 0){
            setErrorMessage('The title cannot be empty')
        }else{

            const length = parseInt(lengthStr);
            const expectedTime = parseInt(expectedTimeStr);
            const ascent = parseInt(ascentStr);
            const difficulty = parseInt(difficultyStr);
            const newHike = { title: title, length: length, expectedTime: expectedTime, ascent: ascent, difficulty: difficulty, description: description, region: region, province: province}
            console.log(newHike);
            props.addNewGpx(formData, newHike).catch((err)=> {setErrorMessage(err); setShow(true)})
            navigate('/localGuide');
        }

    }

    const gotoHomeLocal = () => {
        navigate("/localGuide", { replace: false })
    }
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }


    return (
        <>
        <Row>
            <Navbar className="is-sticky" expand="lg">
                <Container>
                    <MainTitle navigate={gotoHomeLocal} color="white" size="48px" />
                    {
                        !props.isLoggedIn ?
                            <ButtonHeader navigate={gotoLogin} text="Login" textColor="black" color="white" size="24px" />
                            :
                            <ButtonHeader navigate={props.doLogOut} text="Logout" textColor="black" color="white" size="24px" />
                    }
                </Container>
            </Navbar>
        </Row>
        <div style={{ display: "flex", justifyContent: "center" }}>
            <Row style={{ marginTop: "150px", marginLeft: "auto", marginRight: "auto", display: "flex", justifyContent: "center"}}>
                
            </Row>
        </div >
        {/*}
        <Alert
            dismissible
            show={show}
            onClose={() => setShow(false)}
            variant="danger">
            {errorMessage}
                </Alert>*/}
        <div className="Container">
            <Button onClick={handleClick}>
                Upload a file
            </Button>
            <input
                type="file"
                ref={hiddenFileInput}
                onChange={handleChange}
                style={{ display: 'none' }}
            />
            {isFilePicked ? (
                <div>
                    <p>Filename: {selectedFile.name}</p>
                </div>
            ) : (
                <p className='Text'>Select a file to show details</p>
            )}
        
        <Form onSubmit={handleSubmit}>

            <Row>

            <FormGroup className="col-4" controlId = "title">
                <FormLabel className="Text">Title</FormLabel>
                <FormControl className="InputBox" required={true} type="text" placeholder="Enter Title" value= {title} onChange={(e) => setTitle(e.target.value)}></FormControl>

            </FormGroup>

            <FormGroup className="col-4" controlId = "lengthStr">
                <FormLabel className="Text">Length</FormLabel>
                <FormControl className="InputBox" type="number" min={0} placeholder="Length in Km" value= {lengthStr} onChange={(e) => setLengthStr(e.target.value)}></FormControl>
            </FormGroup>

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
            <FormGroup className="col-4" controlId = "difficultyStr">
                <FormLabel className="Text">Difficulty</FormLabel>
              <FormSelect className="InputBox" onChange={(e) => setDifficultyStr(e.target.value)}>
                <option></option>

              <option value="0">Tourist</option>
              <option value="1">Hiker</option>
              <option value="2">Professional Hiker</option>
              </FormSelect>
              
            </FormGroup>
            <FormGroup className="col-4" controlId = "region">
                <FormLabel className="Text">Region</FormLabel>
                <FormControl className="InputBox" required={true} type="text" placeholder="Enter Region" value= {region} onChange={(e) => setRegion(e.target.value)}></FormControl>

            </FormGroup>
            <FormGroup className="col-4" controlId = "province">
                <FormLabel className="Text">Province</FormLabel>
                <FormControl className="InputBox" required={true} type="text" placeholder="Enter Province" value= {province} onChange={(e) => setProvince(e.target.value)}></FormControl>

            </FormGroup>
            </Row>
            <FormGroup className="mb-3" controlId = "description">
                <FormLabel className="Text">Description</FormLabel>
                <FormControl  className="InputBox" as="textarea" required = {true} placeholder="Enter A Description for the Hike" value= {description} onChange={(e) => setDescription(e.target.value)}></FormControl>

            </FormGroup>
            <FormGroup>
                <Row>
                    <Col>
                    <FormLabel className="Text">Start Point</FormLabel>
                    <FormControl className="InputBox" value={startPoint} onChange={(e) => setStartPoint(e.target.value)}></FormControl>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <FormLabel className="Text">End Point</FormLabel>
                    <FormControl className="InputBox" value={endPoint} onChange={(e) => setEndPoint(e.target.value)}></FormControl>
                    </Col>
                </Row>
            </FormGroup>
            <>
            {
                presenceWayPoints?
                <FormGroup>
                <Row>
                    <Col>
                    <FormLabel className="Text">{listReferencePoint[0].name}</FormLabel>
                    <FormControl className="InputBox" value={listReferencePoint[0]} onChange={(e) => setReferencePoints(e.target.value)}></FormControl>
                    </Col>
                </Row>
            </FormGroup>
            :
            <h2></h2>
            }
            </>
            
            <Button type = 'submit'>SAVE</Button>
            <Button colore = 'red' onClick= {()=> navigate('/localGuide')}>CANCEL</Button>
            
        </Form>
        <>
            <div>
                <>  
                <Map positionsState = {positionsState} />     
                </>
            </div>
        </>

    </div>
    </>)

}

export {AddHike}