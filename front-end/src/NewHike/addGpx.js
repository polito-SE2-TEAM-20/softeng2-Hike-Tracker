import React from 'react';
import { useState, useEffect } from 'react';
import { Form, Button, Alert, Modal, Col, Row, FormGroup } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css'
import { MapContainer, Polyline, TileLayer } from 'react-leaflet'
import './map.css';
import {Map} from './Map.js'
//import styled from 'styled-components';
// Style the Button component
//const Button = styled.button`
/* Insert your favorite CSS code to style a button */
//`;
const FileUploader = props => {
    const hiddenFileInput = React.useRef(null);

    const [selectedFile, setSelectedFile] = useState(null);
    const [fileContents, setFileContents] = useState(null);
    const [isFilePicked, setIsFilePicked] = useState(false);
    const [positionsState, setPositionsState] = useState([]);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
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
            console.log(gpx);
            console.log(gpx.tracks[0].points.map(p => [p.lat, p.lon]));
            const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
            setPositionsState(positions);
            console.log(positions[0]);
            console.log(positions.length);
            console.log(positions);
        }

    }, [fileContents]);

    const handleSubmission = () => {
        const formData = new FormData();
        formData.append('File', fileContents);
        formData.append('Title', title);
        props.addNewHike(formData).catch((err) => { setErrorMessage(err); setShow(true); })


    };


    return (
        <>
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
            <div>
                <Button onClick={handleSubmission}>Submit</Button>
            </div>
            <div>
                <>  
                <Map positionsState = {positionsState} />     
                </>
            </div>
        </>
    );
}
export default FileUploader;




