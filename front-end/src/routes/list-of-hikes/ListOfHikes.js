import sampledata from '../../extra/sample-data/samplehikes.json'
import UpAndDown from '../../components/up-and-down-button/UpAndDown';
import './list-of-hikes-style.css'

import { useEffect, useState } from 'react';

import { Table, Container, Row, Col, Navbar } from 'react-bootstrap';
import MainTitle from '../../components/main-title/MainTitle';
import Button from '../../components/buttons/Button';
import SingleHike from '../../components/single-hike/SingleHike';
import Filter from '../../components/filter/Filter'
import Sorting from '../../components/sorting/Sorting'
import { useNavigate } from 'react-router-dom';
import LOH_API from './LOH-API';

const ListOfHikes = (props) => {
    const [isFilterOpen, setFilterOpen] = useState(false)
    const [isSortingOpen, setSortingOpen] = useState(false)
    const [isHikeShown, setHikeShow] = useState(false)
    const [hike, setHike] = useState({ title: "", expectedTime: -1, ascent: -1, difficulty: "", length: -1 })
    const [listOfHikes, setListOfHikes] = useState([])
    const navigate = useNavigate()
    const [filter, setFilter] = useState({
        "province": null,
        "region": null,
        "maxLength": null,
        "minLength": null,
        "expectedTimeMin": null,
        "expectedTimeMax": null,
        "difficultyMin": null,
        "difficultyMax": null,
        "ascentMin": null,
        "ascentMax": null
    })
    const [title, setTitle] = useState(0)
    const [expectedTime, setExpectedTime] = useState(0)
    const [ascent, setAscent] = useState(0)
    const [difficulty, setDifficulty] = useState(0)
    const [length, setLength] = useState(0)
    const filterStates = { setTitle, setExpectedTime, setAscent, setDifficulty, setLength }

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

    useEffect(() => {
        var loh = []
        const getHikes = async () => {
            loh = await LOH_API.getFilteredListOfHikes(filter)
        }
        getHikes().then(() => {
            console.log(loh)
            setListOfHikes(loh)
        });
    }, [filter])

    const filterButton = () => {
        setFilterOpen(!isFilterOpen)
    }

    const sortingButton = () => {
        setSortingOpen(!isSortingOpen)
    }

    const selectHike = (hike_obj) => {
        var difficulty = "Professional hiker"
        if (hike_obj.difficulty == 0) difficulty = "Tourist"
        else if (hike_obj.difficulty == 1) difficulty = "Hiker"
        setHike(
            {
                title: hike_obj.title,
                expectedTime: hike_obj.expectedTime,
                ascent: hike_obj.ascent,
                difficulty: difficulty,
                length: hike_obj.length,
                description: hike_obj.description
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
        navigate("/", { replace: false })
    }

    return (
        <div>
            {
                props.isLoggedIn ?
                    <Container fluid style={{ paddingLeft: "0px", paddingRight: "0px", height: "100%", minHeight: "100vh", background: "#807B73", display: "flex", justifyContent: "center", paddingBottom:"42px" }}>
                        <Navbar className="is-sticky" expand="lg">
                            <Container>
                                <MainTitle navigate={gotoHome} color="white" size="48px" />
                                {
                                    !props.isLoggedIn ?
                                        <Button navigate={gotoLogin} text="Login" textColor="black" color="white" size="24px" />
                                        :
                                        <Button navigate={props.doLogOut} text="Logout" textColor="black" color="white" size="24px" />
                                }
                            </Container>
                        </Navbar>
                        <Row style={{ marginTop: "100px" }}>
                            <Col>
                                <div style={{ backgroundColor: "#FEFBF7", height: "fit-content", width: "auto", borderRadius: "25px", marginTop: "15px", padding: "20px", boxShadow: "0 4px 32px 0 rgb(0 0 0 / 75%)" }}>
                                    <Row style={{ display: "flex", placeItems: "center" }}>
                                        <Col style={{ display: "grid", justifyContent: "start", marginLeft: "24px" }}>
                                            <div className="main-title" style={{ color: "#1a1a1a", fontSize: "48px" }}>
                                                List of hikes
                                            </div>
                                        </Col>
                                        <Col lg={1} style={{ display: "grid", justifyContent: "end", marginRight: "24px" }}>
                                            <svg onClick={filterButton} xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-filter-circle-fill" viewBox="0 0 16 16">
                                                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zM3.5 5h9a.5.5 0 0 1 0 1h-9a.5.5 0 0 1 0-1zM5 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm2 3a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 0 1h-1a.5.5 0 0 1-.5-.5z" />
                                            </svg>
                                        </Col>
                                        <Col lg={1} style={{ display: "grid", justifyContent: "end", marginRight: "24px" }}>
                                            <svg onClick={sortingButton} xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="currentColor" class="bi bi-sort-alpha-down" viewBox="0 0 16 16">
                                                <path fill-rule="evenodd" d="M10.082 5.629 9.664 7H8.598l1.789-5.332h1.234L13.402 7h-1.12l-.419-1.371h-1.781zm1.57-.785L11 2.687h-.047l-.652 2.157h1.351z" />
                                                <path d="M12.96 14H9.028v-.691l2.579-3.72v-.054H9.098v-.867h3.785v.691l-2.567 3.72v.054h2.645V14zM4.5 2.5a.5.5 0 0 0-1 0v9.793l-1.146-1.147a.5.5 0 0 0-.708.708l2 1.999.007.007a.497.497 0 0 0 .7-.006l2-2a.5.5 0 0 0-.707-.708L4.5 12.293V2.5z" />
                                            </svg>
                                        </Col>
                                    </Row>
                                    <Filter filterFunctions={filterStates} open={isFilterOpen} />
                                    <Sorting setFilter={setFilter} open={isSortingOpen} />
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
                                                    listOfHikes?.sort(function (x, y) {
                                                        if (title == -1) if (x.title < y.title) return -1; else return 1; else if (title == 1) { if (x.title < y.title) return 1; else return -1 };
                                                        if (expectedTime == -1) if (x.expectedTime < y.expectedTime) return -1; else return 1; else if (expectedTime == 1) { if (x.expectedTime < y.expectedTime) return 1; else return -1 };
                                                        if (ascent == -1) if (x.ascent < y.ascent) return -1; else return 1; else if (ascent == 1) { if (x.ascent < y.ascent) return 1; else return -1 };
                                                        if (difficulty == -1) if (x.difficulty < y.difficulty) return -1; else return 1; else if (difficulty == 1) { if (x.difficulty < y.difficulty) return 1; else return -1 };
                                                        if (length == -1) if (x.length < y.length) return -1; else return 1; else if (length == 1) { if (x.length < y.length) return 1; else return -1 };
                                                    }).map(elem => {
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
                                <SingleHike closeCallback={closeHike} hike={hike} />
                            </Col>
                        </Row>
                    </Container>
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
        </div>
    );
}

export default ListOfHikes