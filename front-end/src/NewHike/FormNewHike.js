import React from 'react';
import {useState} from 'react';
import { Container, Form, Button, Alert, Modal, Col, Row, FormGroup, InputGroup, FormControl, FormLabel } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css'
import { MapContainer, Polyline, TileLayer } from 'react-leaflet'
import './map.css';
import './GuideHike.css';
import { Navigate, useNavigate } from 'react-router';


function FormNewHike(props){

    const [title, setTitle] = useState('');
    const [length, setLength] = useState('lenght in km');
    const [expectedTime, setExpectedtime] = useState('');
    const [ascent, setAscent] = useState('');
    const [difficulty, setDifficulty] = useState('');
    //can ve Tourist, Hiker, Professional Hiker
    // const [startPoint, setStartPoint] = useState();
    // const [endPoint, setEndPoint ] = useState();
    // const [referencePoints, setReferencePoints] = useState();
    //points can be: address, name of location, GPS coordinates, hut, parking lot
    // const [listReferencePoint, setListReferencePoint] = useState();
    const [description, setDescription] = useState();
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

    const handleSubmit = (event) => {
        event.preventDefault();
        if(title.trim().length === 0){
            setErrorMessage('The title cannot be empty')
        }else{
            const newHike = { title: title, length: length, expectedTime: expectedTime, ascent: ascent, difficulty: difficulty, description: description}
            props.addHike(newHike);
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
              <Form.Select  onChange={(e) => setDifficulty(e.target.value)}>
                <option></option>

              <option value="1">Tourist</option>
  <option value="2">Hiker</option>
  <option value="3">Professional Hiker</option>
   <Form.Control required={true} type="text" placeholder="Difficulty" value= {difficulty}/>
              </Form.Select>
            </FormGroup>
            </Row>
            <FormGroup className="mb-3" controlId = "description">
                <FormLabel>Description</FormLabel>
                <FormControl  as="textarea" required = {true} placeholder="Enter A Description for the Hike" value= {description} onChange={(e) => setDescription(e.target.value)}></FormControl>

            </FormGroup>
            <Button type = 'submit'>SAVE</Button>
            <Button colore = 'red' onClick= {()=> Navigate('/')}>CANCEL</Button>
            
        </Form>

    </Container>)

}

export {FormNewHike}