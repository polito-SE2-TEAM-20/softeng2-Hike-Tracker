import React from 'react'
import { useState } from 'react';

import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'

import MainTitle from './components/main-title/MainTitle'
import MainPageLandscape from './components/main-page-landscape/MainPageLandscape';
import Button from './components/buttons/Button';
import { Row, Col, Container } from 'react-bootstrap'
import ListElement from './components/list-element/ListElement';
import { Map } from './components/map/Map';

import Navbar from 'react-bootstrap/Navbar';

function App() {
  return (
    <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", backgroundColor: "#303030" }}>
      <Navbar expand="lg">
        <Container>
          <MainTitle color="white" size="48px" />
          <Button text="Login" textColor="black" color="white" size="24px" />
        </Container>
      </Navbar>
      <Row style={{marginLeft: "0px", marginRight: "0px"}}>
        <Map />
      </Row>
    </Container>
  );
}

export default App;
