import React from 'react'

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'

import MainTitle from './components/main-title/MainTitle'
import Button from './components/buttons/Button';
import { Row, Container } from 'react-bootstrap'
import { Map } from './components/map/Map';

import Navbar from 'react-bootstrap/Navbar';

const BrowseHikes = () => {
    return (
        <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", backgroundColor: "#303030" }}>
            <Navbar expand="lg">
                <Container>
                    <MainTitle color="white" size="48px" />
                    <Button text="Login" textColor="black" color="white" size="24px" />
                </Container>
            </Navbar>
            <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                <Map />
            </Row>
        </Container>
    );
}

export default BrowseHikes;
