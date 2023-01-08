import './list-of-huts-style.css'

import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import API from '../../API/API.js';
import HutCard from '../../components/hut-card/HutCard';
import HTTopBarFilterHut from '../../components/side-filter/HTTopBarFilterHut';
import Skeleton from '@mui/material/Skeleton';
import { UserRoles } from '../../lib/common/UserRoles';

const HTListOfHikes = (props) => {
    const [listOfHuts, setListOfHuts] = useState([])
    const navigate = useNavigate()
    const [filter, setFilter] = useState({
        "priceMin": null,
        "priceMax": null,
        "numberOfBedsMin": null,
        "numberOfBedsMax": null
    })
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        var loh = []
        const getHuts = async () => {
            loh = await API.getListOfHuts({})
        }
        getHuts().then(() => {
            setListOfHuts(loh)
            setLoading(true)
        });
    }, [])

    useEffect(() => {
        console.log(filter)
        var loh = []
        const getHikes = async () => {
            loh = await API.getListOfHuts(filter)
        }
        getHikes().then(() => {
            setListOfHuts(loh)
        });
    }, [filter])

    if (props.user?.role !== UserRoles.HIKER &&
        props.user?.role !== UserRoles.LOCAL_GUIDE &&
        props.user?.role !== UserRoles.PLATFORM_MANAGER &&
        props.user?.role !== UserRoles.HUT_WORKER) {
        navigate('/unauthorized')
    }
    return (
        <>
            <Grid container>
                <Grid item sm>
                    <HTTopBarFilterHut listOfHuts={listOfHuts} loading={loading} setFilter={setFilter} />
                </Grid>
                <Grid item lg={9}>
                    <Grid container columns={5} style={{ marginTop: "25px", display: "flex", justifyContent: "center" }}>
                        {
                            loading ?
                                listOfHuts.length == 0 ?
                                    <Typography fontFamily={"Bakbak One, display"} fontWeight="600" fontSize="32px">
                                        No matching huts.
                                    </Typography>
                                    :
                                    listOfHuts.map(hut => {
                                        return (
                                            <Grid item md={2} xl={1} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                                <HutCard hut={hut} />
                                            </Grid>
                                        );
                                    })
                                :
                                <>
                                    <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                        <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                        <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                        <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                    </Grid>
                                    <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                        <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                        <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                        <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                    </Grid>
                                    <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                        <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                        <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                        <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                    </Grid>
                                    <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                        <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                        <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                        <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                    </Grid>
                                    <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                        <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                        <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                        <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                    </Grid>
                                    <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                        <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                        <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                        <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                    </Grid>
                                    <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                        <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                        <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                        <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                    </Grid>
                                    <Grid lg={1} item sx={{ width: 120, marginRight: 0.5, my: 5 }}>
                                        <Skeleton variant='rectangular' height={150} width={250} style={{ marginBottom: "10px" }} />
                                        <Skeleton variant='rectangular' height={20} width={200} style={{ marginBottom: "4px" }} />
                                        <Skeleton variant='rectangular' height={20} width={140} style={{ marginBottom: "4px" }} />
                                    </Grid>
                                </>
                        }
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
}

export default HTListOfHikes