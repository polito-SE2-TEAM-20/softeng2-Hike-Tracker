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
    const [length, setLength] = useState('lenght in km');
    const [expectedTime, setExpectedtime] = useState('');
    const [ascent, setAscent] = useState('');
    const [difficulty, setDifficulty] = useState('');
    //can ve Tourist, Hiker, Professional Hiker
     const [startPoint, setStartPoint] = useState();
     const [endPoint, setEndPoint ] = useState();
    // const [referencePoints, setReferencePoints] = useState();
    //points can be: address, name of location, GPS coordinates, hut, parking lot
    // const [listReferencePoint, setListReferencePoint] = useState();
    const [description, setDescription] = useState();

    const hiddenFileInput = React.useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContents, setFileContents] = useState(null);
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [positionsState, setPositionsState] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState('');

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
            const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
            setPositionsState(positions);
            setStartPoint([positions[0]]);
            setEndPoint([positions[positions.length-1]]);
        }

    }, [fileContents]);

    const handleSubmission = () => {
        const formData = new FormData();
        console.log(fileContents);
        console.log(formData.length);
        formData.append('gpxFile', fileContents);
        console.log(formData.length);
        formData.append('title', fileContents.name);
        console.log(fileContents.name);
        formData.append('description', '');
        console.log(formData.title);
        props.addNewGpx(formData).catch((err) => { setErrorMessage(err); setShow(true); })


    };

    const navigate = useNavigate();

    const handleSubmit = (event) => {

        const formData = new FormData();
        console.log(fileContents);
        console.log(formData.length);
        formData.append('gpxFile', fileContents);
        console.log(formData.length);
        formData.append('title', fileContents.name);
        console.log(fileContents.name);
        formData.append('description', '');
        console.log(formData.title);
        
        event.preventDefault();
        if(title.trim().length === 0){
            setErrorMessage('The title cannot be empty')
        }else{
            const newHike = { title: title, length: length, expectedTime: expectedTime, ascent: ascent, difficulty: difficulty, description: description}
           
        props.addNewGpx(formData, newHike).catch((err) => { setErrorMessage(err); setShow(true); })
            Navigate('/')
        }

    }

    return (<Container className= "Container">
        <Row>
            <Col>
            {
                <h1>CREATE A NEW HIKE</h1>
            }
            </Col>
        </Row>
        <Row>
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
                <p>Select a file to show details</p>
            )}
        </Row>
        <Form onSubmit={handleSubmit}>
            <Row>

            <FormGroup className="col-4" controlId = "title">
                <FormLabel>Title</FormLabel>
                <FormControl required={true} type="text" placeholder="Enter Title" value= {title} onChange={(e) => setTitle(e.target.value)}></FormControl>

            </FormGroup>

            <FormGroup className="col-4" controlId = "length">
                <FormLabel>Length</FormLabel>
                <FormControl type="number" min={0} placeholder="Length in Km" value= {length} onChange={(e) => setLength(e.target.value)}></FormControl>
            </FormGroup>

            <FormGroup className="col-4" controlId = "expectedTime">
                <FormLabel>Expected Time</FormLabel>
                <FormControl type="number" min={0} placeholder="Expected Time" value= {expectedTime} onChange={(e) => setExpectedtime(e.target.value)}></FormControl>
            </FormGroup>
</Row>
<Row>
            <FormGroup className="col-4" controlId = "ascent">
                <FormLabel>Ascent</FormLabel>
                <FormControl type="number" min={0} placeholder="Ascent in meters" value= {ascent} onChange={(e) => setAscent(e.target.value)}></FormControl>
            </FormGroup>
            <FormGroup className="col-4" controlId = "difficulty">
                <FormLabel>Difficulty</FormLabel>
              <FormSelect  onChange={(e) => setDifficulty(e.target.value)}>
                <option></option>

              <option value="1">Tourist</option>
  <option value="2">Hiker</option>
  <option value="3">Professional Hiker</option>
              </FormSelect>
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