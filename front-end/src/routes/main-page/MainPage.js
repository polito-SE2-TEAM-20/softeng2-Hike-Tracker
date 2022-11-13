import MainTitle from '../../components/main-title/MainTitle'
import Button from '../../components/buttons/Button';
import { Row, Container } from 'react-bootstrap'
import Navbar from 'react-bootstrap/Navbar';
import { useNavigate } from "react-router-dom";
import MainPageLandscape from '../../components/main-page-landscape/MainPageLandscape';


const MainPage = () => {
    return (
        <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px" }}>
            <Navbar className="is-sticky" expand="lg">
                <Container>
                    <MainTitle color="white" size="48px" />
                    <Button text="Login" textColor="black" color="white" size="24px" />
                </Container>
            </Navbar>
            <Row>
                <MainPageLandscape />
            </Row>
        </Container >
    );
}

export default MainPage