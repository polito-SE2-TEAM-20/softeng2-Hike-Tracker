import './single-hike-style.css'
import '../main-title/main-title-style.css'

import { Container, Row, Table } from 'react-bootstrap';
import { Col } from 'react-bootstrap';

const SingleHike = (props) => {
    return (
        <div>
            <Container style={{ backgroundColor: "#E2FFBE", borderRadius: "16px", maxWidth: "750px", boxShadow: "0 4px 32px 0 rgb(0 0 0 / 75%)" }}>
                <Row style={{ display: "flex", placeItems: "center", marginLeft:"15px", marginRight:"15px", paddingLeft: "24px", paddingRight: "24px" }}>
                    <Col style={{ display: "flex", justifyContent: "center" }}>
                        <div className='main-title' style={{ fontSize: "32px", color: "#1a1a1a", paddingTop: "12px" }}><b>{props.hike.title}</b></div>
                    </Col>
                    <Col onClick={props.closeCallback} lg={1} xm={1} xs={2} md={1} style={{ display: "flex", justifyContent: "end" }}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="#1a1a1a" class="bi bi-x-circle" viewBox="0 0 16 16">
                            <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                        </svg>
                    </Col>
                </Row>
                <div style={{ backgroundColor: "#BDF17C", borderRadius: "24px", margin:"auto", marginTop: "12px", marginBottom: "12px", padding: "12px", maxWidth: "400px" }}>
                    <Row>
                        <Row>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>Province:</div>
                            </Col>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>{props.hike.province}</div>
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>Region:</div>
                            </Col>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>{props.hike.region}</div>
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>Expected time:</div>
                            </Col>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>{props.hike.expectedTime} hours</div>
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>Length:</div>
                            </Col>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>{props.hike.length} km</div>
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>Ascent:</div>
                            </Col>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>{props.hike.ascent} m</div>
                            </Col>
                        </Row>
                    </Row>
                    <Row>
                        <Row>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>Difficulty:</div>
                            </Col>
                            <Col>
                                <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a" }}>{props.hike.difficulty}</div>
                            </Col>
                        </Row>
                    </Row>
                </div>
                <Row>
                    <div className='main-title' style={{ fontSize: "20px", color: "#1a1a1a", display: "flex", justifyContent: "center", padding: "25px" }}>{props.hike.description}</div>
                </Row>
            </Container>
        </div>
    );
}

export default SingleHike