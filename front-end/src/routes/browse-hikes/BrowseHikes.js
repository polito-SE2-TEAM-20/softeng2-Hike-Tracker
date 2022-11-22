import React, { useEffect, useState } from 'react'

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
import BH_API from './BH-API';

const BrowseHikes = (props) => {
    const navigate = useNavigate()
    const [listOfGPXFiles, setListOfGPXFiles] = useState([]) 
    const gotoHome = () => {
        navigate("/", { replace: false })
    }
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    useEffect(() => {
        var gpxList = []
        const getGPXFiles = async () => {
            gpxList = await BH_API.getListOfGPXFiles()
        }
        getGPXFiles().then(() => {
            console.log(gpxList)
            setListOfGPXFiles(gpxList)
        });
    }, [])

    return (
        <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px" }}>
            <Navbar className="is-sticky" expand="lg">
                <Container>
                    <MainTitle navigate={gotoHome} color="white" size="48px" />
                    <div style={{ display: 'flex', justifyContent: "center" }}>
                        <SearchBar />
                    </div>
                    <div className='filtercontainer'>

                    </div>
                    {
                        !props.isLoggedIn ?
                            <Button navigate={gotoLogin} text="Login" textColor="black" color="white" size="24px" />
                            :
                            <Button navigate={() => { props.doLogOut(false) }} text="Logout" textColor="black" color="white" size="24px" />
                    }                </Container>
            </Navbar>
            <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                <MapBrowseHike />
            </Row>
        </Container >
    );
}

export default BrowseHikes;