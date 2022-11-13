import React from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'
import './browse-hikes-style.css'

import MainTitle from '../../components/main-title/MainTitle'
import Button from '../../components/buttons/Button';
import { Row, Container } from 'react-bootstrap'
import { MapBrowseHike } from '../../components/map/MapBrowseHike';
import SearchBar from '../../components/searchbar/SearchBar';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router';



const BrowseHikes = () => {
    const navigate = useNavigate()
    const gotoHome = () => {
        navigate("/", {replace: false})
    }
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    return (
        <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px"}}>
            <Navbar className="is-sticky" expand="lg">
                <Container>
                    <MainTitle navigate={gotoHome} color="white" size="48px" />
                    <div style={{ display: 'flex', justifyContent: "center" }}>
                        <SearchBar />
                    </div>
                    <div className='filtercontainer'>

                    </div>
                    <Button navigate={gotoLogin} text="Login" textColor="black" color="white" size="24px" />
                </Container>
            </Navbar>
            <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                <MapBrowseHike />
            </Row>
        </Container >
    );
}

export default BrowseHikes;
