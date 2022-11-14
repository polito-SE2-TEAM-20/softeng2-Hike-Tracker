import React, { useEffect, useState } from 'react'

import 'bootstrap/dist/css/bootstrap.min.css';
import 'leaflet/dist/leaflet.css'
import './browse-hikes-style.css'

import MainTitle from '../../components/main-title/MainTitle'
import HTButton from '../../components/buttons/Button'
import { Row, Container } from 'react-bootstrap'
import { MapBrowseHike } from '../../components/map/MapBrowseHike';
import SearchBar from '../../components/searchbar/SearchBar';
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from 'react-router';
import BH_API from './BH-API';
import LOH_API from '../list-of-hikes/LOH-API';

const BrowseHikes = (props) => {
    const navigate = useNavigate()
    const [listOfHikes, setListOfHikes] = useState([])
    const gotoHome = () => {
        navigate("/", { replace: false })
    }
    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    useEffect(() => {
        var loh = []
        const getHikes = async () => {
            loh = await LOH_API.getListOfHikes()
        }
        getHikes().then(() => {
            console.log(loh)
            setListOfHikes(loh)
        });
    }, [])

    return (
        <>
            {
                props.isLoggedIn ?
                    < Container fluid style={{ paddingLeft: "0px", paddingRight: "0px" }
                    }>
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
                                        <HTButton text="Login" color="white" textColor="black" size="24px" variant="contained" />
                                        :
                                        <HTButton navigate={props.doLogOut} text="Logout" color="white" textColor="black" size="24px" variant="contained" />
                                }
                            </Container>
                        </Navbar>
                        <Row style={{ marginLeft: "0px", marginRight: "0px" }}>
                            <MapBrowseHike />
                        </Row>
                    </Container >
                    :
                    <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", height: "100vh", background: "#807B73", display: "flex", justifyContent: "center" }}>
                        <Row>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "150px" }}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" fill="currentColor" class="bi bi-emoji-angry" viewBox="0 0 16 16">
                                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                    <path d="M4.285 12.433a.5.5 0 0 0 .683-.183A3.498 3.498 0 0 1 8 10.5c1.295 0 2.426.703 3.032 1.75a.5.5 0 0 0 .866-.5A4.498 4.498 0 0 0 8 9.5a4.5 4.5 0 0 0-3.898 2.25.5.5 0 0 0 .183.683zm6.991-8.38a.5.5 0 1 1 .448.894l-1.009.504c.176.27.285.64.285 1.049 0 .828-.448 1.5-1 1.5s-1-.672-1-1.5c0-.247.04-.48.11-.686a.502.502 0 0 1 .166-.761l2-1zm-6.552 0a.5.5 0 0 0-.448.894l1.009.504A1.94 1.94 0 0 0 5 6.5C5 7.328 5.448 8 6 8s1-.672 1-1.5c0-.247-.04-.48-.11-.686a.502.502 0 0 0-.166-.761l-2-1z" />
                                </svg>
                            </div>
                            <div style={{ display: "flex", justifyContent: "center", marginTop: "0px" }}>
                                <b>We don't know how you managed to get here, but you do not have the rights to stay.</b>
                            </div>
                        </Row>
                    </Container>
            }
        </>
    );
}

export default BrowseHikes;
