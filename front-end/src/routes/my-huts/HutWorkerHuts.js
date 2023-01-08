import API from '../../API/API.js';

import { useEffect, useState } from 'react';
import { Grid, Typography, Skeleton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import HutCard from '../../components/hut-card/HutCard';
import {UserRoles} from '../../lib/common/UserRoles'


function HutWorkerHuts(props) {
    const [myHuts, setMyHuts] = useState([])
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        setLoading(true);
        API.getHutsHutWorker().then((huts) => {
            setMyHuts(oldHuts => huts)
            setLoading(false)
            console.log(huts)
        });
    }, [])


    const gotoLogin = () => {
        navigate("/login", { replace: false })
    }

    if (
        props.user?.role !== UserRoles.HUT_WORKER) {
        navigate('/unauthorized')
    }


    return (
        <>
            <Grid container style={{ marginTop: "75px" }}>
                <Grid item lg={9}>
                    <Grid container columns={5} style={{ marginTop: "25px", display: "flex", justifyContent: "center" }}>

                        {(!loading && myHuts.length === 0) &&
                            <Typography fontFamily={"Bakbak One, display"} fontWeight="600" fontSize="32px">
                                No matching huts.
                            </Typography>
                        }
                        {(!loading && myHuts.length > 0) &&
                            myHuts.map(hut => {
                                return (
                                    <>
                                        <Grid item md={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px" }}>
                                            <HutCard hut={hut} editable="true" />
                                        </Grid>
                                    </>
                                );
                            })

                        }

                        {
                            loading &&
                            <>
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

export { HutWorkerHuts }

