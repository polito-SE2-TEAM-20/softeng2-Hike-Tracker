
import MainTitle from '../components/main-title/MainTitle'

import PageLandscape from './PageLandscape';
import Button from '../components/buttons/Button';
import { Row, Col, Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from "react-router-dom";
import { useState } from 'react';


function LocalGuide(props){
    const navigate = useNavigate();

const gotoLogin = () => {
    navigate("/login", { replace: false })
}


const goToAddNewHike = () => {
    navigate("/hikeGpx", { replace: false })
}

const gotoBrowseHikes = () => {
    navigate("/browsehikes", { replace: false })
}

const gotoListOfHikes = () => {
    navigate("/listofhikes", { replace: false })
}


const gotoHomeLocal = () => {
    navigate("/localGuide", { replace: false })
}


    return(        
    
    <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", backgroundColor: "#bababa", height: "100vh" }}>
    <Navbar className="is-sticky" expand="lg">
        <Container>
            <MainTitle navigate={gotoHomeLocal} color="white" size="48px" />
            {
                !props.isLoggedIn ?
                    <Button navigate={gotoLogin} text="Login" textColor="black" color="white" size="24px" />
                    :
                    <Button navigate={props.doLogOut} text="Logout" textColor="black" color="white" size="24px" />
            }
        </Container>
    </Navbar>
    <Row>
        <PageLandscape />
        {console.log(props.user)}
    </Row>

    <Row>
                {/*<Col style={{ display: "flex", justifyContent: "center" }}>
                    <Button navigate={gotoBrowseHikes} text="Browse our hikes" textColor="white" size="36px" color="#1a1a1a" />
                </Col>
                <Col style={{ display: "flex", justifyContent: "center" }}>
                    <Button navigate={gotoListOfHikes} text="Go to list of hikes" textColor="white" size="36px" color="#1a1a1a" />
        </Col>*/}
                        <Col style={{ display: "flex", justifyContent: "center" }}>
                            <Button navigate={goToAddNewHike} text="Add a new hike" textColor="white" size="36px" color="#1a1a1a" />
                        </Col>
            </Row>
</Container >
    )
}

export {LocalGuide}