import React from 'react';
import {useState} from 'react';
import { Form, Button, Alert, Modal, Col, Row, FormGroup } from 'react-bootstrap';
import 'leaflet/dist/leaflet.css'
import { MapContainer, Polyline, TileLayer } from 'react-leaflet'
import './map.css';
//import styled from 'styled-components';
// Style the Button component
//const Button = styled.button`
  /* Insert your favorite CSS code to style a button */
//`;
const FileUploader = props => {
  const hiddenFileInput = React.useRef(null);
  
	const [selectedFile, setSelectedFile] = useState(null);
	const [isFilePicked, setIsFilePicked] = useState(false);
    const [positionsState, setPositionsState] = useState();
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [errorMessage, setErrorMessage]= useState('');
    const [show, setShow]= useState('');
  
  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = event => {
    hiddenFileInput.current.click();
  };


  const handleChange = event => {
    const fileUploaded = event.target.files[0];
    setIsFilePicked(true);
    setSelectedFile(fileUploaded);
    console.log(event.target.files[0]);
    // props.handleFile(fileUploaded);
  };

  const handleSubmission = () => {
    const formData = new FormData();
    console.log(selectedFile);

    formData.append('File', selectedFile);
    console.log(selectedFile);

    formData.append('Title', title);
    props.addNewHike(formData).catch( (err) => { setErrorMessage(err); setShow(true); } )

    let gpxParser = require('gpxparser');
    var gpx = new gpxParser();
    gpx.parse(selectedFile);
    console.log(gpx);
    console.log(gpx.tracks[0].points.map(p => [p.lat, p.lon]));
    const positions = gpx.tracks[0].points.map(p => [p.lat, p.lon]);
    setPositionsState(positions);
    console.log(positions);
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
                <MapContainer
                    className='map'
                    // should be changed into center={positionsState[0]}
                    center={[40.7317535212683, -73.99685430908403]}

                    zoom={9}
                    scrollWheelZoom={false}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <Polyline
                        pathOptions={{ fillColor: 'red', color: 'blue' }}

                        // should be changed into postitions={positionsState}
                        positions={[
                            [40.689818841705, -74.04511194542516],
                            [40.75853187779803, -73.98495720388513],
                        ]}
                    />
                </MapContainer>
            </div>
        </>
    );
}
export default FileUploader;





