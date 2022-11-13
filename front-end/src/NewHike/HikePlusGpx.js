import React from 'react';
import {useState, useEffect} from 'react';
import { Container, Form, Button, Alert, Modal, Col, Row, FormGroup, InputGroup, FormControl, FormLabel, FormSelect } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css'
import { MapContainer, Polyline, TileLayer } from 'react-leaflet'
import './map.css';
import './GuideHike.css';
import { Navigate, useNavigate } from 'react-router';
import './map.css';
import {Map} from './Map.js'


function FormHikeGpx(props){

    const [title, setTitle] = useState('');
    const [lengthStr, setLengthStr] = useState('lenght in km');
    const [expectedTimeStr, setExpectedtimeStr] = useState('');
    const [ascentStr, setAscentStr] = useState('');
    const [difficultyStr, setDifficultyStr] = useState('');
    const [region, setRegion] = useState('');
    const [province, setProvince] = useState('');
    //can ve Tourist, Hiker, Professional Hiker
     const [startPoint, setStartPoint] = useState();
     const [endPoint, setEndPoint ] = useState();
    // const [referencePoints, setReferencePoints] = useState();
    //points can be: address, name of location, GPS coordinates, hut, parking lot
    // const [listReferencePoint, setListReferencePoint] = useState();
    const [description, setDescription] = useState();

    

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContents, setFileContents] = useState(null);
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [positionsState, setPositionsState] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState('');
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

        console.log(fileUploaded);
        // props.handleFile(fileUploaded);
    };
    useEffect(() => {
        if (fileContents) {
            let gpxParser = require('gpxparser');
            var gpx = new gpxParser();
            gpx.parse(fileContents);
            console.log(gpx);
            console.log(gpx.tracks[0].points.map(p => [p.lat, p.lon]));
            const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
            setPositionsState(positions);
            setStartPoint(positions[0]);
            // setEndPoint(positions[length-1]);
            console.log(positions[0]);
            console.log(positions.length);
            console.log(positions);
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
            //props.addNewHike(newHike);
            console.log(newHike);
            props.addNewGpx(formData, newHike).catch((err)=> {setErrorMessage(err); setShow(true)})
            Navigate('/')
        }

    }

    return (<Container className= "Container">
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
                    <p>Size in bytes: {selectedFile.size}</p>
                    <p>
                        Last ModifiedDate:{' '}
                        {selectedFile.lastModifiedDate.toLocaleDateString()}
                    </p>
                </div>
            ) : (
                <p>Select a file to show details</p>
            )}
        
        <Form onSubmit={handleSubmit}>

            <Row>

            <FormGroup className="col-4" controlId = "title">
                <FormLabel>Title</FormLabel>
                <FormControl required={true} type="text" placeholder="Enter Title" value= {title} onChange={(e) => setTitle(e.target.value)}></FormControl>

            </FormGroup>

            <FormGroup className="col-4" controlId = "lengthStr">
                <FormLabel>Length</FormLabel>
                <FormControl type="number" min={0} placeholder="Length in Km" value= {lengthStr} onChange={(e) => setLengthStr(e.target.value)}></FormControl>
            </FormGroup>

            <FormGroup className="col-4" controlId = "expectedTimeStr">
                <FormLabel>Expected Time</FormLabel>
                <FormControl type="number" min={0} placeholder="Expected Time" value= {expectedTimeStr} onChange={(e) => setExpectedtimeStr(e.target.value)}></FormControl>
            </FormGroup>
</Row>
<Row>
            <FormGroup className="col-4" controlId = "ascentStr">
                <FormLabel>Ascent</FormLabel>
                <FormControl type="number" min={0} placeholder="Ascent in meters" value= {ascentStr} onChange={(e) => setAscentStr(e.target.value)}></FormControl>
            </FormGroup>
            <FormGroup className="col-4" controlId = "difficultyStr">
                <FormLabel>Difficulty</FormLabel>
              <FormSelect  onChange={(e) => setDifficultyStr(e.target.value)}>
                <option></option>

              <option value="0">Tourist</option>
  <option value="1">Hiker</option>
  <option value="2">Professional Hiker</option>
              </FormSelect>
              
            </FormGroup>
            <FormGroup className="col-4" controlId = "region">
                <FormLabel>Region</FormLabel>
                <FormControl required={true} type="text" placeholder="Enter Region" value= {region} onChange={(e) => setRegion(e.target.value)}></FormControl>

            </FormGroup>
            <FormGroup className="col-4" controlId = "province">
                <FormLabel>Province</FormLabel>
                <FormControl required={true} type="text" placeholder="Enter Province" value= {province} onChange={(e) => setProvince(e.target.value)}></FormControl>

            </FormGroup>
            </Row>
            <FormGroup className="mb-3" controlId = "description">
                <FormLabel>Description</FormLabel>
                <FormControl  as="textarea" required = {true} placeholder="Enter A Description for the Hike" value= {description} onChange={(e) => setDescription(e.target.value)}></FormControl>

            </FormGroup>
            <FormGroup>
                <Row>
                    <Col>
                    <FormLabel>Start Point</FormLabel>
                    <FormControl value={startPoint} onChange={(e) => setStartPoint(e.target.value)}></FormControl>
                    </Col>
                </Row>
                <Row>
                    <Col>
                    <FormLabel>End Point</FormLabel>
                    <FormControl value={endPoint} onChange={(e) => setEndPoint(e.target.value)}></FormControl>
                    </Col>
                </Row>
            </FormGroup>
            <Button type = 'submit'>SAVE</Button>
            <Button colore = 'red' onClick= {()=> Navigate('/')}>CANCEL</Button>
            
        </Form>
        <>
            <div>
                <>  
                <Map positionsState = {positionsState} />     
                </>
            </div>
        </>

    </Container>)

}

export {FormHikeGpx}