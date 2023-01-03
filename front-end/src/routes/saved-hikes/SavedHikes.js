import '../list-of-hikes/list-of-hikes-style.css'

import { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import API from '../../API/API.js';
import HikeCard from '../../components/hike-card/HikeCard';
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

const SavedHikes = (props) => {
    const [listOfHikes, setListOfHikes] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
            var loh = []
            const getHikes = async () => {
                // cambiare con l'API giusta
                loh = await API.getListOfHikes()
            }
            getHikes().then(() => {
                setListOfHikes(loh)
                setLoading(true)
            });
       
    }, [])


    return (
        <>
            <Grid container style={{justifyContent: "center"}}>
                <Grid item lg={9} style={{justifyContent: "center"}}>
                    <Grid container columns={8} style={{ marginTop: "25px", display: "flex", justifyContent: "center" }}>
                        {
                            loading ?
                                listOfHikes.length === 0 ?
                                    <Typography fontFamily={"Bakbak One, display"} fontWeight="600" fontSize="32px">
                                        No matching hikes.
                                    </Typography>
                                    :
                                    listOfHikes.map(hike => {
                                        return (
                                            <Grid item md={2} xl={2} style={{ marginLeft: "15px", marginRight: "15px", marginBottom: "15px", justifyContent:"center" }}>
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

export default SavedHikes