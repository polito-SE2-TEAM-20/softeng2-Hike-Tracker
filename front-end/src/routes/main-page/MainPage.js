import MainTitle from '../../components/main-title/MainTitle'
import Button from '../../components/buttons/Button';
import { Row, Col, Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import MainPageLandscape from '../../components/main-page-landscape/MainPageLandscape';


const MainPage = () => {
    return (
        <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", backgroundColor: "#bababa", height: "100vh" }}>
            <Navbar className="is-sticky" expand="lg">
                <Container>
                    <MainTitle color="white" size="48px" />
                    <Button text="Login" textColor="black" color="white" size="24px" />
                </Container>
            </Navbar>
            <Row>
                <MainPageLandscape />
            </Row>
            <Row>
                <Col style={{ display: "flex", justifyContent: "end" }}>
                    <Button text="Browse our hikes" textColor="white" size="36px" color="#1a1a1a" />
                </Col>
                <Col style={{ display: "flex", justifyContent: "start" }}>
                    <Button text="Create a new account" textColor="white" size="36px" color="#1a1a1a" />
                </Col>
            </Row>
        </Container >
    );
}

export default MainPage