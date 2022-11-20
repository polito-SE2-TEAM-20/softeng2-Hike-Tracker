import './list-of-hikes-style.css'

import { useEffect, useState } from 'react';
import HTNavbar from '../../components/HTNavbar/HTNavbar';
import { Grid } from '@mui/material';
import { Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import LOH_API from './LOH-API';
import HTSideFilter from '../../components/side-filter/HTFilter';
import HTTable from '../../components/table/HTTable';
import HikeCard from '../../components/hike-card/HikeCard';
import HTTopBarFilter from '../../components/side-filter/HTTopBarFilter';
import Skeleton from '@mui/material/Skeleton';

const HTListOfHikes = (props) => {
    const [region, setRegion] = useState('')
    const [province, setProvince] = useState('')
    const [minAsc, setMinAsc] = useState('')
    const [maxAsc, setMaxAsc] = useState('')
    const [minDiff, setMinDiff] = useState('')
    const [maxDiff, setMaxDiff] = useState('')
    const [minLen, setMinLen] = useState('')
    const [maxLen, setMaxLen] = useState('')
    const [minExT, setMinExT] = useState('')
    const [maxExT, setMaxExT] = useState('')

    const values = [region, setRegion, province, setProvince, minAsc,
        setMinAsc, maxAsc, setMaxAsc, minDiff, setMinDiff,
        maxDiff, setMaxDiff, minLen, setMinLen, maxLen, setMaxLen,
        minExT, setMinExT, maxExT, setMaxExT]

    const [isFilterOpen, setFilterOpen] = useState(true)
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
            loh = await LOH_API.getFilteredListOfHikes({ filter })
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
        console.log(hike_obj)
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
                description: hike_obj.description,
                province: hike_obj.province,
                region: hike_obj.region
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
        <div style={{ backgroundColor: "#f2f2f2" }}>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <div style={{ backgroundColor: "#F2F2F2", height: "100%", minHeight: "100vh" }}>
                <Grid container style={{ marginTop: "75px", marginBottom: "20px", display: "flex", justifyContent: "center" }}>
                    <HTTopBarFilter />
                </Grid>
                <Grid container columns={5} style={{ marginTop: "90px", display: "flex", justifyContent: "center" }}>
                    {
                        listOfHikes.map(hike => {
                            return (
                                <Grid item lg={1} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                    <HikeCard hike={hike} />
                                </Grid>
                            );
                        })
                    }
                </Grid>

            </div>
        </div>
    );
}

export default HTListOfHikes