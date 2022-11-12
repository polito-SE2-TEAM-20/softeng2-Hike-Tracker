import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'
import './browse-hikes-style.css'

import MainTitle from '../components/main-title/MainTitle'
import Button from '../components/buttons/Button';
import { Row, Container } from 'react-bootstrap'
import { Map } from '../components/map/Map';
import SearchBar from '../components/searchbar/SearchBar';

import Navbar from 'react-bootstrap/Navbar';

const BrowseHikes = () => {
    return (
        <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px"}}>
            <Navbar className="is-sticky" expand="lg">
                <Container>
                    <MainTitle color="white" size="48px" />
                    <div style={{ display: 'flex', justifyContent: "center" }}>
                        <SearchBar />
                    </div>
                    <div className='filtercontainer'>

                    </div>
                    <Button text="Login" textColor="black" color="white" size="24px" />
                </Container>
            </Navbar>
            <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                <Map />
            </Row>
        </Container >
    );
}

export default BrowseHikes;
