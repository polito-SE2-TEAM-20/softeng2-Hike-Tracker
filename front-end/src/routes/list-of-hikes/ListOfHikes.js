import sampledata from '../../extra/sample-data/samplehikes.json'
import UpAndDown from '../../components/up-and-down-button/UpAndDown';
import './list-of-hikes-style.css'

import { useState } from 'react';

import { Table, Container, Row, Col, Navbar } from 'react-bootstrap';
import MainTitle from '../../components/main-title/MainTitle';
import Button from '../../components/buttons/Button';
import SingleHike from '../../components/single-hike/SingleHike';
import { useNavigate } from 'react-router-dom';

const ListOfHikes = () => {
    const [isFilterOpen, setFilterOpen] = useState(false)
    const [isHikeShown, setHikeShow] = useState(false)
    const [hike, setHike] = useState({ title: "", expectedTime: -1, ascent: -1, difficulty: "", length: -1 })
    const navigate = useNavigate()

    const filterButton = () => {
        setFilterOpen(!isFilterOpen)
    }

    const selectHike = (hike_obj) => {
        var difficulty = "Professional hiker"
        if(hike_obj.difficulty == 0)    difficulty = "Tourist"
        else if(hike_obj.difficulty == 1) difficulty = "Hiker"
        setHike(
            {
                title: hike_obj.title,
                expectedTime: hike_obj.expectedTime,
                ascent: hike_obj.ascent,
                difficulty: difficulty,
                length: hike_obj.length
            }
        )
        setHikeShow(true)
    }

    const closeHike = () => {
        setHikeShow(false)
    }

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    const gotoHome = () => {
        navigate("/", {replace: false})
    }

    return (
        <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", height: "100vh", background: "#807B73", display: "flex", justifyContent: "center" }}>
            <Navbar className="is-sticky" expand="lg">
                <Container>
                    <MainTitle navigate={gotoHome} color="white" size="48px" />
                    <Button navigate={gotoLogin} text="Login" textColor="black" color="white" size="24px" />
                </Container>
            </Navbar>
            <Row style={{marginTop: "100px"}}>
                <Col>
                    <div style={{ backgroundColor: "#FEFBF7", height: "fit-content", width: "auto", borderRadius: "25px", marginTop: "15px", padding: "20px", boxShadow: "0 4px 32px 0 rgb(0 0 0 / 75%)" }}>
                        <Row style={{ display: "flex", placeItems: "center" }}>
                            <Col style={{ display: "grid", justifyContent: "start", marginLeft: "24px" }}>
                                <div className="main-title" style={{ color: "#1a1a1a", fontSize: "48px" }}>
                                    List of hikes
                                </div>
                            </Col>
                            <Col style={{ display: "grid", justifyContent: "end", marginRight: "24px" }}>
                                <svg onClick={filterButton} xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-filter-circle-fill" viewBox="0 0 16 16">
                                    <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zM5 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                </svg>
                            </Col>
                        </Row>
                        <Row hidden={!isFilterOpen} style={{ marginTop: "18px", backgroundColor: "#1a1a1a", borderRadius: "10px" }}>
                            <div style={{ textAlign: "center" }}>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th className='filter-name'>Title</th>
                                            <th className='filter-name'>Expected time</th>
                                            <th className='filter-name'>Ascent</th>
                                            <th className='filter-name'>Difficulty</th>
                                            <th className='filter-name'>Length</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <th><UpAndDown /></th>
                                            <th><UpAndDown /></th>
                                            <th><UpAndDown /></th>
                                            <th><UpAndDown /></th>
                                            <th><UpAndDown /></th>
                                        </tr>
                                    </tbody>
                                </Table>
                            </div>
                        </Row>
                        <div style={{ marginTop: "25px" }}>
                            <Table className='my-table' striped hover style={{ width: "1000px", marginLeft: "auto", marginRight: "auto" }}>
                                <thead style={{ textAlign: "center" }}>
                                    <tr className="my-tr">
                                        <th>Title</th>
                                        <th>Expected time</th>
                                        <th>Ascent</th>
                                        <th>Difficulty</th>
                                        <th>Length</th>
                                    </tr>
                                </thead>
                                <tbody style={{ textAlign: "center" }}>
                                    {
                                        sampledata.map(elem => {
                                            return (
                                                <tr className="my-tr" key={elem.name} onClick={() => selectHike(elem)}>
                                                    <td className="my-td">{elem.title}</td>
                                                    <td className="my-td">{elem.expectedTime} hours</td>
                                                    <td className="my-td">{elem.ascent} m</td>
                                                    <td className="my-td">
                                                        {
                                                            elem.difficulty === 0 ?
                                                                <div style={{ backgroundColor: "#1EE35F", borderRadius: "6px", textAlign: "center", maxWidth: "fit-content", paddingLeft: "10px", paddingRight: "10px", marginLeft: "auto", marginRight: "auto" }}>
                                                                    <b>Tourist</b>
                                                                </div>
                                                                : <></>
                                                        }
                                                        {
                                                            elem.difficulty === 1 ?
                                                                <div style={{ backgroundColor: "#2B86E3", borderRadius: "6px", textAlign: "center", maxWidth: "fit-content", paddingLeft: "10px", paddingRight: "10px", marginLeft: "auto", marginRight: "auto" }}>
                                                                    <b>Hiker</b>
                                                                </div>
                                                                : <></>
                                                        }
                                                        {
                                                            elem.difficulty === 2 ?
                                                                <div style={{ backgroundColor: "#E33D19", borderRadius: "6px", textAlign: "center", maxWidth: "fit-content", paddingLeft: "10px", paddingRight: "10px", marginLeft: "auto", marginRight: "auto" }}>
                                                                    <b>Professional hiker</b>
                                                                </div>
                                                                : <></>
                                                        }
                                                    </td>
                                                    <td className="my-td">{elem.length} m</td>
                                                </tr>
                                            );
                                        })
                                    }
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Col>
                <Col hidden={!isHikeShown} style={{ paddingTop: "15px" }}>
                    <SingleHike closeCallback={closeHike} hike={hike}/>
                </Col>
            </Row>

        </Container>
    );
}

export default ListOfHikes