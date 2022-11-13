import MainTitle from '../../components/main-title/MainTitle'
import Button from '../../components/buttons/Button';
import { Row, Col, Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';
import { Link, useNavigate } from "react-router-dom";
import MainPageLandscape from '../../components/main-page-landscape/MainPageLandscape';
import { useState } from 'react';

const MainPage = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    const gotoSignup = () => {
        navigate("/signup", { replace: false })
    }

    const gotoBrowseHikes = () => {
        navigate("/browsehikes", { replace: false })
    }

    return (
        <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", backgroundColor: "#bababa", height: "100vh" }}>
            <Navbar className="is-sticky" expand="lg">
                <Container>
                    <MainTitle color="white" size="48px" />
                    <Button navigate={gotoLogin} text="Login" textColor="black" color="white" size="24px" />
                </Container>
            </Navbar>
            <Row>
                <MainPageLandscape />
            </Row>
            <Row>
                <Col style={{ display: "flex", justifyContent: "end" }}>
                    <Button navigate={gotoBrowseHikes} text="Browse our hikes" textColor="white" size="36px" color="#1a1a1a" />
                </Col>
                <Col style={{ display: "flex", justifyContent: "start" }}>
                    <Button navigate={gotoSignup} text="Create a new account" textColor="white" size="36px" color="#1a1a1a" />
                </Col>
            </Row>
        </Container >
    );
}

export default MainPage