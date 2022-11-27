import './list-of-hikes-style.css'

import { useEffect, useState } from 'react';
import HTNavbar from '../../components/HTNavbar/HTNavbar';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../API/API.js';
import HikeCard from '../../components/hike-card/HikeCard';
import HTTopBarFilterHike from '../../components/side-filter/HTTopBarFilterHike';
import Skeleton from '@mui/material/Skeleton';

const HikeLoading = () => {
    return (
        <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
            <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
            <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
            <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
        </Grid>
    );
}

const HTListOfHikes = (props) => {
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
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        var loh = []
        const getHikes = async () => {
            loh = await API.getListOfHikes()
        }
        getHikes().then(() => {
            setListOfHikes(loh)
            setLoading(true)
        });
    }, [])

    useEffect(() => {
        var loh = []
        const getHikes = async () => {
            loh = await API.getFilteredListOfHikes({ filter })
        }
        getHikes().then(() => {
            setListOfHikes(loh)
        });
    }, [filter])

    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    return (
        <>
            <HTNavbar user={props.user} isLoggedIn={props.isLoggedIn} doLogOut={props.doLogOut} gotoLogin={gotoLogin} />
            <Grid container style={{ marginTop: "75px" }}>
                <Grid item sm>
                    <HTTopBarFilterHike listOfHikes={listOfHikes} loading={loading} setFilter={setFilter} filter={filter} />
                </Grid>
                <Grid item lg={9}>
                    <Grid container columns={5} style={{ marginTop: "25px", display: "flex", justifyContent: "center" }}>
                        {
                            loading ?
                                listOfHikes.length == 0 ?
                                    <Typography fontFamily={"Bakbak One, display"} fontWeight="600" fontSize="32px">
                                        No matching hikes.
                                    </Typography>
                                    :
                                    listOfHikes.map(hike => {
                                        return (
                                            <Grid item md={2} xl={1} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                                <HikeCard hike={hike} editable={false} />
                                            </Grid>
                                        );
                                    })
                                :
                                <>
                                    <HikeLoading />
                                    <HikeLoading />
                                    <HikeLoading />
                                    <HikeLoading />
                                    <HikeLoading />
                                    <HikeLoading />
                                    <HikeLoading />
                                    <HikeLoading />
                                </>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default HTListOfHikes